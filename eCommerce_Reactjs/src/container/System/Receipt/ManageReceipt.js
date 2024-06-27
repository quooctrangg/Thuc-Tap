import React from 'react';
import { useEffect, useState } from 'react';
import { getAllReceipt } from '../../../services/userService';
import moment from 'moment';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { Link } from "react-router-dom";
import AddReceiptModal from './AddReceiptModal'

const ManageReceipt = () => {
    const [dataReceipt, setdataReceipt] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [isOpenModalReceipt, setIsOpenModalReceipt] = useState(false)

    useEffect(() => {
        fetchData();
    }, [numberPage])

    let fetchData = async () => {
        let arrData = await getAllReceipt({
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
        })
        if (arrData && arrData.errCode === 0) {
            setdataReceipt(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleOnClickExport = async () => {
        let res = await getAllReceipt({
            limit: '',
            offset: '',
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách nhập hàng", "ListReceipt")
        }
    }

    const handleOpenReceiptModal = () => {
        setIsOpenModalReceipt(true)
    }

    const handleCloseReceiptModal = () => {
        setIsOpenModalReceipt(false)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhập hàng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách nhập hàng
                </div>
                <div className="card-body">
                    <div style={{ width: '100%' }} className='' >
                        <div className='d-flex gap-2 justify-content-end mb-2'>
                            <button onClick={() => handleOnClickExport()} className="btn btn-light" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                            <button onClick={() => handleOpenReceiptModal()} className="btn btn-success" >Thêm hóa đơn <i class="fa-solid fa-file-invoice"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Số hóa đơn</th>
                                    <th>Ngày nhập hàng</th>
                                    <th>Tên nhà cung cấp</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataReceipt && dataReceipt.length > 0 ?
                                    dataReceipt.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.billNumber}</td>
                                                <td>{moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{item.supplierData.name}</td>
                                                <td>
                                                    <Link to={`/admin/detail-receipt/${item.id}`}>
                                                        <button className='btn btn-primary'>
                                                            Xem
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={6} className='text-center text-red'>
                                            Không có dữ liệu.
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                count > 1 &&
                <ReactPaginate
                    previousLabel={'Quay lại'}
                    nextLabel={'Tiếp'}
                    breakLabel={'...'}
                    pageCount={count}
                    marginPagesDisplayed={3}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    activeClassName={"active"}
                    onPageChange={handleChangePage}
                />
            }

            <AddReceiptModal handleCloseReceiptModal={handleCloseReceiptModal} isOpenModalReceipt={isOpenModalReceipt} fetchData={fetchData} />
        </div >
    )
}

export default ManageReceipt;