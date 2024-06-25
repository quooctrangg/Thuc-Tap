import React from 'react';
import { useEffect, useState } from 'react';
import { deleteTypeShipService, getAllTypeShip } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { Link } from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';
import AddTypeShipModal from './AddTypeShipModal';

const ManageTypeShip = () => {
    const [dataTypeShip, setdataTypeShip] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [keyword, setkeyword] = useState('')
    const [isOpenAddTypeShipModal, setIsOpenAddTypeShipModal] = useState(false)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        fetchData();
    }, [numberPage, keyword])

    let fetchData = async () => {
        let arrData = await getAllTypeShip({
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataTypeShip(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleDeleteTypeShip = async (id) => {
        let res = await deleteTypeShipService({
            data: {
                id: id
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa loại ship thành công")
            let arrData = await getAllTypeShip({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                keyword: keyword
            })
            if (arrData && arrData.errCode === 0) {
                setdataTypeShip(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }
        } else toast.error("Xóa loại ship thất bại")
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleSearchTypeShip = (keyword) => {

    }

    let handleOnchangeSearch = async (keyword) => {
        setkeyword(keyword)
    }

    const handleShowAddTypeShipModal = () => {
        setIsOpenAddTypeShipModal(true)
    }

    const handleCloseAddTypeShipModal = () => {
        setIsOpenAddTypeShipModal(false)
        setCurrent(null)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý loại giao hàng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách loại giao hàng
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên loại ship"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchTypeShip} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleShowAddTypeShipModal()} className="btn btn-success" >
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
                                    <th>Tên loại ship</th>
                                    <th>Giá tiền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataTypeShip && dataTypeShip.length > 0 ?
                                    dataTypeShip.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.type}</td>
                                                <td>{CommonUtils.formatter.format(item.price)}</td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <button onClick={() => {
                                                        setCurrent(item.id)
                                                        handleShowAddTypeShipModal()
                                                    }} className='btn btn-warning'>
                                                        Sửa
                                                    </button>
                                                    <button className='btn btn-danger' onClick={() => handleDeleteTypeShip(item.id)}>Xóa</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4} className='text-center text-red'>
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
            <AddTypeShipModal id={current} handleCloseAddTypeShipModal={handleCloseAddTypeShipModal} isOpenAddTypeShipModal={isOpenAddTypeShipModal} fetchData={fetchData} />
        </div >
    )
}

export default ManageTypeShip;