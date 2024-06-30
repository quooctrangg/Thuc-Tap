import React from 'react';
import Lightbox from 'react-image-lightbox';
import AddImageModal from './AddImageModal';
import ReactPaginate from 'react-paginate';
import AddSizeModal from './AddSizeModal';
import { useEffect, useState } from 'react';
import { getAllProductDetailImageByIdService, DeleteProductDetailImageService, getAllProductDetailSizeByIdService, DeleteProductDetailSizeService } from '../../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../../utils/constant';
import { useParams } from "react-router-dom";
import 'react-image-lightbox/style.css';
import './ManageProductImage.scss';

const ManageProductImage = () => {
    const { id } = useParams()

    const [dataProductDetailImage, setdataProductDetailImage] = useState([])
    const [dataProductDetailSize, setdataProductDetailSize] = useState([])
    const [isOpen, setisOpen] = useState(false)
    const [isOpenImageModal, setIsOpenImageModal] = useState(false)
    const [isOpenSizeModal, setisOpenSizeModal] = useState(false)
    const [imgPreview, setimgPreview] = useState('')
    const [productImageId, setproductImageId] = useState(null)
    const [productSizeId, setProductSizeId] = useState(null)
    const [countImage, setCountImage] = useState(0)
    const [countSize, setCountSizes] = useState(0)
    const [numberPageImage, setNumberPageImage] = useState(0)
    const [numberPageSize, setNumberSizePage] = useState(0)

    useEffect(() => {
        loadProductDetailImage()
    }, [numberPageImage])

    useEffect(() => {
        loadProductDetailSize()
    }, [numberPageSize])

    let loadProductDetailImage = async () => {
        let arrData = await getAllProductDetailImageByIdService({
            id: id,
            limit: PAGINATION.pagerow,
            offset: numberPageImage * PAGINATION.pagerow
        })
        if (arrData && arrData.errCode === 0) {
            setdataProductDetailImage(arrData.data)
            setCountImage(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let loadProductDetailSize = async () => {
        let arrSize = await getAllProductDetailSizeByIdService({
            id: id,
            limit: PAGINATION.pagerow,
            offset: numberPageSize * PAGINATION.pagerow
        })
        if (arrSize && arrSize.errCode === 0) {
            setdataProductDetailSize(arrSize.data)
            setCountSizes(Math.ceil(arrSize.count / PAGINATION.pagerow))
        }
    }

    let openPreviewImage = (url) => {
        setimgPreview(url);
        setisOpen(true);
    }

    let handleCloseImageModal = () => {
        setIsOpenImageModal(false)
        setproductImageId(null)
    }

    let handleOpenImageModal = () => {
        setIsOpenImageModal(true)
    }

    let handleCloseSizeModal = () => {
        setisOpenSizeModal(false)
        setProductSizeId(null)
    }

    let handleOpenSizeModal = () => {
        setisOpenSizeModal(true)
    }

    let handleDeleteProductImage = async (productdetailImageId) => {
        let response = await DeleteProductDetailImageService({
            data: {
                id: productdetailImageId
            }
        })
        if (response && response.errCode === 0) {
            toast.success("Xóa hình ảnh thành công !")
            await loadProductDetailImage()
        } else {
            toast.error("Xóa hình ảnh thất bại !")
        }
    }

    let handleDeleteProductSize = async (productdetailsizeId) => {
        let response = await DeleteProductDetailSizeService({
            data: {
                id: productdetailsizeId
            }
        })
        if (response && response.errCode === 0) {
            toast.success("Xóa kích thước thành công !")
            await loadProductDetailSize()
        } else {
            toast.error("Xóa hình ảnh thất bại !")
        }
    }

    let handleChangeImagePage = async (number) => {
        setNumberPageImage(number.selected)
    }

    let handleChangeSizePage = async (number) => {
        setNumberSizePage(number.selected)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Thông tin chi tiết sản phẩm</h1>
            <div>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Danh sách hình ảnh chi tiết sản phẩm
                        <div onClick={() => handleOpenImageModal()} className="float-right">
                            <i style={{ fontSize: '35px', cursor: 'pointer', color: '#0D6EFD' }} className="fas fa-plus-square"></i>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên hình ảnh</th>
                                        <th>Hình ảnh</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataProductDetailImage && dataProductDetailImage.length > 0 &&
                                        dataProductDetailImage.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{(numberPageImage * 10) + index + 1}</td>
                                                    <td>{item.caption}</td>
                                                    <td>
                                                        <div onClick={() => openPreviewImage(item.image)} className="box-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                                                    </td>
                                                    <td style={{ display: 'flex', gap: 2 }}>
                                                        <button className='btn btn-warning' onClick={() => {
                                                            setproductImageId(item.id)
                                                            handleOpenImageModal()
                                                        }} >
                                                            Sửa
                                                        </button>
                                                        <button className='btn btn-danger' onClick={() => handleDeleteProductImage(item.id)} >Xóa</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <AddImageModal isOpenImageModal={isOpenImageModal} handleCloseImageModal={handleCloseImageModal} productImageId={productImageId} loadProductDetailImage={loadProductDetailImage} />
                </div>
                {
                    isOpen === true &&
                    <Lightbox mainSrc={imgPreview} onCloseRequest={() => setisOpen(false)} />
                }
                {
                    countImage > 1 &&
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp'}
                        breakLabel={'...'}
                        pageCount={countImage}
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
                        onPageChange={handleChangeImagePage}
                    />
                }
            </div>
            <div>
                <div className="card mb-4">
                    <div className="card-header">
                        <i className="fas fa-table me-1" />
                        Danh sách kích thước chi tiết sản phẩm
                        <div onClick={() => handleOpenSizeModal()} className="float-right"><i style={{ fontSize: '35px', cursor: 'pointer', color: '#0D6EFD' }} className="fas fa-plus-square"></i></div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Kích thước</th>
                                        <th>Chiều rộng</th>
                                        <th>Chiều dài</th>
                                        <th>Khối lượng</th>
                                        <th>Số lượng tồn</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataProductDetailSize && dataProductDetailSize.length > 0 &&
                                        dataProductDetailSize.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.sizeData.value}</td>
                                                    <td>{item.width}</td>
                                                    <td>{item.height}</td>
                                                    <td>{item.weight}</td>
                                                    <td>{item.stock}</td>
                                                    <td style={{ display: 'flex', gap: 2 }}>
                                                        <button className='btn btn-warning' onClick={() => {
                                                            setProductSizeId(item.id)
                                                            handleOpenSizeModal()
                                                        }} >
                                                            Sửa
                                                        </button>
                                                        <button className='btn btn-danger' onClick={() => handleDeleteProductSize(item.id)} >Xóa</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <AddSizeModal
                        isOpenSizeModal={isOpenSizeModal}
                        handleCloseSizeModal={handleCloseSizeModal}
                        productSizeId={productSizeId}
                        loadProductDetailSize={loadProductDetailSize}

                    />
                </div>
                {
                    isOpen === true &&
                    <Lightbox mainSrc={imgPreview} onCloseRequest={() => setisOpen(false)} />
                }
                {
                    countSize > 1 &&
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp'}
                        breakLabel={'...'}
                        pageCount={countSize}
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
                        onPageChange={handleChangeSizePage}
                    />
                }
            </div>
        </div >
    )
}

export default ManageProductImage;