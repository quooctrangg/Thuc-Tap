import React from 'react';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../../utils/CommonUtils';
import AddProductDetailModal from './AddProductDetailModal';
import UpdateProductDetailModal from './UpdateProductDetail';
import { useEffect, useState } from 'react';
import { getAllProductDetailByIdService, DeleteProductDetailService } from '../../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../../utils/constant';
import { Link, useParams } from "react-router-dom";

const ManageProductDetail = () => {
    const { id } = useParams()

    const [dataProductDetail, setdataProductDetail] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [isOpenAddProductDetailModal, setIsOpenAddProductDetailModal] = useState(false)
    const [isOpenUpdateProductDetailModal, setIsOpenUpdateProductDetailModal] = useState(false)
    const [current, setCurrent] = useState(false)

    useEffect(() => {
        loadProductDetail()
    }, [numberPage])

    let loadProductDetail = async () => {
        let arrData = await getAllProductDetailByIdService({
            id: id,
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow
        })
        if (arrData && arrData.errCode === 0) {
            setdataProductDetail(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleDeleteProductDetail = async (productdetailId) => {
        let response = await DeleteProductDetailService({
            data: {
                id: productdetailId
            }
        })
        if (response && response.errCode === 0) {
            toast.success("Xóa chi tiết sản phẩm thành công !")
            await loadProductDetail()
        } else {
            toast.error("Xóa sản phẩm thất bại")
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    const handShowAddProductDeatailModal = () => {
        setIsOpenAddProductDetailModal(true)
    }

    const handleCloseAddProductDetailModal = () => {
        setIsOpenAddProductDetailModal(false)
    }

    const handShowUpdateProductDeatailModal = () => {
        setIsOpenUpdateProductDetailModal(true)
    }

    const handleCloseUpdateProductDetailModal = () => {
        setIsOpenUpdateProductDetailModal(false)
        setCurrent(null)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chi tiết sản phẩm</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chi tiết sản phẩm
                    <div className="float-right">
                        <button onClick={handShowAddProductDeatailModal} className='btn'>
                            <i style={{ fontSize: '35px', cursor: 'pointer', color: '#0D6EFD' }} className="fas fa-plus-square"></i>
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Màu</th>
                                    <th>Giá gốc</th>
                                    <th>Giá khuyến mãi</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataProductDetail && dataProductDetail.length > 0 &&
                                    dataProductDetail.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.nameDetail}</td>
                                                <td>{CommonUtils.formatter.format(item.originalPrice)}</td>
                                                <td>{CommonUtils.formatter.format(item.discountPrice)}</td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <Link to={`/admin/list-product-detail-image/${item.id}`}>
                                                        <button className='btn btn-primary'>
                                                            Xem
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => {
                                                        setCurrent(item.id)
                                                        handShowUpdateProductDeatailModal()
                                                    }} className='btn btn-warning'>
                                                        Sửa
                                                    </button>
                                                    <button className='btn btn-danger' onClick={() => handleDeleteProductDetail(item.id)} >Xóa</button>
                                                </td>
                                            </tr>
                                        )
                                    })
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
            <AddProductDetailModal isOpenAddProductDetailModal={isOpenAddProductDetailModal} handleCloseAddProductDetailModal={handleCloseAddProductDetailModal} loadProductDetail={loadProductDetail} />
            <UpdateProductDetailModal isOpenUpdateProductDetailModal={isOpenUpdateProductDetailModal} handleCloseUpdateProductDetailModal={handleCloseUpdateProductDetailModal} loadProductDetail={loadProductDetail} id={current} />
        </div>
    )
}

export default ManageProductDetail;