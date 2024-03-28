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
  CPagination,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CFormInput,
  CPaginationItem
} from '@coreui/react';

const StdntAply = () => {
  const navigate = useNavigate();
  const [tngList, setTngList] = useState([]);
  const [bzentyNmList, setBzentyNmList] = useState([]);
  const [selectedTng, setSelectedTng] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loginId, setLoginId] = useState("");
  const [enteredTask, setEnteredTask] = useState("");

  useEffect(() => {
    setLoginId(localStorage.getItem('loginId'));
    const userGroupCd = localStorage.getItem('userGroupCd');
    if (userGroupCd !== '20') {
      localStorage.clear();
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
    } else {
      fetchTngList();
      fetchBzentyNmList();
    }
  }, []);

  const fetchTngList = () => {
    fetch('/cbb/tng/stdntAly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTngList(data))
      .catch(error => console.error('Error fetching training list:', error));
  };

  const fetchBzentyNmList = () => {
    fetch('/cbb/tng/bzentyNmList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setBzentyNmList(data);
      })
      .catch(error => console.error('Error fetching bzentyNmList:', error));
  };

  const getBzentyNm = (bzentyUserNo) => {
    const bzentyNmData = bzentyNmList.find(item => item.bzentyUserNo === bzentyUserNo);
    return bzentyNmData ? bzentyNmData.bzentyNm : '';
  };

  const handleModalOpen = (selectedTng) => {
    setSelectedTng(selectedTng);
  };

  const handleModalClose = () => {
    setSelectedTng(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredTngList = enteredTask.trim() !== '' ?
    tngList.filter(item => item.tkcgTaskNm.toLowerCase().includes(enteredTask.toLowerCase())) :
    tngList;
  const currentTngList = filteredTngList.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationItems = () => {
    const pageCount = Math.ceil(filteredTngList.length / itemsPerPage);
    const paginationItems = [];
    for (let i = 1; i <= pageCount; i++) {
      paginationItems.push(
        <CPaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </CPaginationItem>
      );
    }
    return paginationItems;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleTaskInputChange = (event) => {
    setEnteredTask(event.target.value);
    setCurrentPage(1); // Reset pagination when input changes
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>현장실습 목록</strong>
          </CCardHeader>
          <CCardBody>
            <CFormInput
              id="exampleFormControlInput1"
              placeholder="업무를 입력하세요"
              style={{ width: '300px' }}
              value={enteredTask}
              onChange={handleTaskInputChange}
            />
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: '10%' }} className="text-center">NO</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">산업체명</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">담당 업무명</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">현장실습 시작일</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">현장실습 종료일</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '18%' }} className="text-center">신청마감일</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentTngList.map((item, index) => (
                  <CTableRow key={index} onClick={() => handleModalOpen(item)}>
                    <CTableDataCell className="text-center">{indexOfFirstItem + index + 1}</CTableDataCell>
                    <CTableDataCell className="text-center">{getBzentyNm(item.bzentyUserNo)}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.tkcgTaskNm}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.tngStYMD ? formatDate(item.tngStYMD) : '-'}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.tngEndYMD ? formatDate(item.tngEndYMD) : '-'}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.aplyEndDt ? formatDate(item.aplyEndDt) : '-'}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination className="justify-content-center" aria-label="Page navigation example">
              <CPaginationItem aria-label="Previous" onClick={() => setCurrentPage(currentPage - 1)}>
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {renderPaginationItems()}
              <CPaginationItem aria-label="Next" onClick={() => setCurrentPage(currentPage + 1)}>
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
      <TNGDetailModal selectedTng={selectedTng} bzentyNmList={bzentyNmList} onClose={handleModalClose} loginId={loginId} navigate={navigate} />
    </CRow>
  );
};

const TNGDetailModal = ({ selectedTng, bzentyNmList, onClose, loginId, navigate }) => {
  const getBzentyNm = (bzentyUserNo) => {
    const bzentyNmData = bzentyNmList.find(item => item.bzentyUserNo === bzentyUserNo);
    return bzentyNmData ? bzentyNmData.bzentyNm : '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const fetchStdntAlpyTng = () => {
    fetch('/cbb/tng/stdntAplyTng', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId: loginId, tngNo: selectedTng.tngNo }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        if (data == 'success') {
          alert("등록에 성공했습니다.")
        } else if (data == 'fail') {
          alert("이미 신청한 실습입니다.")
        } else if (data === "exist") {
          alert("진행중인 현장실습이 존재합니다.")
          navigate('/stdntProgAply');
        } else if (data === "exist2") {
          alert("승인된 현장실습이 존재합니다.")
        }
        else {
          console.log('Unexpected response received from server:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching StdntAlpyTng:', error);
      });

  };


  const handleApproval = () => {
    fetchStdntAlpyTng();
    handleModalClose();
  };

  const handleModalClose = () => {
    onClose();
  };

  return (
    <CModal alignment="center" visible={selectedTng !== null} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>현장실습 신청</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {selectedTng && (
          <CTable>
            <CTableBody>
              <CTableRow>
                <CTableDataCell className="text-center">산업체 명</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? getBzentyNm(selectedTng.bzentyUserNo) : '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="text-center">학기</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? selectedTng.semester : '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="text-center">실습 시작일</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? formatDate(selectedTng.tngStYMD) : '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="text-center">실습 종료일</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? formatDate(selectedTng.tngEndYMD) : '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="text-center">신청 종료일</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? formatDate(selectedTng.aplyEndDt) : '-'}</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="text-center">총 실습시간</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? selectedTng.ttlTngHr : '-'}시간</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="text-center">이수 기준 시간</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? selectedTng.cmcrsHr : '-'}시간</CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="text-center">담당 업무명</CTableDataCell>
                <CTableDataCell className="text-center">{selectedTng ? selectedTng.tkcgTaskNm : '-'}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <CButton color="primary" style={{ flex: 1 }} onClick={handleApproval}>현장 실습 신청</CButton>
          <CButton color="danger" style={{ flex: 1 }} onClick={handleModalClose}>취소</CButton>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default StdntAply;

