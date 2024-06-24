import React from 'react';
import { useState, useEffect } from 'react';
import { getStatisticOverturn } from '../../../services/userService';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import CommonUtils from '../../../utils/CommonUtils';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const Turnover = (props) => {
    const [dataOrder, setdataOrder] = useState([])
    const [dataExport, setdataExport] = useState([])
    const [totalPrice, settotalPrice] = useState(0)
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
        let res = await getStatisticOverturn({
            oneDate: type == 'day' ? moment(startDate).toISOString() : moment(DateTime).toISOString(),
            twoDate: moment(endDate).toISOString(),
            type: type
        })
        if (res && res.errCode == 0) {
            let total = 0;
            for (let i = 0; i < res.data.length; i++) {
                total = total + res.data[i].totalpriceProduct
            }
            settotalPrice(total)
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
                })
            });
            setdataExport(arrayObject)
        }
    }

    let handleOnClickExport = async () => {
        await CommonUtils.exportExcel(dataExport, "Thống kê doanh thu", "TurnOver")
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Thống kê</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Thống kê doanh thu
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
                            {type == "day" &&
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
                            {type == "month" &&
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
                            {type == "year" &&
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
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Ngày đặt</th>
                                    <th>Ngày nhận hàng</th>
                                    <th>Loại ship</th>
                                    <th>Hình thức</th>
                                    <th>Số lượng sản phẩm</th>
                                    <th>Tổng tiền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataOrder && dataOrder.length > 0 ?
                                    dataOrder.map((item, index) => {
                                        let totalProduct = 0
                                        item.orderDetail.forEach(e => {
                                            totalProduct += e.quantity
                                        })
                                        return (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{moment.utc(item.createdAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{moment.utc(item.updatedAt).local().format('DD/MM/YYYY HH:mm:ss')}</td>
                                                <td>{item.typeShipData.type}</td>
                                                <td>{item.isPaymentOnlien == 0 ? 'Thanh toán tiền mặt' : 'Thanh toán online'}</td>
                                                <td>{totalProduct}</td>
                                                <td>{CommonUtils.formatter.format(item.totalpriceProduct)}</td>
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
                                        <td colSpan={9} className='text-center text-red'>
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <span style={{ fontSize: '26px' }} className="text-total">Tổng doanh thu:  </span>
                    <span style={{ color: '#71cd14', fontSize: '26px' }} className="text-price">{CommonUtils.formatter.format(totalPrice)}</span>
                </div>
            </div>
        </div>
    )
}

export default Turnover;