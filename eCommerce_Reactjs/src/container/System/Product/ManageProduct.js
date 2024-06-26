import React from 'react';
import { useEffect, useState } from 'react';
import { getAllProductAdmin, handleBanProductService, handleActiveProductService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';
import AddProductModal from './AddProductModal';
import UpdateProductModal from './UpdateProductModal';

const ManageProduct = () => {
    const [dataProduct, setdataProduct] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [keyword, setkeyword] = useState('')
    const [isOpenAddProductModal, setIsOpenAddProductModal] = useState(false)
    const [isOpenUpdateProductModal, setIsOpenUpdateProductModal] = useState(false)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        loadProduct()
    }, [numberPage, keyword])

    let loadProduct = async () => {
        let arrData = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleBanProduct = async (id) => {
        let data = await handleBanProductService({
            id: id
        })
        if (data && data.errCode === 0) {
            toast.success("Ẩn sản phẩm thành công!")
            await loadProduct()
        } else {
            toast.error("Ẩn sản phẩm thất bại!")
        }
    }

    let handleActiveProduct = async (id) => {
        let data = await handleActiveProductService({
            id: id
        })
        if (data && data.errCode === 0) {
            toast.success("Hiện sản phẩm thành công!")
            loadProduct()
        } else {
            toast.error("Hiện sản phẩm thất bại!")
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleSearchProduct = (keyword) => {

    }

    let handleOnchangeSearch = (keyword) => {
        setkeyword(keyword)
    }

    const handleShowAddProductModal = () => {
        setIsOpenAddProductModal(true)
    }

    const handleCloseAddProductModal = () => {
        setIsOpenAddProductModal(false)
    }

    const handleShowUpdateProductModal = () => {
        setIsOpenUpdateProductModal(true)
    }

    const handleCloseUpdateProductModal = () => {
        setIsOpenUpdateProductModal(false)
        setCurrent(null)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý sản phẩm</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách sản phẩm
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên sản phẩm"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchProduct} />                    </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleShowAddProductModal()} className="btn btn-success" >
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
                                    <th>Tên sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Nhãn hàng</th>
                                    <th>Chất liệu</th>
                                    <th>Được làm bởi</th>
                                    <th>Lượt xem</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataProduct && dataProduct.length > 0 ?
                                    dataProduct.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.categoryData.value}</td>
                                                <td>{item.brandData.value}</td>
                                                <td>{item.material}</td>
                                                <td>{item.madeby}</td>
                                                <td>{item.view ? item.view : 0}</td>
                                                <td>{item.statusData.value}</td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <Link to={`/admin/list-product-detail/${item.id}`}>
                                                        <button className='btn btn-primary'>
                                                            Xem
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => {
                                                        setCurrent(item.id)
                                                        handleShowUpdateProductModal()
                                                    }} className='btn btn-warning'>
                                                        Sửa
                                                    </button>
                                                    {
                                                        item.statusData.code === 'S1' ?
                                                            <button className='btn btn-danger' onClick={() => handleBanProduct(item.id)}>Ẩn</button>
                                                            :
                                                            <span className='btn btn-success' onClick={() => handleActiveProduct(item.id)}>Hiện</span>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={9} className='text-center text-red'>
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
            <AddProductModal isOpenAddProductModal={isOpenAddProductModal} handleCloseAddProductModal={handleCloseAddProductModal} loadProduct={loadProduct} />
            <UpdateProductModal isOpenUpdateProductModal={isOpenUpdateProductModal} handleCloseUpdateProductModal={handleCloseUpdateProductModal} loadProduct={loadProduct} id={current} />
        </div>
    )
}

export default ManageProduct;