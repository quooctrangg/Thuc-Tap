import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createNewReceiptDetailService, getAllProductAdmin } from '../../../services/userService';
import { useParams } from "react-router-dom";

const AddDetailReceiptModal = props => {
    const { id } = useParams();

    const [dataProductDetail, setdataProductDetail] = useState([])
    const [dataProductDetailSize, setdataProductDetailSize] = useState([])
    const [productDetailSizeId, setproductDetailSizeId] = useState('')
    const [dataProduct, setdataProduct] = useState([])
    const [inputValues, setInputValues] = useState({ quantity: 0, price: 0, productId: '', lotNumber: '' });

    if (dataProduct && dataProduct.length > 0 && inputValues.productId === '') {
        setInputValues({ ...inputValues, ["productId"]: dataProduct[0].id, })
        setproductDetailSizeId(dataProduct[0].productDetail[0].productDetailSize[0].id)
        setdataProductDetail(dataProduct[0].productDetail)
        setdataProductDetailSize(dataProduct[0].productDetail[0].productDetailSize)
    }

    useEffect(() => {
        loadProduct()
    }, [])

    let handleAddReceiptDetail = async () => {
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
            props.loadReceiptDetail(id)
            props.handleCloseDetailReceiptModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm nhập hàng thất bại")
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

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

    return (
        <Modal isOpen={props.isOpenDetailReceiptModal}>
            <div className="modal-header">
                <h4 className="modal-title">
                    Thêm sản phẩm
                </h4>
                <button onClick={props.handleCloseDetailReceiptModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="productId">Sản phẩm</label>
                        <select value={inputValues.productId} name="productId" onChange={(event) => handleOnChangeProduct(event)} id="productId" className="form-control">
                            {
                                dataProduct && dataProduct.length > 0 &&
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
                            {
                                dataProductDetail && dataProductDetail.length > 0 &&
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
                            {
                                dataProductDetailSize && dataProductDetailSize.length > 0 &&
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
                <button type="button" onClick={() => handleAddReceiptDetail()} className="btn btn-primary">Thêm</button>
            </ModalBody>
        </Modal>
    )
}

export default AddDetailReceiptModal