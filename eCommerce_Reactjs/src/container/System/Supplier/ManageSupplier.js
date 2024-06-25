import React from 'react';
import { useEffect, useState } from 'react';
import { deleteSupplierService, getAllSupplier } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';
import { Link } from "react-router-dom";
import AddSupplierModal from './AddSupplierModal';

const ManageSupplier = () => {
    const [keyword, setkeyword] = useState('')
    const [dataSupplier, setdataSupplier] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [isOpenAddSupplierModal, setIsOpenAddSupplierModal] = useState(false)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        fetchData();
    }, [numberPage, keyword])

    let fetchData = async () => {
        let arrData = await getAllSupplier({
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataSupplier(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleDeleteSupplier = async (event, id) => {
        event.preventDefault();
        let res = await deleteSupplierService({
            data: {
                id: id
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa nhà cung cấp thành công")
            let arrData = await getAllSupplier({
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                keyword: keyword
            })
            if (arrData && arrData.errCode === 0) {
                setdataSupplier(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }
        } else toast.error("Xóa nhà cung cấp thất bại")
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleSearchSupplier = (keyword) => {

    }

    let handleOnchangeSearch = (keyword) => {
        setkeyword(keyword)
    }

    const handleShowAddSupplierModal = () => {
        setIsOpenAddSupplierModal(true)
    }

    const handleCloseAddSupplierModal = () => {
        setIsOpenAddSupplierModal(false)
        setCurrent(null)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhà cung cấp</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách nhà cung cấp sản phẩm
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên nhà cung cấp"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchSupplier} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleShowAddSupplierModal()} className="btn btn-success" >
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
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Địa chỉ</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataSupplier && dataSupplier.length > 0 ?
                                    dataSupplier.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.phonenumber}</td>
                                                <td>{item.email}</td>
                                                <td>{item.address}</td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <button onClick={() => {
                                                        setCurrent(item.id)
                                                        handleShowAddSupplierModal()
                                                    }} className='btn btn-warning'>
                                                        Sửa
                                                    </button>
                                                    <button className='btn btn-danger' onClick={(event) => handleDeleteSupplier(event, item.id)}>Xóa</button>
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
            <AddSupplierModal isOpenAddSupplierModal={isOpenAddSupplierModal} handleCloseAddSupplierModal={handleCloseAddSupplierModal} id={current} fetchData={fetchData} />
        </div>
    )
}

export default ManageSupplier;