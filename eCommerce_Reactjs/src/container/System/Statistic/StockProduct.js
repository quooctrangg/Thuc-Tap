import React from 'react';
import ReactPaginate from 'react-paginate';
import CommonUtils from '../../../utils/CommonUtils';
import { useEffect, useState } from 'react';
import { getStatisticStockProduct } from '../../../services/userService';
import { PAGINATION } from '../../../utils/constant';

const StockProduct = () => {
    const [dataStockProduct, setdataStockProduct] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)

    useEffect(() => {
        fetchData()
    }, [numberPage])

    let fetchData = async () => {
        let arrData = await getStatisticStockProduct({
            limit: PAGINATION.pagerow,
            offset: numberPage * PAGINATION.pagerow,
        })
        if (arrData && arrData.errCode === 0) {
            setdataStockProduct(arrData.data)
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
    }

    let handleOnClickExport = async () => {
        let res = await getStatisticStockProduct({
            limit: '',
            offset: '',
        })
        if (res && res.errCode == 0) {
            await CommonUtils.exportExcel(res.data, "Danh sách sản phẩm tồn kho", "ListOrder")
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý sản phẩm tồn kho</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách sản phẩm tồn kho
                </div>
                <div className="card-body">
                    <div className='row'>
                        <div className='col-12 mb-2'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-light" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
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
                                    <th>Số lượng tồn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataStockProduct && dataStockProduct.length > 0 ?
                                        dataStockProduct.map((item, index) => {
                                            let name = `${item.productdData.name} - ${item.productDetaildData.nameDetail} - ${item.sizeData.value}`
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{name}</td>
                                                    <td>{item.productdData.categoryData.value}</td>
                                                    <td>{item.productdData.brandData.value}</td>
                                                    <td>{item.productdData.material}</td>
                                                    <td>{item.stock}</td>
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
        </div>
    )
}

export default StockProduct;