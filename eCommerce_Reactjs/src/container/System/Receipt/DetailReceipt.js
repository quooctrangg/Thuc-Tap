import React from 'react';
import { useEffect, useState } from 'react';
import { getAllProductAdmin, getDetailReceiptByIdService, createNewReceiptDetailService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import CommonUtils from '../../../utils/CommonUtils';

const DetailReceipt = (props) => {
    const { id } = useParams();
    const [dataProduct, setdataProduct] = useState([])
    const [dataProductDetail, setdataProductDetail] = useState([])
    const [dataProductDetailSize, setdataProductDetailSize] = useState([])
    const [productDetailSizeId, setproductDetailSizeId] = useState('')
    const [dataReceiptDetail, setdataReceiptDetail] = useState({})
    const [billNumber, setBillNumber] = useState('')
    const [inputValues, setInputValues] = useState({
        quantity: 0, price: 0, productId: '', lotNumber: ''
    });
    if (dataProduct && dataProduct.length > 0 && inputValues.productId === '') {
        setInputValues({ ...inputValues, ["productId"]: dataProduct[0].id, })
        setproductDetailSizeId(dataProduct[0].productDetail[0].productDetailSize[0].id)
        setdataProductDetail(dataProduct[0].productDetail)
        setdataProductDetailSize(dataProduct[0].productDetail[0].productDetailSize)
    }

    useEffect(() => {
        loadProduct()
        loadReceiptDetail(id)
    }, [])

    let loadReceiptDetail = async (id) => {
        let res = await getDetailReceiptByIdService(id)
        if (res && res.errCode == 0) {
            setdataReceiptDetail(res.data.receiptDetail)
            setBillNumber(res.data.billNumber)
        }
    }

    let loadProduct = async () => {
        let arrData = await getAllProductAdmin({
            sortName: '',
            sortPrice: '',
            categoryId: 'ALL',
            brandId: 'ALL',
            limit: '',
            offset: '',
            keyword: ''

        })
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data)
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleOnChangeProduct = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value })
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataProduct[i].id == value) {
                setdataProductDetail(dataProduct[i].productDetail)
                setdataProductDetailSize(dataProduct[i].productDetail[0].productDetailSize)
                setproductDetailSizeId(dataProduct[i].productDetail[0].productDetailSize[0].id)
            }
        }
    };

    let handleOnChangeProductDetail = event => {
        const { name, value } = event.target;
        for (let i = 0; i < dataProductDetail.length; i++) {
            if (dataProductDetail[i].id == value) {
                setdataProductDetailSize(dataProductDetail[i].productDetailSize)
                setproductDetailSizeId(dataProductDetail[i].productDetailSize[0].id)
            }
        }
    }

    let handleSaveReceiptDetail = async () => {
        let res = await createNewReceiptDetailService({
            receiptId: id,
            productDetailSizeId: productDetailSizeId,
            quantity: inputValues.quantity,
            price: inputValues.price,
            lotNumber: inputValues.lotNumber
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm nhập chi tiết hàng thành công")
            setInputValues({
                ...inputValues,
                ["quantity"]: 0,
                ["price"]: 0,
                ["lotNumber"]: ''
            })
            loadReceiptDetail(id)
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm nhập hàng thất bại")
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chi tiết nhập hàng hóa đơn {billNumber}</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thêm mới chi tiết nhập hàng
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="productId">Sản phẩm</label>
                                <select value={inputValues.productId} name="productId" onChange={(event) => handleOnChangeProduct(event)} id="productId" className="form-control">
                                    {dataProduct && dataProduct.length > 0 &&
                                        dataProduct.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="productDetail">Màu</label>
                                <select onChange={(event) => handleOnChangeProductDetail(event)} name='productDetail' id="productDetail" className="form-control">
                                    {dataProductDetail && dataProductDetail.length > 0 &&
                                        dataProductDetail.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.nameDetail}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="productDetailSizeId">Size sản phẩm</label>
                                <select value={productDetailSizeId} name="productDetailSizeId" onChange={(event) => setproductDetailSizeId(event.target.value)} id="productDetailSizeId" className="form-control">
                                    {dataProductDetailSize && dataProductDetailSize.length > 0 &&
                                        dataProductDetailSize.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.sizeId}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="lotnumber">Số lô</label>
                                <input type="text" value={inputValues.lotNumber} name="lotNumber" onChange={(event) => handleOnChange(event)} className="form-control" id="lotnumber" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="quantity">Số lượng</label>
                                <input type="number" value={inputValues.quantity} name="quantity" onChange={(event) => handleOnChange(event)} className="form-control" id="quantity" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="price">Đơn giá</label>
                                <input type="number" value={inputValues.price} name="price" onChange={(event) => handleOnChange(event)} className="form-control" id="price" />
                            </div>
                        </div>
                        <button type="button" onClick={() => handleSaveReceiptDetail()} className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chi tiết nhập hàng
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Số lô</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá / 1 chiếc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataReceiptDetail && dataReceiptDetail.length > 0 ?
                                    dataReceiptDetail.map((item, index) => {
                                        console.log(item);
                                        let name = `${item.productData.name} - ${item.productDetailData.nameDetail} - ${item.productDetailSizeData.sizeData.value}`
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.lotNumber}</td>
                                                <td>{name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{CommonUtils.formatter.format(item.price)}</td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan={5} className='text-center text-red'>
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailReceipt;