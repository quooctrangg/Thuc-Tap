import React from 'react';
import { useEffect, useState } from 'react';
import { getAllUsers, banUserService, unBanUserService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';
import AddUserModal from './AddUserModal';

const ManageUser = () => {
    const [dataUser, setdataUser] = useState([]);
    const [currentUser, setCurrentUser] = useState(null)
    const [count, setCount] = useState(0)
    const [numberPage, setNumberPage] = useState(0)
    const [keyword, setkeyword] = useState('')
    const [isOpenAddUserModal, setIsOpenAddUserModal] = useState(false)

    useEffect(async () => {
        await fetchAllUser()
    }, [numberPage, keyword])

    let fetchAllUser = async () => {
        let res = await getAllUsers({
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            keyword: keyword
        })
        if (res && res.errCode === 0) {
            setdataUser(res.data);
            setCount(Math.ceil(res.count / PAGINATION.pagerow))
        }
    }

    let handleBanUser = async (event, id) => {
        event.preventDefault();
        let res = await banUserService(id)
        if (res && res.errCode === 0) {
            toast.success("Khóa người dùng thành công")
            await fetchAllUser(keyword, numberPage)
        } else {
            toast.error("Khóa người dùng thất bại")
        }
    }

    let handleUnBanUser = async (event, id) => {
        event.preventDefault();
        let res = await unBanUserService(id)
        if (res && res.errCode === 0) {
            toast.success("Mở khóa người dùng thành công")
            await fetchAllUser(keyword, numberPage)
        } else {
            toast.error("Mở khóa người dùng thất bại")
        }
    }

    let handleChangePage = async (number) => {
        setNumberPage(number.selected)
    }

    let handleSearchUser = (keyword) => {
    }

    let handleOnchangeSearch = (keyword) => {
        setkeyword(keyword)
    }

    const handleShowAddUserModal = () => {
        setIsOpenAddUserModal(true)
    }

    const handleCloseAddUserModal = () => {
        setIsOpenAddUserModal(false)
        setCurrentUser(null)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý người dùng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách người dùng
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"số điện thoại"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchUser} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleShowAddUserModal()} className="btn btn-success" >
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
                                    <th>Email</th>
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Giới tính</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataUser && dataUser.length > 0 ?
                                    dataUser.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.email}</td>
                                                <td>{`${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`}</td>
                                                <td>{item.phonenumber}</td>
                                                <td>{item.genderData.value}</td>
                                                <td>
                                                    {
                                                        item.statusId == 'S1' ?
                                                            <p className='text-primary'>
                                                                Hoạt động
                                                            </p>
                                                            :
                                                            <p className='text-red'>
                                                                Đã khóa
                                                            </p>
                                                    }
                                                </td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <button onClick={() => {
                                                        setCurrentUser(item.id)
                                                        handleShowAddUserModal()
                                                    }} className='btn btn-warning'>
                                                        Sửa
                                                    </button>
                                                    {/* <a href="#" onClick={(event) => handleBanUser(event, item.id)} >Delete</a> */}
                                                    {
                                                        item.statusId == 'S1' ?
                                                            <button onClick={(event) => handleBanUser(event, item.id)} className='btn btn-danger' >
                                                                Khóa
                                                            </button>
                                                            :
                                                            <button onClick={(event) => handleUnBanUser(event, item.id)} className='btn btn-success' >
                                                                Mở khóa
                                                            </button>

                                                    }
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
                    forcePage={numberPage}
                />
            }
            <AddUserModal fetchAllUser={fetchAllUser} id={currentUser} handleCloseAddUserModal={handleCloseAddUserModal} isOpenAddUserModal={isOpenAddUserModal} />
        </div>
    )
}

export default ManageUser;