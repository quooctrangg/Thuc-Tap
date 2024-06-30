import React from 'react';
import CommonUtils from '../../utils/CommonUtils';
import { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { createNewReviewService } from '../../services/userService'
import { toast } from 'react-toastify';
import './RateModal.scss'

const RateModal = (props) => {
    const [inputValues, setInputValues] = useState({ activeStar: '', imageReview: '', image: '', content: '', dataReview: [], countStar: {} });

    let handleChooseStart = (number) => {
        setInputValues({ ...inputValues, ["activeStar"]: number })
    }

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

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let handleSaveComment = async () => {
        if (!inputValues.activeStar) toast.error("Bạn chưa chọn sao !")
        else if (!inputValues.content) toast.error("Nội dung không được để trống!")
        else {
            let response = await createNewReviewService({
                productId: props.productId,
                content: inputValues.content,
                image: inputValues.image,
                userId: props.userId,
                star: inputValues.activeStar,
                orderDetailId: props.orderDetailId
            })
            if (response && response.errCode === 0) {
                toast.success("Đánh giá thành công!")
                handleCloseModaRate()
                props.loadDataOrder()
            } else {
                toast.error(response.errMessage)
            }
        }
    }

    const handleCloseModaRate = () => {
        setInputValues({
            ["activeStar"]: '', ["imageReview"]: '', ["image"]: '', ["content"]: '', ["dataReview"]: [], ["countStar"]: {}
        })
        props.handleCloseModaRate()
    }

    return (
        <div>
            <Modal isOpen={props.isOpenModalRate} className={'booking-modal-container'} size="xl" centered>
                <div className="modal-header">
                    <h5 className="modal-title">
                        Đánh giá sản phẩm
                        <span className='text-red'>
                            {" " + props.productName}
                        </span>
                    </h5>
                    <button onClick={handleCloseModaRate} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="review_item">
                        <div className="form-group">
                            <label style={{ color: '#333', fontSize: '16px', fontWeight: '600' }}>Viết đánh giá của bạn</label>
                            <textarea name="content" value={inputValues.content} onChange={(event) => handleOnChange(event)} rows="3" className="form-control"></textarea>
                        </div>
                        <div className="content-review">
                            <div className="content-left">
                                <label style={{ marginBottom: '0', cursor: 'pointer' }} htmlFor="cmtImg"><i className="fas fa-camera" ></i></label>
                                <input type="file" id="cmtImg" accept=".jpg,.png" hidden onChange={(event) => handleOnChangeImage(event)} />
                                <div className={inputValues.activeStar === 1 ? 'box-star active' : 'box-star'} onClick={() => handleChooseStart(1)}>
                                    <i className="fa fa-star" />
                                </div>
                                <div className={inputValues.activeStar === 2 ? 'box-star active' : 'box-star'} onClick={() => handleChooseStart(2)}>
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                </div>
                                <div className={inputValues.activeStar === 3 ? 'box-star active' : 'box-star'} onClick={() => handleChooseStart(3)}>
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                </div>
                                <div className={inputValues.activeStar === 4 ? 'box-star active' : 'box-star'} onClick={() => handleChooseStart(4)}>
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                </div>
                                <div className={inputValues.activeStar === 5 ? 'box-star active' : 'box-star'} onClick={() => handleChooseStart(5)}>
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                    <i className="fa fa-star" />
                                </div>
                            </div>
                            <div className="content-right">
                                <button onClick={() => handleSaveComment()} className="btn btn-primary">
                                    Đánh giá
                                </button>
                            </div>
                        </div>
                        <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} className="preview-cmt-img"></div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default RateModal