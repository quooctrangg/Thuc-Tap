import React from 'react';
import { useEffect, useState } from 'react';
import { getAllUsers, banUserService, unBanUserService } from '../../../services/userService';
import moment from 'moment';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { Link, useLocation } from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';

const ManageUser = () => {
    const location = useLocation();
    const [dataUser, setdataUser] = useState([]);
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState(0)
    const [keyword, setkeyword] = useState('')

    useEffect(async () => {
        await fetchAllUser(keyword, numberPage)
    }, [numberPage])

    useEffect(() => {
        if (location.currentPage == 0 || location.currentPage) {
            handleChangePage({ selected: location.currentPage })
            location.currentPage = null
        }
    })

    let fetchAllUser = async (keyword, page) => {
        let res = await getAllUsers({
            limit: PAGINATION.pagerow,
            offset: page * PAGINATION.pagerow,
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
        setnumberPage(number.selected)
    }

    let handleSearchUser = (keyword) => {
        fetchAllUser(keyword, 0)
        setkeyword(keyword)
    }

    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            fetchAllUser(keyword, 0)
            setkeyword(keyword)
        }
    }

    let handleOnClickExport = async () => {
        let res = await getAllUsers({
            limit: '',
            offset: '',
            keyword: ''
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách người dùng", "ListUser")
        }
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
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Email</th>
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Giới tính</th>
                                    <th>Quyền</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataUser && dataUser.length > 0 ?
                                    dataUser.map((item, index) => {
                                        console.log(item);
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.email}</td>
                                                <td>{`${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`}</td>
                                                <td>{item.phonenumber}</td>
                                                <td>{item.genderData.value}</td>
                                                <td>{item.roleData.value}</td>
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
                                                <td>
                                                    <Link to={{ pathname: `/admin/edit-user/${item.id}`, currentPage: numberPage }}>
                                                        <button className='btn btn-primary'>
                                                            Sửa
                                                        </button>
                                                    </Link>
                                                    &nbsp; &nbsp;
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
        </div>
    )
}

export default ManageUser;