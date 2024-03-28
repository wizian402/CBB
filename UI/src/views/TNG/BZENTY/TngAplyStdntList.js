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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react';

const TngAplyStdntList = () => {
  const [tngNo, setTngNo] = useState(null);
  const [stdntList, setStdntList] = useState([]);
  const [selectedTng, setSelectedTng] = useState(null);

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
    fetch('/cbb/tng/perStdnt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tngNo }),
    })
      .then(response => response.json())
      .then(data => {
        setStdntList(data);
      })
      .catch(error => console.error('Error fetching student list:', error));
  };

  const handleModalOpen = (selectedTng) => {
    if (selectedTng.nm == '실습신청') {
      setSelectedTng(selectedTng);
    }
  };

  const handleModalClose = () => {
    setSelectedTng(null);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>현장 실습 신청 학생</strong>
          </CCardHeader>
          <CCardBody>
            {stdntList.length === 0 ? (
              <div>신청 학생이 없습니다.</div>
            ) : (
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ width: '10%' }} className="text-center">NO</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">학생이름</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">학과</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">학년</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">생년월일</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">진행상태</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {stdntList.map((stdnt, index) => (
                    <CTableRow key={index} onClick={() => handleModalOpen(stdnt)}>
                      <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                      <CTableDataCell className="text-center">{stdnt.stdntNm}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {stdnt.scsbjtNm}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{stdnt.stdntGrd}학년</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {stdnt.stdntBrdt && stdnt.stdntBrdt.replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일')}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {stdnt.nm}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <TNGDetailModal selectedTng={selectedTng} onClose={handleModalClose} tngNo={tngNo} fetchStdntList={fetchStdntList} />
    </CRow>
  );
};

const TNGDetailModal = ({ selectedTng, onClose, tngNo, fetchStdntList }) => {
  const navigate = useNavigate();
  const handleApproval = () => {
    fetch('/cbb/tng/selecStdnt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tngNo: tngNo, stdntSn: selectedTng.stdntSn })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        if (data == 'success') {
          fetchStdntList();
          alert("학생선발을 완료했습니다.")
        } else if (data == 'fail') {
          alert("정원이 다 찼습니다.")
          navigate('/tngList');
        } else {
          console.log('Unexpected response received from server:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching selecStdnt:', error);
      });
    onClose();
  };

  const handleModalClose = () => {
    onClose();
  };

  return (
    <CModal alignment="center" visible={selectedTng !== null} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>현장 실습 학생 선발</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CTable>
          <CTableBody>
            <CTableRow>
              <CTableHeaderCell>학생 이름:</CTableHeaderCell>
              <CTableDataCell>{selectedTng && selectedTng.stdntNm}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>학과:</CTableHeaderCell>
              <CTableDataCell>{selectedTng && selectedTng.scsbjtNm}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>학년:</CTableHeaderCell>
              <CTableDataCell>{selectedTng && selectedTng.stdntGrd}학년</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>생년월일:</CTableHeaderCell>
              <CTableDataCell>
                {selectedTng && selectedTng.stdntBrdt &&
                  `${selectedTng.stdntBrdt.substring(0, 4)}년 ${parseInt(selectedTng.stdntBrdt.substring(4, 6), 10)}월 ${parseInt(selectedTng.stdntBrdt.substring(6, 8), 10)}일`
                }
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableHeaderCell>연락처:</CTableHeaderCell>
              <CTableDataCell>{selectedTng && selectedTng.stdntTelNo && selectedTng.stdntTelNo.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleApproval}>승인</CButton>
        <CButton color="secondary" onClick={handleModalClose}>닫기</CButton>
      </CModalFooter>
    </CModal>
  );
};


export default TngAplyStdntList;
