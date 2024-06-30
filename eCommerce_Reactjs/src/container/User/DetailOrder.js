import React, { useEffect, useState } from 'react';
import storeVoucherLogo from '../../../src/resources/img/storeVoucher.png'
import CommonUtils from '../../utils/CommonUtils';
import ShopCartItem from '../../component/ShopCart/ShopCartItem';
import { useParams } from 'react-router-dom';
import { getDetailOrder } from '../../services/userService';
import './DetailOrder.scss'
import 'react-image-lightbox/style.css';

function DetailOrder(props) {
    const { orderId } = useParams();

    const [DataOrder, setDataOrder] = useState({});
    const [priceShip, setpriceShip] = useState(0)

    let price = 0;

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId)
        }
    }, [])

    let fetchOrder = async (orderId) => {
        let order = await getDetailOrder(orderId)
        if (order && order.errCode == 0) {
            setDataOrder(order.data)
            setpriceShip(order.data.typeShipData.price)
        }
    }

    let totalPriceDiscount = (price, discount) => {
        try {
            if (discount.typeVoucherOfVoucherData.typeVoucher === "percent") {
                if (((price * discount.typeVoucherOfVoucherData.value) / 100) > discount.typeVoucherOfVoucherData.maxValue) {
                    return price - discount.typeVoucherOfVoucherData.maxValue
                } else {
                    return price - ((price * discount.typeVoucherOfVoucherData.value) / 100)
                }
            } else {
                return price - discount.typeVoucherOfVoucherData.maxValue
            }
        } catch (error) {
        }
    }

    return (
        <div className="wrap-order">
            <div className="wrap-address-order">
                <div className="border-top-address-order"></div>
                <div className="wrap-content-address">
                    <div className="content-up">
                        <div className="content-left">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Địa Chỉ Nhận Hàng</span>
                        </div>
                    </div>
                    <div className="content-down">
                        {
                            DataOrder && DataOrder.addressUser &&
                            <>
                                <div className="content-left">
                                    <span>{DataOrder.addressUser.shipName} ({DataOrder.addressUser.shipPhonenumber})</span>
                                </div>
                                <div className="content-center">
                                    <span>
                                        {DataOrder.addressUser.shipAdress}
                                    </span>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            <div className="wrap-order-item">
                <section className="cart_area">
                    <div className="container">
                        <div className="cart_inner">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Sản phẩm</th>
                                            <th scope="col">Giá</th>
                                            <th style={{ textAlign: 'center' }} scope="col">Số lượng</th>
                                            <th style={{ textAlign: 'center' }} scope="col">Tổng tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            DataOrder.orderDetail && DataOrder.orderDetail.length > 0 &&
                                            DataOrder.orderDetail.map((item, index) => {
                                                price += item.quantity * item.realPrice
                                                let name = `${item.product.name} - ${item.productDetail.nameDetail} - ${item.productDetailSize.sizeData.value}`
                                                return (
                                                    <ShopCartItem isOrder={true} id={item.id} productdetailsizeId={item.productDetailSize.id} key={index} name={name} price={item.realPrice} quantity={item.quantity} image={item.productImage[0].image} />
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="box-shipping">
                            <h6>
                                Đơn vị vận chuyển
                            </h6>
                            <div>
                                {
                                    DataOrder && DataOrder.typeShipData &&
                                    <label className="form-check-label">{DataOrder.typeShipData.type} - {CommonUtils.formatter.format(DataOrder.typeShipData.price)} </label>
                                }
                            </div>
                        </div>
                        <div className="box-shopcart-bottom">
                            <div className="content-left">
                                <div className="wrap-voucher">
                                    <img width="20px" height="20px" style={{ marginLeft: "-3px" }} src={storeVoucherLogo}></img>
                                    <span className="choose-voucher">Mã voucher: {DataOrder && DataOrder.voucherData && DataOrder.voucherData.codeVoucher}</span>
                                </div>
                                <div className="wrap-note">
                                    <span>Lời Nhắn: {DataOrder.note && DataOrder.note}</span>
                                </div>
                            </div>
                            <div className="content-right">
                                <div className="wrap-price">
                                    <span className="text-total">Tổng thanh toán {DataOrder && DataOrder.orderDetail && DataOrder.orderDetail.length} sản phẩm: </span>
                                    <span className="text-price">{DataOrder && DataOrder.voucherData && DataOrder.voucherId ? CommonUtils.formatter.format(totalPriceDiscount(price, DataOrder.voucherData) + priceShip) : CommonUtils.formatter.format(price + (+priceShip))}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="wrap-payment">
                <div className="content-top" style={{ display: 'flex', gap: '10px' }}>
                    <span>Phương Thức Thanh Toán</span>
                    <div className='box-type-payment active'>{DataOrder.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online'}</div>
                </div>
                <div className="content-top" style={{ display: 'flex', gap: '10px' }}>
                    <span>Trạng Thái Đơn Hàng</span>
                    <div className='box-type-payment active'>{DataOrder.statusOrderData && DataOrder.statusOrderData.value}</div>
                </div>
                <div className="content-bottom">
                    {
                        DataOrder && DataOrder.addressUser &&
                        <div className="wrap-bottom">
                            <div className="box-flex">
                                <div className="head">Tên khách hàng</div>
                                <div >{DataOrder.addressUser.shipName}</div>
                            </div>
                            <div className="box-flex">
                                <div className="head">Số điện thoại</div>
                                <div >{DataOrder.addressUser.shipPhonenumber}</div>
                            </div>
                            <div className="box-flex">
                                <div className="head">Địa chỉ email</div>
                                <div >{DataOrder.addressUser.shipEmail}</div>
                            </div>
                        </div>
                    }
                    <div className="wrap-bottom">
                        <div className="box-flex">
                            <div className="head">Tổng tiền hàng</div>
                            <div >{CommonUtils.formatter.format(price)}</div>
                        </div>
                        <div className="box-flex">
                            <div className="head">Tổng giảm giá</div>
                            <div className='text-red'>-{DataOrder && DataOrder.voucherData && DataOrder.voucherId ? CommonUtils.formatter.format(price - totalPriceDiscount(price, DataOrder.voucherData)) : CommonUtils.formatter.format(0)}</div>
                        </div>
                        <div className="box-flex">
                            <div className="head">Phí vận chuyển</div>
                            <div className='text-primary'>+{CommonUtils.formatter.format(priceShip)}</div>
                        </div>
                        <div className="box-flex">
                            <div className="head">Tổng thanh toán:</div>
                            <div className="money">{DataOrder && DataOrder.voucherData && DataOrder.voucherId ? CommonUtils.formatter.format(totalPriceDiscount(price, DataOrder.voucherData) + priceShip) : CommonUtils.formatter.format(price + (+priceShip))}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailOrder;