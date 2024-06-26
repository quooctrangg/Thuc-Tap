import React, { useEffect, useState } from 'react';
import './ReviewProduct.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { getAllReviewByProductIdService, ReplyReviewService, deleteReviewService } from '../../services/userService';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import ReviewModal from './ReviewModal';

function ReviewProduct(props) {
    const { id } = useParams()
    const [inputValues, setInputValues] = useState({
        activeStar: '', imageReview: '', image: '', content: '', user: JSON.parse(localStorage.getItem('userData')), dataReview: [], countStar: {}, isOpen: false,
        isOpenModal: false, parentId: ''
    });

    useEffect(() => {
        let fetchAllReview = async () => {
            await loadAllReview()
        }
        fetchAllReview()
    }, [])

    let openPreviewImage = (url) => {
        setInputValues({ ...inputValues, ["imageReview"]: url, ["isOpen"]: true })
    }

    let loadAllReview = async () => {
        let res = await getAllReviewByProductIdService(id)
        if (res && res.errCode === 0) {
            let count5 = res.data.filter(item => item.star === 5)
            let count4 = res.data.filter(item => item.star === 4)
            let count3 = res.data.filter(item => item.star === 3)
            let count2 = res.data.filter(item => item.star === 2)
            let count1 = res.data.filter(item => item.star === 1)
            await setInputValues({
                ...inputValues, ["dataReview"]: res.data, ["countStar"]: {
                    star5: count5.length,
                    star4: count4.length,
                    star3: count3.length,
                    star2: count2.length,
                    star1: count1.length,
                    average: ((count5.length * 5) + (count4.length * 4) + (count3.length * 3) + (count2.length * 2) + (count1.length * 1)) / (count5.length + count4.length + count3.length + count2.length + count1.length),
                    quantity: count5.length + count4.length + count3.length + count2.length + count1.length
                },
                ["content"]: '', ["image"]: '', ["imageReview"]: '', ["activeStar"]: '', ["isOpenModal"]: false
            })
        }
    }

    let closeModal = () => {
        setInputValues({ ...inputValues, ["isOpenModal"]: false, ["parentId"]: '' })
    }

    let handleOpenModal = (id) => {
        setInputValues({ ...inputValues, ["isOpenModal"]: true, ["parentId"]: id })
    }

    let sendDataFromReViewModal = async (content) => {
        let res = await ReplyReviewService({
            content: content,
            productId: id,
            userId: inputValues.user.id,
            parentId: inputValues.parentId
        })
        if (res && res.errCode === 0) {
            toast.success("Phản hồi thành công !");
            await loadAllReview()
        }
    }

    let handleDeleteReply = async (id) => {
        let res = await deleteReviewService({
            data: {
                id: id
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa phản hồi thành công !")
            await loadAllReview()
        } else {
            toast.error(res.errMessage)
        }
    }

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="row total_rate">
                    <div className="col-6">
                        <div className="box_total">
                            <h5>Sao trung bình</h5>
                            <h4>{inputValues.countStar.average ? Math.round(inputValues.countStar.average * 10) / 10 : 0}</h4>
                            <h6>({inputValues.countStar.quantity} lượt đánh giá)</h6>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="rating_list">
                            <h3>{inputValues.countStar.quantity} lượt đánh giá</h3>
                            <ul className="list">
                                <li>
                                    <a href="#">
                                        5
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" /> Có {inputValues.countStar.star5} lượt đánh giá
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        4
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" /> Có {inputValues.countStar.star4} lượt đánh giá
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        3
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" /> Có {inputValues.countStar.star3} lượt đánh giá
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        2
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" /> Có {inputValues.countStar.star2} lượt đánh giá
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        1
                                        <i className="fa fa-star" /> Có {inputValues.countStar.star1} lượt đánh giá
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="review_list">
                    {inputValues.dataReview && inputValues.dataReview.length > 0 && inputValues.dataReview.map((item, index) => {
                        if (!item.parentId) {
                            let name = `${item.user.firstName ? item.user.firstName : ''} ${item.user.lastName}`
                            let arrStar = []
                            for (let i = 0; i < item.star; i++) {
                                arrStar[i] = 1
                            }
                            return (
                                <div key={index} className="review_item">
                                    <div className="media">
                                        <div className="d-flex">
                                            <img className="img-avatar" src={item.user.image} alt="" />
                                        </div>
                                        <div className="media-body">
                                            <h4>{name}</h4>
                                            {arrStar && arrStar.length > 0 &&
                                                arrStar.map((item, index) => {
                                                    return (
                                                        <i key={index} className="fa fa-star" />
                                                    )
                                                })
                                            }
                                            {inputValues.user && inputValues.user.roleId === "R1" &&
                                                <a style={{ cursor: 'pointer' }} onClick={() => handleOpenModal(item.id)} className="reply_btn" >Phản hồi</a>
                                            }
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: '88px' }}>
                                        <p style={{ paddingTop: '0px' }}>
                                            {item.content}
                                        </p>
                                        {item.image &&
                                            <img onClick={() => openPreviewImage(item.image)} className="img-cmt" src={item.image}></img>
                                        }
                                        {item.childComment && item.childComment.length > 0 &&
                                            item.childComment.map((item, index) => {
                                                return (
                                                    <div key={index} className="box-reply">
                                                        <span>Phản hồi của người bán</span>
                                                        <p>{item.content}</p>
                                                        {inputValues.user && inputValues.user.roleId === "R1" &&
                                                            <button onClick={() => handleDeleteReply(item.id)} className="btn-delete-reply" type="button">Xóa</button>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        }
                    })
                    }
                </div>
            </div>
            {
                inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false, ["imageReview"]: '' })}
                />
            }
            <ReviewModal
                isOpenModal={inputValues.isOpenModal}
                closeModal={closeModal}
                sendDataFromReViewModal={sendDataFromReViewModal}
            />
        </div>
    );
}

export default ReviewProduct;