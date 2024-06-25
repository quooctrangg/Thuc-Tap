import React from 'react';
import { useEffect, useState } from 'react';
import { getAllBanner, deleteBannerService } from '../../../services/userService';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import './AddBannerModal.scss';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { Link } from "react-router-dom";
import FormSearch from '../../../component/Search/FormSearch';
import AddBannerModal from './AddBannerModal';

const ManageBanner = () => {
    const [keyword, setkeyword] = useState('')
    const [dataBanner, setdataBanner] = useState([])
    const [imgPreview, setimgPreview] = useState('')
    const [isOpen, setisOpen] = useState(false)
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [isOpenAddBannerModal, setIsOpenAddBannerModal] = useState(false)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        loadBanner()
    }, [numberPage, keyword])

    let loadBanner = async () => {
        let arrData = await getAllBanner({
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataBanner(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let openPreviewImage = (url) => {
        setimgPreview(url);
        setisOpen(true);
    }

    let handleDeleteBanner = async (id) => {
        let response = await deleteBannerService({
            data: {
                id: id
            }
        })
        if (response && response.errCode === 0) {
            toast.success("Xóa băng rôn thành công !")
            await loadBanner()
        } else {
            toast.error("Xóa băng rôn thất bại")
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleSearchBanner = (keyword) => {

    }

    let handleOnchangeSearch = (keyword) => {
        setkeyword(keyword)
    }

    const handleCloseAddBannerModal = () => {
        setIsOpenAddBannerModal(false)
        setCurrent(null)
    }

    const handleShowAddBannerModal = () => {
        setIsOpenAddBannerModal(true)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý băng rôn</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách băng rôn
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên băng rôn"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchBanner} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleShowAddBannerModal()} className="btn btn-success" >
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
                                    <th>Tên băng rôn</th>
                                    <th>Hình ảnh</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataBanner && dataBanner.length > 0 ?
                                    dataBanner.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.name}</td>
                                                <td style={{ width: '30%' }} ><div onClick={() => openPreviewImage(item.image)} className="box-img-preview" style={{ backgroundImage: `url(${item.image})`, width: '100%' }}></div></td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <button onClick={() => {
                                                        setCurrent(item.id)
                                                        handleShowAddBannerModal()
                                                    }} className='btn btn-warning'>
                                                        Sửa
                                                    </button>
                                                    <button className='btn btn-danger' onClick={() => handleDeleteBanner(item.id)} >
                                                        Xóa
                                                    </button>
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
                <AddBannerModal id={current} handleCloseAddBannerModal={handleCloseAddBannerModal} isOpenAddBannerModal={isOpenAddBannerModal} loadBanner={loadBanner} />
            </div>
            {
                isOpen === true &&
                <Lightbox mainSrc={imgPreview}
                    onCloseRequest={() => setisOpen(false)}
                />
            }
        </div >
    )
}

export default ManageBanner;