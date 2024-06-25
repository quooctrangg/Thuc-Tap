import React from 'react';
import { useEffect, useState } from 'react';
import { deleteTypeVoucherService, getAllTypeVoucher } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { Link } from "react-router-dom";
const ManageTypeShip = () => {
    const [dataTypeVoucher, setdataTypeVoucher] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)

    useEffect(() => {
        try {
            let fetchData = async () => {
                let arrData = await getAllTypeVoucher({
                    limit: PAGINATION.pagerow,
                    offset: 0
                })
                if (arrData && arrData.errCode === 0) {
                    setdataTypeVoucher(arrData.data)
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                }
            }
            fetchData();
        } catch (error) {
            console.log(error)
        }
    }, [])
    let handleDeleteTypeVoucher = async (id) => {
        let res = await deleteTypeVoucherService({
            data: {
                id: id
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa loại voucher thành công")
            let arrData = await getAllTypeVoucher({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow
            })
            if (arrData && arrData.errCode === 0) {
                setdataTypeVoucher(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }

        } else toast.error("Xóa loại voucher thất bại")
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getAllTypeVoucher({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow
        })
        if (arrData && arrData.errCode === 0) {
            setdataTypeVoucher(arrData.data)
        }
    }

    let handleOnClickExport = async () => {
        let res = await getAllTypeVoucher({
            limit: '',
            offset: '',
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách loại voucher", "ListTypeVoucher")
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại voucher</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách loại voucher
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-12 mb-2'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Loại voucher</th>
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
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.typeVoucherData.value}</td>
                                                <td>{item.typeVoucher == "percent" ? item.value + "%" : CommonUtils.formatter.format(item.value)}</td>
                                                <td>{CommonUtils.formatter.format(item.minValue)}</td>
                                                <td>{CommonUtils.formatter.format(item.maxValue)}</td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <Link to={`/admin/edit-typevoucher/${item.id}`}>
                                                        <button className='btn btn-warning'>
                                                            Sửa
                                                        </button>
                                                    </Link>
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

export default ManageTypeShip;