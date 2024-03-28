import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
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
  CPaginationItem,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';

import "./css/tngApproval.css";

const TngList = () => {
  const navigate = useNavigate();
  const [tngList, setTngList] = useState([]);
  const [tngStts, setTngStts] = useState([]);
  const [bzentyNmList, setBzentyNmList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTng, setSelectedTng] = useState(null);
  const [filterStatus, setFilterStatus] = useState(""); // 추가된 부분: 드롭다운 메뉴의 선택된 값

  useEffect(() => {
    const userGroupCd = localStorage.getItem('userGroupCd');
    if (userGroupCd !== '10') {
      localStorage.clear();
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
    } else {
      fetchTngList();
      fetchTngStatus();
      fetchBzentyNmList();
    }
  }, [currentPage, filterStatus, navigate]); // filterStatus를 useEffect의 의존성 배열에 추가

  const fetchTngList = () => {
    fetch('/cbb/tng/admPer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTngList(data))
      .catch(error => console.error('Error fetching training list:', error));
  };

  const fetchTngStatus = () => {
    fetch('/cbb/tng/stts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTngStts(data))
      .catch(error => console.error('Error fetching training status:', error));
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

  const getStatusName = (code) => {
    const status = tngStts.find(item => item.cd === code);
    return status ? status.nm : '';
  };

  const getBzentyNm = (bzentyUserNo) => {
    const bzentyNmData = bzentyNmList.find(item => item.bzentyUserNo === bzentyUserNo);
    return bzentyNmData ? bzentyNmData.bzentyNm : '';
  };

  const handleModalOpen = (selectedTng) => {
    if (selectedTng.prgrsStts == '10') {
      setSelectedTng(selectedTng);
    }
  };

  const handleModalClose = () => {
    setSelectedTng(null);
    fetchTngList();
  };

  const handleDropdownItemClick = (status) => {
    setFilterStatus(status); // 드롭다운 메뉴에서 선택된 진행 상태를 상태에 설정
    setCurrentPage(1); // 페이지를 1페이지로 이동
    fetchTngList();
  };


  const renderPaginationItems = () => {
    const totalPages = Math.ceil(filteredTngList.length / 10);
    const paginationItems = [];

    // 현재 페이지를 중심으로 최대 5개의 페이지 번호 표시
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // 좌측 화살표 버튼 표시 여부 결정
    if (currentPage > 5) {
      paginationItems.push(
        <CPaginationItem key="prev" onClick={() => setCurrentPage(currentPage - 5)}>
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
      );
    }

    // 페이지 번호 표시
    for (let i = startPage; i <= endPage; i++) {
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

    // 우측 화살표 버튼 표시 여부 결정
    if (totalPages > 5 && currentPage < totalPages - 2) {
      paginationItems.push(
        <CPaginationItem key="next" onClick={() => setCurrentPage(currentPage + 5)}>
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      );
    }

    return paginationItems;
  };



  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  let filteredTngList = tngList;
  if (filterStatus !== "") {
    filteredTngList = filteredTngList.filter(item => item.prgrsStts === filterStatus);
  }
  const currentTngList = filteredTngList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>현장 실습 목록</strong>
          </CCardHeader>
          <CCardBody>
            <CDropdown>
              <CDropdownToggle color="secondary">{filterStatus === "" ? "진행 상태" : `${getStatusName(filterStatus)}`}</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleDropdownItemClick("")}>전체</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("10")}>산업체 신청</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("20")}>현장실습 승인</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("60")}>학생 선발 완료</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("30")}>실습 운영</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("40")}>실습 종료</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: '12%' }} className="text-center">NO</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '22%' }} className="text-center">산업체명</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '22%' }} className="text-center">담당 업무명</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '22%' }} className="text-center">실습 인원수</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '22%' }} className="text-center">진행 상태</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentTngList.map((item, index) => (
                  <CTableRow
                    key={index}
                    onClick={() => handleModalOpen(item)}
                    className="table-hover"
                  >
                    <CTableDataCell className="text-center">{indexOfFirstItem + index + 1}</CTableDataCell>
                    <CTableDataCell className="text-center">{getBzentyNm(item.bzentyUserNo)}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.tkcgTaskNm}</CTableDataCell>
                    <CTableDataCell className="text-center">{item.tngNope}명</CTableDataCell>
                    <CTableDataCell className="text-center">{getStatusName(item.prgrsStts)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <CPagination className="justify-content-center" aria-label="Page navigation example">
              <CPaginationItem aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {renderPaginationItems()}
              <CPaginationItem aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
      <TNGDetailModal selectedTng={selectedTng} bzentyNmList={bzentyNmList} onClose={handleModalClose} />
    </CRow>
  );
};

const TNGDetailModal = ({ selectedTng, bzentyNmList, onClose }) => {
  const getBzentyNm = (bzentyUserNo) => {
    const bzentyNmData = bzentyNmList.find(item => item.bzentyUserNo === bzentyUserNo);
    return bzentyNmData ? bzentyNmData.bzentyNm : '';
  };

  const handleApproval = () => {
    fetch('/cbb/tng/approvalTng', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({ tngNo: selectedTng.tngNo }),
    })
      .then(response => response.json())
      .then(data => { })
      .catch(error => console.error('Error fetching bzentyNmList:', error));
    onClose();
  };

  const handleModalClose = () => {
    onClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <CModal alignment="center" visible={selectedTng !== null} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>현장 실습 승인</CModalTitle>
      </CModalHeader>
      <CModalBody>
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
              <CTableDataCell className="text-center">실습 인원수</CTableDataCell>
              <CTableDataCell className="text-center">{selectedTng ? selectedTng.tngNope : '-'}명</CTableDataCell>
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
              <CTableDataCell className="text-center">신청 시작일</CTableDataCell>
              <CTableDataCell className="text-center">20{selectedTng ? `${parseInt(selectedTng.aplyStDt.substring(0, 2), 10)}년 ${parseInt(selectedTng.aplyStDt.substring(3, 5), 10)}월 ${parseInt(selectedTng.aplyStDt.substring(6, 8), 10)}일`
                : '-'}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">신청 종료일</CTableDataCell>
              <CTableDataCell className="text-center">{selectedTng ? formatDate(selectedTng.aplyEndDt) : '-'}</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">진행 상태</CTableDataCell>
              <CTableDataCell className="text-center">{selectedTng ? selectedTng.prgrsStts : '-'}</CTableDataCell>
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <CButton color="primary" style={{ flex: 1 }} onClick={handleApproval}>현장 실습 승인</CButton>
          <CButton color="danger" style={{ flex: 1 }} onClick={handleModalClose}>취소</CButton>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default TngList;
