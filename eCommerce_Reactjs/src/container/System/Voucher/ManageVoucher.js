import React from 'react';
import { useEffect, useState } from 'react';
import { deleteTypeVoucherService, deleteVoucherService, getAllTypeVoucher, getAllVoucher } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import CommonUtils from '../../../utils/CommonUtils';
import AddTypeVoucherModal from './AddTypeVoucherModal';
import AddVoucherModal from './AddVoucherModal';
const ManageVoucher = () => {
    const [dataVoucher, setdataVoucher] = useState([])
    const [countVoucher, setCountVoucher] = useState(0)
    const [numberVoucherPage, setNumberVoucherPage] = useState(0)
    const [dataTypeVoucher, setdataTypeVoucher] = useState([])
    const [countTypeVoucher, setCounTypeVouCher] = useState(0)
    const [numberTypeVoucherPage, setNumberTypeVoucherPage] = useState(0)
    const [isOpenAddVoucherModal, setIsOpenAddVoucherModal] = useState(false)
    const [isOpenAddTypeVoucherModal, setIsOpenAddTypeVoucherModal] = useState(false)
    const [currentVoucher, setCurrentVoucher] = useState(null)
    const [currentTypeVoucher, setCurrentTypeVoucher] = useState(null)

    useEffect(() => {
        fetchVoucherData();
    }, [numberVoucherPage])

    useEffect(() => {
        fetchTypeVoucherData();
    }, [numberTypeVoucherPage])

    let fetchVoucherData = async () => {
        let arrData = await getAllVoucher({
            limit: PAGINATION.pagerow,
            offset: numberVoucherPage * PAGINATION.pagerow
        })
        if (arrData && arrData.errCode === 0) {
            setdataVoucher(arrData.data)
            setCountVoucher(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let fetchTypeVoucherData = async () => {
        let arrData = await getAllTypeVoucher({
            limit: PAGINATION.pagerow,
            offset: numberTypeVoucherPage * PAGINATION.pagerow
        })
        if (arrData && arrData.errCode === 0) {
            setdataTypeVoucher(arrData.data)
            setCounTypeVouCher(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleDeleteVoucher = async (id) => {
        let res = await deleteVoucherService({
            data: {
                id: id
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa mã voucher thành công")
            await fetchVoucherData();
        } else toast.error("Xóa mã voucher thất bại")
    }

    let handleDeleteTypeVoucher = async (id) => {
        let res = await deleteTypeVoucherService({
            data: {
                id: id
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa loại voucher thành công")
            await fetchTypeVoucherData()
        } else toast.error("Xóa loại voucher thất bại")
    }

    let handleChangeVoucherPage = async (number) => {
        setNumberVoucherPage(number.selected)
    }

    let handleChangeTypeVoucherPage = async (number) => {
        setNumberTypeVoucherPage(number.selected)
    }

    const hanldeShowAddVoucherModal = () => {
        setIsOpenAddVoucherModal(true)
    }

    const hanldeCloseAddVoucherModal = () => {
        setIsOpenAddVoucherModal(false)
        setCurrentVoucher(null)
    }

    const hanldeShowAddTypeVoucherModal = () => {
        setIsOpenAddTypeVoucherModal(true)
    }

    const hanldeCloseAddTypeVoucherModal = () => {
        setIsOpenAddTypeVoucherModal(false)
        setCurrentTypeVoucher(null)
    }

    return (
        <>
            <div className="container-fluid px-4">
                <h1 className="mt-4">Quản lý khuyến mãi</h1>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Danh sách loại khuyến mãi
                    </div>
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-12 mb-2'>
                                <button style={{ float: 'right' }} onClick={() => hanldeShowAddTypeVoucherModal()} className="btn btn-success" >
                                    <i class="fa-solid fa-plus"></i>
                                    Thêm
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Loại khuyến mãi</th>
                                        <th>Giá trị</th>
                                        <th>Giá trị tối thiểu</th>
                                        <th>Giá trị tối đa</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataTypeVoucher && dataTypeVoucher.length > 0 ?
                                        dataTypeVoucher.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{(numberTypeVoucherPage * 10) + index + 1}</td>
                                                    <td>{item.typeVoucherData.value}</td>
                                                    <td>{item.typeVoucher == "percent" ? item.value + "%" : CommonUtils.formatter.format(item.value)}</td>
                                                    <td>{CommonUtils.formatter.format(item.minValue)}</td>
                                                    <td>{CommonUtils.formatter.format(item.maxValue)}</td>
                                                    <td style={{ display: 'flex', gap: 2 }}>
                                                        <button onClick={() => {
                                                            setCurrentTypeVoucher(item.id)
                                                            hanldeShowAddTypeVoucherModal()
                                                        }} className='btn btn-warning'>
                                                            Sửa
                                                        </button>
                                                        <button className='btn btn-danger' onClick={() => handleDeleteTypeVoucher(item.id)} >Xóa</button>
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
                    countTypeVoucher > 1 &&
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp'}
                        breakLabel={'...'}
                        pageCount={countTypeVoucher}
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
                        onPageChange={handleChangeTypeVoucherPage}
                    />
                }
            </div>
            <div className="container-fluid px-4">
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Danh sách mã khuyến mãi
                    </div>
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-12 mb-2'>
                                <button style={{ float: 'right' }} onClick={() => hanldeShowAddVoucherModal()} className="btn btn-success" >
                                    <i class="fa-solid fa-plus"></i>
                                    Thêm
                                </button>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã khuyến mãi</th>
                                        <th>Loại khuyến mãi</th>
                                        <th>Số lượng</th>
                                        <th>Đã sử dụng</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataVoucher && dataVoucher.length > 0 ?
                                        dataVoucher.map((item, index) => {
                                            let name = `${item.typeVoucherOfVoucherData.value} ${item.typeVoucherOfVoucherData.typeVoucherData.value}`
                                            return (
                                                <tr key={index}>
                                                    <td>{(numberVoucherPage * 10) + index + 1}</td>
                                                    <td>{item.codeVoucher}</td>
                                                    <td>{name}</td>
                                                    <td>{item.amount}</td>
                                                    <td>{item.usedAmount}</td>
                                                    <td>{moment.unix(item.fromDate / 1000).format('DD/MM/YYYY')}</td>
                                                    <td>{moment.unix(item.toDate / 1000).format('DD/MM/YYYY')}</td>
                                                    <td style={{ display: 'flex', gap: 2 }}>
                                                        <button onClick={() => {
                                                            setCurrentVoucher(item.id)
                                                            hanldeShowAddVoucherModal()
                                                        }} className='btn btn-warning'>
                                                            Sửa
                                                        </button>
                                                        <button className='btn btn-danger' onClick={() => handleDeleteVoucher(item.id)} >Xóa</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan={8} className='text-center text-red'>
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
                    countVoucher > 1 &&
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp'}
                        breakLabel={'...'}
                        pageCount={countVoucher}
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
                        onPageChange={handleChangeVoucherPage}
                    />
                }
            </div>
            <AddTypeVoucherModal id={currentTypeVoucher} hanldeCloseAddTypeVoucherModal={hanldeCloseAddTypeVoucherModal} isOpenAddTypeVoucherModal={isOpenAddTypeVoucherModal} fetchTypeVoucherData={fetchTypeVoucherData} />
            <AddVoucherModal id={currentVoucher} hanldeCloseAddVoucherModal={hanldeCloseAddVoucherModal} isOpenAddVoucherModal={isOpenAddVoucherModal} fetchVoucherData={fetchVoucherData} />
        </>
    )
}

export default ManageVoucher;