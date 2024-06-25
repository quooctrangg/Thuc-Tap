import React from 'react';
import { useEffect, useState } from 'react';
import CommonUtils from '../../../../utils/CommonUtils';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { Modal, ModalFooter, ModalBody, Button } from 'reactstrap';
import { UpdateProductDetailImageService, createNewProductImageService, getProductDetailImageByIdService } from '../../../../services/userService';
import { useParams } from "react-router-dom";

const AddImageModal = (props) => {
    const { id } = useParams()
    const [inputValues, setInputValues] = useState({ image: '', imageReview: '', caption: '', isOpen: false, id: '' });
    const [productImageId, setProductImageId] = useState(null)

    useEffect(() => {
        setProductImageId(props.productImageId)
    })

    useEffect(() => {
        if (productImageId) {
            fetchProductImage(productImageId);
        } else {
            setInputValues({
                ...inputValues,
                ["image"]: '',
                ["imageReview"]: '',
                ["caption"]: ''
            })
        }
    }, [productImageId])

    let fetchProductImage = async (id) => {
        let res = await getProductDetailImageByIdService(id)
        if (res && res.errCode === 0) {
            setInputValues({
                ...inputValues,
                ["caption"]: res.data.caption,
                ["image"]: res.data.image,
                ["imageReview"]: res.data.image
            })
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file.size > 31312281) {
            toast.error("Dung lượng file bé hơn 30mb")
        }
        else {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file)
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl })

        }
    }
    let openPreviewImage = () => {
        if (!inputValues.imageReview) return;
        setInputValues({ ...inputValues, ["isOpen"]: true })
    }

    const handleAddProductImage = async () => {
        let response = await createNewProductImageService({
            caption: inputValues.caption,
            image: inputValues.image,
            id: id
        })
        if (response && response.errCode === 0) {
            toast.success("Thêm hình ảnh thành công !")
            props.loadProductDetailImage()
            props.handleCloseImageModal()
        } else {
            toast.error("Thêm hình ảnh thất bại !")
        }
    }

    const handleUpdateProductImage = async () => {
        let response = await UpdateProductDetailImageService({
            caption: inputValues.caption,
            image: inputValues.image,
            id: productImageId
        })
        if (response && response.errCode === 0) {
            toast.success("Cập nhật hình ảnh thành công !")
            props.loadProductDetailImage()
            props.handleCloseImageModal()
        } else {
            toast.error("Cập nhật ảnh thất bại !")
        }
    }

    return (
        <div className="">
            <Modal isOpen={props.isOpenImageModal} className={'booking-modal-container'} size="md" centered >
                <div className="modal-header">
                    <h5 className="modal-title">Thêm hình ảnh chi tiết sản phẩm</h5>
                    <button onClick={props.handleCloseImageModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Tên hình ảnh</label>
                            <input value={inputValues.caption} name="caption" onChange={(event) => handleOnChange(event)} type="text" className="form-control" />
                        </div>
                        <div className="col-12 form-group">
                            <label>Ảnh hiển thị</label>
                            <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} onClick={() => openPreviewImage()} className="img-review"></div>
                        </div>
                        <div className="col-12 form-group">
                            <label>Chọn hình ảnh</label>
                            <input onChange={(event) => handleOnChangeImage(event)} type="file" accept=".jpg,.png" className="form-control form-file" />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        productImageId ?
                            <button type="button" onClick={() => handleUpdateProductImage()} className="btn btn-primary">Cập nhật</button>
                            :
                            <button type="button" onClick={() => handleAddProductImage()} className="btn btn-primary">Thêm</button>
                    }
                    <Button onClick={props.handleCloseImageModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
            {inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false })}
                />
            }
        </div >
    )
}

export default AddImageModal;