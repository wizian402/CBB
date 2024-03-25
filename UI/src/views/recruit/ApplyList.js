import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/SerchBox';
import Pagination from './components/Pagination';

const Tables = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [visible, setVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5; // 페이지당 보여줄 아이템 수

    useEffect(() => {
        fetchAplyList();
    }, []);

    useEffect(() => {
        filterData();
    }, [data, searchTerm]);

    const fetchAplyList = async () => {
        try {
            const response = await fetch('/cbb/rcr/aplylist', {
                method: 'Post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userNo: localStorage.getItem('userNo'),
                })
            })
            const jsondata = await response.json();
            console.log(jsondata)
            setData(jsondata)
        } catch (error) {
            console.log('Error fetching aplyList', error)
        }
    }

    const filterData = () => {
        const filtered = data.filter(item => {
            return item.pbancName.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredData(filtered);
    };

    const handleRowClick = (item) => {
        setSelectedItem(item);
        setVisible(!visible);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setVisible(false);
    };

    const handleDetailButtonClick = () => {
        if (selectedItem) {
            navigate(`/recruit/detailPbanc/${selectedItem.pbancSn}`);
            handleCloseModal();
        }
    };

    const formatDate = (dateNumber) => {
        const dateString = dateNumber.toString();
        const year = dateString.slice(0, 4);
        const month = parseInt(dateString.slice(4, 6), 10);
        const day = parseInt(dateString.slice(6, 8), 10);
        return `${year}. ${month}. ${day}.`;
    };

    // 현재 페이지의 데이터를 가져오는 함수
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredData.slice(startIndex, endIndex);
    };

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

    const handleSearchButtonClick = () => {
        filterData();
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong><h2>나의 지원내역 조회</h2></strong> <small></small>
                    </CCardHeader>
                    <CCardBody>

                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            handleSearchButtonClick={handleSearchButtonClick}
                        />

                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">순번</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">공고명</CTableHeaderCell>
                                    {/* <CTableHeaderCell scope="col">Recruiter Number</CTableHeaderCell> */}
                                    {/* <CTableHeaderCell scope="col">Salary</CTableHeaderCell> */}
                                    {/* <CTableHeaderCell scope="col">Description</CTableHeaderCell> */}
                                    <CTableHeaderCell scope="col">공고게시일</CTableHeaderCell>
                                    {/* <CTableHeaderCell scope="col">Approval</CTableHeaderCell> */}
                                    <CTableHeaderCell scope="col">공고마감일</CTableHeaderCell>
                                    {/* <CTableHeaderCell scope="col">Type</CTableHeaderCell> */}
                                    {/* <CTableHeaderCell scope="col">Status</CTableHeaderCell> */}
                                    {/* <CTableHeaderCell scope="col">Business Reg. Num</CTableHeaderCell> */}
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {getCurrentPageData().map((item, index) => (
                                    <CTableRow key={item.pbancSn} onClick={() => handleRowClick(item)}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{item.pbancName}</CTableDataCell>
                                        {/* <CTableDataCell>{item.numRcr}</CTableDataCell> */}
                                        {/* <CTableDataCell>{item.slry}</CTableDataCell> */}
                                        {/* <CTableDataCell>{item.pbancContent}</CTableDataCell> */}
                                        <CTableDataCell>{new Date(item.startDT).toLocaleDateString()}</CTableDataCell>
                                        {/* <CTableDataCell>{item.aprvYN}</CTableDataCell> */}
                                        <CTableDataCell>{formatDate(item.endYMD)}</CTableDataCell>
                                        {/* <CTableDataCell>{item.epmType}</CTableDataCell> */}
                                        {/* <CTableDataCell>{item.rcrStatus}</CTableDataCell> */}
                                        {/* <CTableDataCell>{item.bizRegNum}</CTableDataCell> */}
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>

            {/* 페이지네이션 */}
            <CCol xs={12}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </CCol>

            <CModal visible={visible} onClose={handleCloseModal}>
                <CModalHeader closeButton>
                    <CModalTitle>요약정보</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedItem && (
                        <div>
                            <p>공고명: {selectedItem.pbancName}</p>
                            <p>모집인원: {selectedItem.numRcr}</p>
                            <p>연봉: {selectedItem.slry}</p>
                            {/* <p>상세내용: {selectedItem.pbancContent}</p> */}
                            <p>공고게시일: {new Date(selectedItem.startDT).toLocaleDateString()}</p>
                            <p>공고마감일: {formatDate(selectedItem.endYMD)}</p>
                            {/* <p>Approval: {selectedItem.aprvYN}</p> */}
                            {/* <p>Type: {selectedItem.epmType}</p> */}
                            {/* <p>Status: {selectedItem.rcrStatus}</p> */}
                            {/* <p>Business Reg. Num: {selectedItem.bizRegNum}</p> */}
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" variant="outline" onClick={handleDetailButtonClick}>
                        상세보기
                    </CButton>
                    <CButton color="secondary" variant="outline" onClick={handleCloseModal}>
                        닫기
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default Tables;
