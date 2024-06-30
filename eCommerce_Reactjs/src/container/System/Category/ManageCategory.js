import React from 'react';
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';
import AddCategoryModal from './AddCategoryModal';
import { useEffect, useState } from 'react';
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';

const ManageCategory = () => {
    const [dataCategory, setdataCategory] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [keyword, setkeyword] = useState('')
    const [isOpenAddCategoryModal, setIsOpenAddCategoryModal] = useState(false)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        fetchData();
    }, [numberPage, keyword])

    let fetchData = async () => {
        let arrData = await getListAllCodeService({
            type: 'CATEGORY',
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataCategory(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleDeleteCategory = async (event, id) => {
        event.preventDefault();
        let res = await DeleteAllcodeService(id)
        if (res && res.errCode === 0) {
            toast.success("Xóa danh mục thành công")
            await fetchData();
        } else toast.error("Xóa danh mục thất bại")
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleSearchCategory = (keyword) => {

    }

    let handleOnchangeSearch = (keyword) => {
        setkeyword(keyword)
    }

    const handleShowCategoryModal = () => {
        setIsOpenAddCategoryModal(true)
    }

    const handleCloseCategoryModal = () => {
        setIsOpenAddCategoryModal(false)
        setCurrent(null)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý danh mục</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách danh mục sản phẩm
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên danh mục"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchCategory} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleShowCategoryModal()} className="btn btn-success" >
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
                                    <th>Mã code</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataCategory && dataCategory.length > 0 ?
                                        dataCategory.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{(numberPage * 10) + index + 1}</td>
                                                    <td>{item.value}</td>
                                                    <td>{item.code}</td>
                                                    <td style={{ display: 'flex', gap: 2 }}>
                                                        <button onClick={() => {
                                                            setCurrent(item.id)
                                                            handleShowCategoryModal()
                                                        }} className='btn btn-warning'>
                                                            Sửa
                                                        </button>
                                                        <button className='btn btn-danger' onClick={(event) => handleDeleteCategory(event, item.id)} >Xóa</button>
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
                </div>
            </div>
            <AddCategoryModal id={current} fetchData={fetchData} isOpenAddCategoryModal={isOpenAddCategoryModal} handleCloseCategoryModal={handleCloseCategoryModal} />
        </div>
    )
}

export default ManageCategory;