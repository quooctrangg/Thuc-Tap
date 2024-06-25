import React from 'react';
import { useEffect, useState } from 'react';
import { DeleteAllcodeService, getListAllCodeService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { PAGINATION } from '../../../utils/constant';
import ReactPaginate from 'react-paginate';
import FormSearch from '../../../component/Search/FormSearch';
import AddBrandModal from './AddBrandModal';

const ManageBrand = () => {
    const [keyword, setkeyword] = useState('')
    const [dataBrand, setdataBrand] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [isOpenAddBrandModal, setIsOpenAddBrandModal] = useState(false)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            console.log(error)
        }
    }, [numberPage, keyword])

    let fetchData = async () => {
        let arrData = await getListAllCodeService({
            type: 'BRAND',
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataBrand(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleDeleteBrand = async (event, id) => {
        event.preventDefault();
        let res = await DeleteAllcodeService(id)
        if (res && res.errCode === 0) {
            toast.success("Xóa nhãn hàng thành công")
            await fetchData()
        } else toast.error("Xóa nhãn hàng thất bại")
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleSearchBrand = () => {

    }

    let handleOnchangeSearch = (keyword) => {
        setkeyword(keyword)
    }

    const handleShowAddBrandModal = () => {
        setIsOpenAddBrandModal(true)
    }

    const handleCloseAddBrandModal = () => {
        setIsOpenAddBrandModal(false)
        setCurrent(null)
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý nhãn hàng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách nhãn hàng sản phẩm
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tên nhãn hàng"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchBrand} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleShowAddBrandModal()} className="btn btn-success" >
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
                                {dataBrand && dataBrand.length > 0 ?
                                    dataBrand.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{(numberPage * 10) + index + 1}</td>
                                                <td>{item.value}</td>
                                                <td>{item.code}</td>
                                                <td style={{ display: 'flex', gap: 2 }}>
                                                    <button onClick={() => {
                                                        setCurrent(item.id)
                                                        handleShowAddBrandModal()
                                                    }} className='btn btn-warning'>
                                                        Sửa
                                                    </button>
                                                    <button className='btn btn-danger' onClick={(event) => handleDeleteBrand(event, item.id)} >Xóa</button>
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
            <AddBrandModal isOpenAddBrandModal={isOpenAddBrandModal} handleCloseAddBrandModal={handleCloseAddBrandModal} id={current} fetchData={fetchData} />
        </div>
    )
}

export default ManageBrand;