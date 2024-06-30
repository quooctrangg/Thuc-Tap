import React from 'react';
import CommonUtils from '../../utils/CommonUtils';
import moment from 'moment'
import RateModal from '../../container/User/RateModal'
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import { getAllOrdersByUser, updateStatusOrderService } from '../../services/userService'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import './OrderUser.scss';

function OrderUser(props) {
    const { id } = useParams();

    const [DataOrder, setDataOrder] = useState([]);
    const [isOpenModalRate, setisOpenModalRate] = useState(false)
    const [productId, setProductId] = useState()
    const [productName, setProductName] = useState()
    const [orderDetailId, setOderDetailId] = useState()
    const [typeOrder, setTypeOrder] = useState('all')
    const [data, setData] = useState([])

    let price = 0;

    useEffect(async () => {
        await loadDataOrder()
    }, [])

    useEffect(() => {
        switch (typeOrder) {
            case 'all':
                setData(DataOrder)
                break;
            case 'S3':
                setData(DataOrder.filter(e => e.statusId == 'S3'))
                break;
            case 'S4':
                setData(DataOrder.filter(e => e.statusId == 'S4'))
                break;
            case 'S5':
                setData(DataOrder.filter(e => e.statusId == 'S5'))
                break;
            case 'S6':
                setData(DataOrder.filter(e => e.statusId == 'S6'))
                break;
            case 'S7':
                setData(DataOrder.filter(e => e.statusId == 'S7'))
                break;
        }
    }, [typeOrder])

    const loadDataOrder = async () => {
        if (id) {
            let order = await getAllOrdersByUser(id)
            setDataOrder(order.data)
            setData(order.data)
        }
    }

    const handleCancelOrder = async (data) => {
        let res = await updateStatusOrderService({
            id: data.id,
            statusId: 'S7',
            dataOrder: data
        })
        if (res && res.errCode == 0) {
            toast.success("Hủy đơn hàng thành công")
            loadDataOrder()
        }
    }

    const totalPriceDiscount = (price, discount) => {
        if (discount.typeVoucherOfVoucherData.typeVoucher === "percent") {
            if (((price * discount.typeVoucherOfVoucherData.value) / 100) > discount.typeVoucherOfVoucherData.maxValue) {
                return price - discount.typeVoucherOfVoucherData.maxValue
            } else {
                return price - ((price * discount.typeVoucherOfVoucherData.value) / 100)
            }
        } else {
            return price - discount.typeVoucherOfVoucherData.maxValue
        }
    }

    const handleCloseModaRate = () => {
        setisOpenModalRate(false)
    }

    const handleOpenRateModal = async (id, name, orderId) => {
        setProductId(id)
        setProductName(name)
        setOderDetailId(orderId)
        setisOpenModalRate(true)
    }

    return (
        <div className="container container-list-order rounded mt-5 mb-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="box-nav-order">
                        <button onClick={() => setTypeOrder('all')} className={typeOrder == 'all' ? 'nav-item-order active' : 'nav-item-order'}>
                            <span>Tất cả</span>
                        </button>
                        <button onClick={() => setTypeOrder('S3')} className={typeOrder == 'S3' ? 'nav-item-order active' : 'nav-item-order'}>
                            <span>Chờ xác nhận</span>
                        </button>
                        <button onClick={() => setTypeOrder('S4')} className={typeOrder == 'S4' ? 'nav-item-order active' : 'nav-item-order'}>
                            <span>Chờ lấy hàng</span>
                        </button>
                        <button onClick={() => setTypeOrder('S5')} className={typeOrder == 'S5' ? 'nav-item-order active' : 'nav-item-order'}>
                            <span>Đang giao hàng</span>
                        </button>
                        <button onClick={() => setTypeOrder('S6')} className={typeOrder == 'S6' ? 'nav-item-order active' : 'nav-item-order'}>
                            <span>Đã giao hàng</span>
                        </button>
                        <button onClick={() => setTypeOrder('S7')} className={typeOrder == 'S7' ? 'nav-item-order active' : 'nav-item-order'}>
                            <span>Hủy đơn</span>
                        </button>
                    </div>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className='box-list-order'>
                                            <Link to={`/user/order/${id}/${item.id}`} className='content-top'>
                                                <div className='content-left'>
                                                    <span className='label-name-shop'>Jolido shop</span>
                                                </div>
                                                <div className='content-right'>
                                                    {item.statusOrderData && item.statusOrderData.value} {item.isPaymentOnlien == 1 && ' | Đã thanh toán'}
                                                </div>
                                            </Link>
                                            {
                                                item.orderDetail && item.orderDetail.length > 0 &&
                                                item.orderDetail.map((element, index) => {
                                                    price += element.quantity * element.realPrice
                                                    return (
                                                        <div className='content-center' key={element.id}>
                                                            <div className='box-item-order'>
                                                                <img src={element.productImage[0].image}></img>
                                                                <div className='box-des'>
                                                                    <a href={`/detail-product/${element.product.id}`}>
                                                                        <span className='name'>{element.product.name}</span>
                                                                    </a>
                                                                    <span className='type'>Phân loại hàng: {element.productDetail.nameDetail} | {element.productDetailSize.sizeData.value}</span>
                                                                    <span>x{element.quantity}</span>
                                                                </div>
                                                                <div className='box-price'>
                                                                    <div style={{ fontSize: '18px', marginLeft: '16px' }}>
                                                                        {CommonUtils.formatter.format(element.realPrice)}
                                                                    </div>
                                                                    {
                                                                        item.statusId == 'S6' && element.isRate == 0 &&
                                                                        <button type='button' onClick={() => handleOpenRateModal(element.product.id, element.product.name, element.id)} className='btn btn-primary profile-button'>
                                                                            <div className='view-shop'>
                                                                                Đánh giá
                                                                            </div>
                                                                        </button>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className='content-bottom'>
                                            <div className='up'>
                                                <span className='text-start'>
                                                    Ngày đặt: {moment.utc(item.updatedAt).local().format('DD/MM/YYYY')}
                                                </span>
                                                <span>
                                                    <svg width="16" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M15.94 1.664s.492 5.81-1.35 9.548c0 0-.786 1.42-1.948 2.322 0 0-1.644 1.256-4.642 2.561V0s2.892 1.813 7.94 1.664zm-15.88 0C5.107 1.813 8 0 8 0v16.095c-2.998-1.305-4.642-2.56-4.642-2.56-1.162-.903-1.947-2.323-1.947-2.323C-.432 7.474.059 1.664.059 1.664z" fill="url(#paint0_linear)"></path>
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M8.073 6.905s-1.09-.414-.735-1.293c0 0 .255-.633 1.06-.348l4.84 2.55c.374-2.013.286-4.009.286-4.009-3.514.093-5.527-1.21-5.527-1.21s-2.01 1.306-5.521 1.213c0 0-.06 1.352.127 2.955l5.023 2.59s1.09.42.693 1.213c0 0-.285.572-1.09.28L2.928 8.593c.126.502.285.99.488 1.43 0 0 .456.922 1.233 1.56 0 0 1.264 1.126 3.348 1.941 2.087-.813 3.352-1.963 3.352-1.963.785-.66 1.235-1.556 1.235-1.556a6.99 6.99 0 00.252-.632L8.073 6.905z" fill="#FEFEFE"></path>
                                                        <defs>
                                                            <linearGradient id="paint0_linear" x1="8" y1="0" x2="8" y2="16.095" gradientUnits="userSpaceOnUse">
                                                                <stop stop-color="#F53D2D"></stop>
                                                                <stop offset="1" stopColor="#F63"></stop>
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <span>Tổng số tiền: </span>
                                                    <span className='name'>{item && item.voucherData && item.voucherData.id ? CommonUtils.formatter.format(totalPriceDiscount(price, item.voucherData) + item.typeShipData.price) : CommonUtils.formatter.format(price + (+item.typeShipData.price))}</span>
                                                    <div style={{ display: 'none' }}>
                                                        {price = 0}
                                                    </div>
                                                </span>
                                            </div>
                                            <div className='down'>
                                                {
                                                    ((item.statusId == 'S3') || (item.statusId == 'S4')) && item.isPaymentOnlien == 0 &&
                                                    <div className='btn-buy' onClick={() => handleCancelOrder(item)}>
                                                        Hủy đơn
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className='text-center text-red mt-5'>
                                Không có đơn hàng.
                            </div>
                    }
                </div>
            </div>
            <RateModal loadDataOrder={loadDataOrder} orderDetailId={orderDetailId} productId={productId} productName={productName} userId={id} handleCloseModaRate={handleCloseModaRate} isOpenModalRate={isOpenModalRate}></RateModal>
        </div >
    );
}

export default OrderUser;