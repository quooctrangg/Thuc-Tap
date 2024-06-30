import React from 'react';
import { useState, useEffect } from 'react';
import { getStatisticProfit } from '../../../services/userService';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import CommonUtils from '../../../utils/CommonUtils';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const Profit = (props) => {
    const [dataOrder, setdataOrder] = useState([])
    const [dataExport, setdataExport] = useState([])
    const [sumPrice, setsumPrice] = useState(0)
    const [type, settype] = useState('month')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [DateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        handleOnclick()
    }, [])

    useEffect(() => {
        handleOnclick()
    }, [type, DateTime, startDate, endDate])

    let handleOnclick = async () => {
        let res = await getStatisticProfit({
            oneDate: type == 'day' ? moment(startDate).toISOString() : moment(DateTime).toISOString(),
            twoDate: moment(endDate).toISOString(),
            type: type
        })
        let sumPrice = 0;
        if (res && res.errCode == 0) {
            setdataOrder(res.data)
            let arrayObject = []
            res.data.forEach(item => {
                arrayObject.push({
                    id: item.id,
                    createdAt: moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss'),
                    updatedAt: moment.utc(item.updatedAt).local().format('DD/MM/YYYY HH:mm:ss'),
                    typeShip: item.typeShipData.type,
                    codeVoucher: item.voucherData.codeVoucher,
                    paymentType: item.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online',
                    statusOrder: item.statusOrderData.value,
                    totalpriceProduct: item.totalpriceProduct,
                    importPrice: item.importPrice,
                    profitPrice: item.profitPrice,
                })
                sumPrice = sumPrice + item.profitPrice
            });
            setdataExport(arrayObject)
            setsumPrice(sumPrice)
        }
    }

    let handleOnClickExport = async () => {
        await CommonUtils.exportExcel(dataExport, "Thống kê lợi nhuận", "Profit")
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Thống kê</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thống kê lợi nhuận
                </div>
                <div className="card-body">
                    <form>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <label htmlFor="type" >Thống kê theo</label>
                            <select value={type} name="type" onChange={(event) => settype(event.target.value)} id="type" style={{ width: 'auto' }} className="form-control">
                                <option value="day">Ngày</option>
                                <option value="month">Tháng</option>
                                <option value="year">Năm</option>
                            </select>
                            {
                                type == "day" &&
                                <div style={{ display: 'flex', gap: 5, alignItems: 'center', width: 'auto' }}>
                                    <label htmlFor="startDate">Từ</label>
                                    <DatePicker
                                        id='startDate'
                                        selected={startDate}
                                        onChange={(update) => {
                                            setStartDate(update);
                                        }}
                                        className="form-control"
                                        isClearable={true}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                    <label htmlFor="endDate">đến</label>
                                    <DatePicker
                                        id='endDate'
                                        selected={endDate}
                                        onChange={(update) => {
                                            setEndDate(update);
                                        }}
                                        className="form-control"
                                        isClearable={true}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                            }
                            {
                                type == "month" &&
                                <div style={{ with: 'auto' }}>
                                    <DatePicker
                                        selected={DateTime}
                                        onChange={(date) => setDateTime(date)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        className='form-control'
                                    />
                                </div>
                            }
                            {
                                type == "year" &&
                                <div style={{ with: 'auto' }}>
                                    <DatePicker
                                        selected={DateTime}
                                        onChange={(date) => setDateTime(date)}
                                        dateFormat="yyyy"
                                        showYearPicker
                                        className='form-control'
                                    />
                                </div>
                            }
                        </div>
                    </form>
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
                                    <th>Mã đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Ngày nhận hàng</th>
                                    <th>Hình thức</th>
                                    <th>Tổng tiền</th>
                                    <th>Vận chuyển</th>
                                    <th>Giảm giá</th>
                                    <th>Tiền nhập hàng</th>
                                    <th>Lợi nhuận</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataOrder && dataOrder.length > 0 ?
                                        dataOrder.map((item, index) => {
                                            let totalPriceProduct = 0
                                            item.orderDetail.forEach(e => {
                                                totalPriceProduct += e.realPrice
                                            })
                                            totalPriceProduct -= item.totalpriceProduct
                                            return (
                                                <tr key={index}>
                                                    <td>{item.id}</td>
                                                    <td>{moment.utc(item.createdAt).local().format('DD/MM/YYYY')}</td>
                                                    <td>{moment.utc(item.updatedAt).local().format('DD/MM/YYYY')}</td>
                                                    <td>{item.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online'}</td>
                                                    <td>{CommonUtils.formatter.format(item.totalpriceProduct + item.typeShipData.price)}</td>
                                                    <td className='text-red'>+{CommonUtils.formatter.format(item.typeShipData.price)}</td>
                                                    <td>
                                                        {
                                                            item.voucherData.codeVoucher &&
                                                            <div>
                                                                <p className='text-red'>-{CommonUtils.formatter.format(totalPriceProduct)}</p>
                                                                <p>({item.voucherData.codeVoucher})</p>
                                                            </div>
                                                        }
                                                    </td>
                                                    <td>{CommonUtils.formatter.format(item.importPrice)}</td>
                                                    <td>{CommonUtils.formatter.format(item.profitPrice)}</td>
                                                    <td>
                                                        <Link to={`/admin/order-detail/${item.id}`}>
                                                            <button className='btn btn-primary'>
                                                                Xem chi tiết
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan={11} className='text-center text-red'>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <span style={{ fontSize: '26px' }} className="text-total">Tổng lợi nhuận:  </span>
                    <span style={{ color: '#71cd14', fontSize: '26px' }} className="text-price">{CommonUtils.formatter.format(sumPrice)}</span>
                </div>
            </div>
        </div>
    )
}

export default Profit;