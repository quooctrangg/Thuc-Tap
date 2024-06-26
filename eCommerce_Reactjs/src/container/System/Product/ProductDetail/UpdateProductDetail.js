import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UpdateProductDetailService, getProductDetailByIdService } from '../../../../services/userService';

const UpdateProductDetailModal = props => {
    const [productDetailId, setProductDetailId] = useState(null)
    const [inputValues, setInputValues] = useState({
        originalPrice: '', discountPrice: '',
        image: '', imageReview: '', isOpen: false, nameDetail: '', description: ''
    });

    useEffect(() => {
        setProductDetailId(props.id)
    })

    useEffect(() => {
        if (productDetailId) {
            fetchProductDetail(productDetailId);
        }
    }, [productDetailId])

    let fetchProductDetail = async (id) => {
        let res = await getProductDetailByIdService(id)
        if (res && res.errCode === 0) {
            setStateProductdetail(res.data)
        }
    }

    let setStateProductdetail = (data) => {
        setInputValues({
            ...inputValues,
            ["originalPrice"]: data.originalPrice,
            ["stock"]: data.stock,
            ["discountPrice"]: data.discountPrice,
            ["nameDetail"]: data.nameDetail,
            ["description"]: data.description,
        })
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let handleSaveProductDetail = async () => {
        let res = await UpdateProductDetailService({
            id: productDetailId,
            description: inputValues.description,
            originalPrice: inputValues.originalPrice,
            discountPrice: inputValues.discountPrice,
            nameDetail: inputValues.nameDetail
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật loại sản phẩm thành công!")
            props.handleCloseUpdateProductDetailModal()
            props.loadProductDetail()
        } else {
            toast.error(res.errMessage)
        }
    }

    return (
        <Modal isOpen={props.isOpenUpdateProductDetailModal} size={'xl'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    Cập nhật chi tiết sản phẩm
                </h4>
                <button onClick={props.handleCloseUpdateProductDetailModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="inputEmail4">Màu</label>
                        <input type="text" value={inputValues.nameDetail} name="nameDetail" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputEmail4">Giá gốc</label>
                        <input type="number" value={inputValues.originalPrice} name="originalPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputPassword4">Giá khuyến mãi</label>
                        <input type="number" value={inputValues.discountPrice} name="discountPrice" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                    </div>

                </div>
                <div className="form-group">
                    <label htmlFor="inputAddress">Mô tả chi tiết</label>
                    <textarea rows="4" value={inputValues.description} name="description" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                </div>
                <button onClick={() => handleSaveProductDetail()} type="button" className="btn btn-primary">Cập nhật</button>
            </ModalBody>
        </Modal>
    )
}

export default UpdateProductDetailModal