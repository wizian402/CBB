import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';

const TngProgStdnt = () => {
  const [tngNo, setTngNo] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [stdntList, setStdntList] = useState([]);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedTngNo = sessionStorage.getItem("selectedTngNo");
    const userGroupCd = localStorage.getItem('userGroupCd');
    setTngNo(selectedTngNo);
    if (userGroupCd !== '50') {
      localStorage.clear()
      alert('로그인후 이용가능합니다.')
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (tngNo) {
      fetchStdntList();
    }
  }, [tngNo]);

  const fetchStdntList = () => {
    fetch('/cbb/tng/progStdnt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tngNo }),
    })
      .then(response => response.json())
      .then(data => {
        setStdntList(data)
      })
      .catch(error => console.error('Error fetching student list:', error));
  };

  const handleGradeInput = (student) => {
    setSelectedStudent(student);
    setIsGradeModalOpen(true);
  };

  const handleModalClose = () => {
    setIsGradeModalOpen(false);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>현장 실습 신청 학생</strong>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: '10%' }} className="text-center">NO</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">학번</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">학생이름</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">총 실습 시간</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">성적</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">조치</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {stdntList.map((stdnt, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                    <CTableDataCell className="text-center">{stdnt.stdntSn}</CTableDataCell>
                    <CTableDataCell className="text-center">{stdnt.stdntNm}</CTableDataCell>
                    <CTableDataCell className="text-center">{stdnt.stdntHr}시간</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {stdnt.idnstEvlYn === 'N' ? '미등록' : stdnt.idnstEvlYn === 'Y' && stdnt.grd}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <StudentActionsDropdown student={stdnt} onGradeInput={handleGradeInput} navigate={navigate} tngNo={tngNo} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <GradeInputModal isOpen={isGradeModalOpen} onClose={handleModalClose} student={selectedStudent} tngNo={tngNo} refreshStudentList={fetchStdntList} />
    </CRow>
  );
};

const StudentActionsDropdown = ({ student, onGradeInput, navigate, tngNo }) => {
  const navigateToTngAttend = () => {
    sessionStorage.setItem('selectedTngNo', tngNo);
    sessionStorage.setItem('stdntSn', student.stdntSn);
    navigate('/tngAttend');
  };

  const navigateToTngRcd = () => {
    sessionStorage.setItem('selectedTngNo', tngNo);
    sessionStorage.setItem('stdntSn', student.stdntSn);
    navigate('/tngRcd');
  };

  return (
    <CDropdown>
      <CDropdownToggle color="primary" size="sm">
        조치
      </CDropdownToggle>
      <CDropdownMenu>
        {student.idnstEvlYn !== 'Y' && (
          <CDropdownItem onClick={() => onGradeInput(student)}>성적입력</CDropdownItem>
        )}
        <CDropdownItem onClick={navigateToTngAttend}>출석 입력</CDropdownItem>
        <CDropdownItem onClick={navigateToTngRcd}>지도일지 입력</CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};


const GradeInputModal = ({ isOpen, onClose, student, tngNo, refreshStudentList }) => {
  const [score, setScore] = useState('');

  const handleScoreChange = (event) => {
    setScore(event.target.value);
  };

  const fetchGrade = () => {
    if (!isNaN(score) && parseInt(score) >= 0 && parseInt(score) <= 100) {
      fetch('/cbb/tng/regGrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tngNo, stdntSn: student.stdntSn, score }),
      })
        .then(response => response.text())
        .then(data => {
          if (data === 'fail') {
            alert('이미 성적을 입력했습니다.');
            refreshStudentList();
          } else if (data === 'success') {
            alert('성적 입력에 성공했습니다.');
            onClose();
            refreshStudentList();
          } else if (data === 'fail2') {
            alert('이수 시간이 부족합니다.');
            onClose();
            refreshStudentList();
          }
        })
        .catch(error => console.error('Error fetching student list:', error));
    } else {
      alert('점수는 숫자이고 0에서 100 사이의 값이어야 합니다.');
      setScore('');
    }
  };


  return (
    <CModal alignment="center" visible={isOpen} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>성적 입력</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="form-group">
          <label htmlFor="score">성적 입력:</label>
          <input
            type="number"
            className="form-control"
            id="score"
            placeholder="점수를 입력하세요"
            value={score}
            onChange={handleScoreChange}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={fetchGrade}>성적 입력</CButton>
        <CButton color="secondary" onClick={onClose}>닫기</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default TngProgStdnt;
