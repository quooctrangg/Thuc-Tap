import React from 'react';
import ShopCartItem from '../../component/ShopCart/ShopCartItem';
import storeVoucherLogo from '../../../src/resources/img/storeVoucher.png'
import AddressUsersModal from './AdressUserModal';
import VoucherModal from './VoucherModal';
import CommonUtils from '../../utils/CommonUtils';
import { useEffect, useState } from 'react';
import { getAllTypeShip, getAllAddressUserByUserIdService, createNewAddressUserrService } from '../../services/userService';
import { ChooseTypeShipStart, getItemCartStart } from '../../action/ShopCartAction'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ShopCartPage.scss';

function ShopCartPage(props) {
    const dispatch = useDispatch()
    const history = useHistory()

    let dataCart = useSelector(state => state.shopcart.listCartItem)
    let dataTypeShip = useSelector(state => state.shopcart.dataTypeShip)
    let dataVoucher = useSelector(state => state.shopcart.dataVoucher)

    const [isOpenModal, setisOpenModal] = useState(false)
    const [isOpenModalAddressUser, setisOpenModalAddressUser] = useState(false)
    const [user, setuser] = useState()
    const [typeShip, settypeShip] = useState([])
    const [priceShip, setpriceShip] = useState(0)

    let price = 0;

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setuser(userData)
        if (userData) {
            dispatch(getItemCartStart(userData.id))
        } else {
            toast.error("Hãy đăng nhập để mua hàng")
            return;
        }
        fetchTypeShip()
        if (dataTypeShip && dataTypeShip.price) {
            setpriceShip(dataTypeShip.price)
        }
    }, [])

    const fetchTypeShip = async () => {
        let res = await getAllTypeShip({
            limit: '',
            offset: '',
            keyword: ''
        })
        if (res && res.errCode === 0) {
            settypeShip(res.data)
        }
    }

    const closeModal = () => {
        setisOpenModal(false)
    }

    const closeModaAddressUser = () => {
        setisOpenModalAddressUser(false)
    }

    const handleOpenModal = () => {
        setisOpenModal(true)
    }

    const handleOpenAddressUserModal = async () => {
        if (dataCart.length === 0) return
        if (user && user.id) {
            let res = await getAllAddressUserByUserIdService(user.id)
            if (res && res.errCode === 0 && res.data.length > 0) {
                history.push(`/order/${user.id}`);
            } else {
                setisOpenModalAddressUser(true)
            }
        } else {
            toast.error("Hãy đăng nhập để mua hàng")
        }
    }

    const totalPriceDiscount = (price, discount) => {
        if (discount.voucherData.typeVoucherOfVoucherData.typeVoucher === "percent") {
            if (((price * discount.voucherData.typeVoucherOfVoucherData.value) / 100) > discount.voucherData.typeVoucherOfVoucherData.maxValue) {
                return price - discount.voucherData.typeVoucherOfVoucherData.maxValue
            } else {
                return price - ((price * discount.voucherData.typeVoucherOfVoucherData.value) / 100)
            }
        } else {
            return price - discount.voucherData.typeVoucherOfVoucherData.maxValue
        }
    }

    const sendDataFromModalAddress = async (data) => {
        setisOpenModalAddressUser(false)
        let res = await createNewAddressUserrService({
            shipName: data.shipName,
            shipAdress: data.shipAdress,
            shipEmail: data.shipEmail,
            shipPhonenumber: data.shipPhonenumber,
            userId: user.id
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm địa chỉ thành công !")
            history.push(`/order/${user.id}`);
        } else {
            toast.error(res.errMessage)
        }
    }

    const closeModalFromVoucherItem = () => {
        setisOpenModal(false)
    }

    const hanldeOnChangeTypeShip = (item) => {
        setpriceShip(item.price)
        dispatch(ChooseTypeShipStart(item))
    }

    return (
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
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataCart && dataCart.length > 0 ?
                                        dataCart.map((item, index) => {
                                            price += item.quantity * item.productDetail.discountPrice
                                            let name = `${item.productData.name} - ${item.productDetail.nameDetail} - ${item.productdetailsizeData.sizeData.value}`
                                            return (
                                                <ShopCartItem isOrder={false} productId={item.productData.id} id={item.id} userId={user && user.id} productdetailsizeId={item.productdetailsizeData.id} key={index} name={name} price={item.productDetail.discountPrice} quantity={item.quantity} image={item.productDetailImage[0].image} />
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colspan={5}>
                                                <h4 className='text-center text-red'>Không có sản phẩm nào.</h4>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    dataCart && dataCart.length !== 0 &&
                    <>
                        <div className="box-shipping">
                            <h6>
                                Chọn đơn vị vận chuyển
                            </h6>
                            <div>
                                {typeShip && typeShip.length > 0 &&
                                    typeShip.map((item, index) => {
                                        return (
                                            <div key={index} className="form-check">
                                                <input className="form-check-input" checked={item.id === dataTypeShip.id ? true : false} type="radio" name="exampleRadios" id={item.type} onChange={() => hanldeOnChangeTypeShip(item)} />
                                                <label className="form-check-label" for={item.type}>
                                                    {item.type} - {CommonUtils.formatter.format(item.price)}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="box-shopcart-bottom">
                            <div className="content-left">
                                <div className="wrap-voucher">
                                    <img width="20px" height="20px" style={{ marginLeft: "-3px" }} src={storeVoucherLogo}></img>
                                    <span className="name-easier">Jolido voucher</span>
                                    <span onClick={() => handleOpenModal()} className="choose-voucher">Chọn Hoặc Nhập Mã</span>
                                    {dataVoucher && dataVoucher.voucherData &&
                                        <span className="choose-voucher">Mã voucher: {dataVoucher.voucherData.codeVoucher + `(-${CommonUtils.formatter.format(price - totalPriceDiscount(price, dataVoucher))})`}</span>
                                    }
                                </div>
                            </div>
                            <div className="content-right">
                                <div className="wrap-price">
                                    <span className="text-total">Tổng thanh toán ({dataCart && dataCart.length} sản phẩm): </span>
                                    <span className="text-price">
                                        {dataVoucher && dataVoucher.voucherData ? CommonUtils.formatter.format(totalPriceDiscount(price, dataVoucher) + priceShip) : CommonUtils.formatter.format(price + (+priceShip))}
                                    </span>
                                </div>
                                <div className="checkout_btn_inner">
                                    <p onClick={() => handleOpenAddressUserModal()} className="main_btn" >Đi đến thanh toán</p>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            <VoucherModal closeModalFromVoucherItem={closeModalFromVoucherItem} price={price + (+priceShip)} isOpenModal={isOpenModal}
                closeModal={closeModal} id={user && user.id} />
            <AddressUsersModal sendDataFromModalAddress={sendDataFromModalAddress} isOpenModal={isOpenModalAddressUser} closeModaAddressUser={closeModaAddressUser} />
        </section>
    );
}

export default ShopCartPage;