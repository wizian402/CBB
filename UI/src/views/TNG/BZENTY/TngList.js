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
  CPaginationItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';

const TngList = () => {
  const [loginId, setLoginId] = useState(localStorage.getItem('loginId'));
  const [tngList, setTngList] = useState([]);
  const [tngStts, setTngStts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(""); // 선택한 진행 상태
  const navigate = useNavigate();
  const [filteredTngList, setFilteredTngList] = useState([]); // 필터된 현장 실습 목록

  useEffect(() => {
    const userGroupCd = localStorage.getItem('userGroupCd');
    if (userGroupCd !== '50') {
      localStorage.clear();
      alert('로그인후 이용가능합니다.');
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    fetch('/cbb/tng/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loginId }),
    })
      .then(response => response.json())
      .then(data => {
        setTngList(data);
      })
      .catch(error => {
        console.error('Error fetching training list:', error);
      });

    fetch('/cbb/tng/stts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setTngStts(data);
      })
      .catch(error => {
        console.error('Error fetching training status:', error);
      });
  }, []);

  useEffect(() => {
    setFilteredTngList(tngList.filter(item => selectedStatus === "" || item.prgrsStts === selectedStatus));
    setCurrentPage(1);
  }, [selectedStatus, tngList]);

  const getStatusName = (code) => {
    const status = tngStts.find(item => item.cd === code);
    return status ? status.nm : '';
  };

  const handleTableRowClick = (tngNo, prgrsStts) => {
    if (prgrsStts === '20') {
      sessionStorage.setItem('selectedTngNo', tngNo);
      navigate(`/tngAplyStdntList`);
    } else if (prgrsStts === '30') {
      sessionStorage.setItem('selectedTngNo', tngNo);
      navigate(`/tngProgStdnt`);
    }
  };

  const handleDropdownItemClick = (status) => {
    setSelectedStatus(status);
  };

  const RenderedPaginationItems = React.memo(() => {
    return Array.from({ length: Math.ceil(filteredTngList.length / 10) }, (_, index) => (
      <CPaginationItem
        key={index}
        active={index + 1 === currentPage}
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </CPaginationItem>
    ));
  });

  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
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
              <CDropdownToggle color="secondary">{selectedStatus === "" ? "진행 상태" : `${getStatusName(selectedStatus)}`}</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => handleDropdownItemClick("")}>전체</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("10")}>산업체 신청</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("20")}>현장실습 승인</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("60")}>학생 선발 완료</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("30")}>실습 운영</CDropdownItem>
                <CDropdownItem onClick={() => handleDropdownItemClick("40")}>실습 종료</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            {filteredTngList.length === 0 ? (
              <div className="text-center">해당 현장 실습은 없습니다.</div>
            ) : (
              <React.Fragment>
                <CTable hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col" style={{ width: '10%' }} className="text-center">NO</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">학기</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">신청일</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">실습인원</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">담당업무</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ width: '15%' }} className="text-center">진행상태</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentTngList.map((item, index) => (
                      <CTableRow key={index} onClick={() => handleTableRowClick(item.tngNo, item.prgrsStts)}>
                        <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                        <CTableDataCell className="text-center">{item.semester}</CTableDataCell>
                        <CTableDataCell className="text-center">20{item.aplyStDt}</CTableDataCell>
                        <CTableDataCell className="text-center">{item.tngNope}명</CTableDataCell>
                        <CTableDataCell className="text-center">{item.tkcgTaskNm}</CTableDataCell>
                        <CTableDataCell className="text-center">{getStatusName(item.prgrsStts)}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CPagination className="justify-content-center" aria-label="Page navigation example">
                  <CPaginationItem aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  <RenderedPaginationItems />
                  <CPaginationItem aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </CPaginationItem>
                </CPagination>
              </React.Fragment>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default TngList;

