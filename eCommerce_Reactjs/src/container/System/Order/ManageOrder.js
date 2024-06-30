import React from 'react';
import CommonUtils from '../../../utils/CommonUtils';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import { getAllOrder } from '../../../services/userService';
import { PAGINATION } from '../../../utils/constant';
import { useFetchAllcode } from '../../customize/fetch';
import { Link } from "react-router-dom";

const ManageOrder = () => {
    const [dataOrder, setdataOrder] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [StatusId, setStatusId] = useState('ALL')

    const { data: dataStatusOrder } = useFetchAllcode('STATUS-ORDER');

    useEffect(() => {
        fetchData()
    }, [numberPage, StatusId])

    let fetchData = async () => {
        let arrData = await getAllOrder({
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            statusId: StatusId
        })
        if (arrData && arrData.errCode === 0) {
            setdataOrder(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleOnchangeStatus = (event) => {
        setStatusId(event.target.value)
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleOnClickExport = async () => {
        let res = await getAllOrder({
            limit: '',
            offset: '',
            statusId: 'ALL'
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách đơn hàng", "ListOrder")
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý đơn đặt hàng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách đơn đặt hàng
                </div>
                <select onChange={(event) => handleOnchangeStatus(event)} className="form-select col-3 ml-3 mt-3">
                    <option value={'ALL'} selected>Trạng thái đơn hàng</option>
                    {
                        dataStatusOrder && dataStatusOrder.length > 0 &&
                        dataStatusOrder.map((item, index) => {
                            return (
                                <option key={index} value={item.code}>{item.value}</option>
                            )
                        })
                    }
                </select>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-12 mb-2'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-light" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn</th>
                                    <th>SDT</th>
                                    <th>Email</th>
                                    <th>Ngày đặt</th>
                                    <th>Hình thức</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataOrder && dataOrder.length > 0 ?
                                        dataOrder.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{(numberPage * 10) + index + 1}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.addressUser.shipPhonenumber}</td>
                                                    <td>{item.userData.email}</td>
                                                    <td>{moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                    <td>{item.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online'}</td>
                                                    <td>{item.statusOrderData.value}</td>
                                                    <td>
                                                        <Link to={`/admin/order-detail/${item.id}`}>
                                                            <button className='btn btn-primary'>
                                                                Xem chi tiết
                                                            </button>
                                                        </Link>
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
        </div>
    )
}

export default ManageOrder;