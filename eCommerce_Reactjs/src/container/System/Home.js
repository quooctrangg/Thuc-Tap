import React from 'react';
import moment from 'moment'
import DatePicker from "react-datepicker";
import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { getCountCardStatistic, getCountStatusOrder, getStatisticByMonth, getStatisticByDay } from '../../services/userService'
import { Link } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

let getOptions = (title) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
            },
        },
    }
}

const Home = () => {
    const [CountCard, setCountCard] = useState({})
    const [CountStatusOrder, setCountStatusOrder] = useState({})
    const [StatisticOrderByMonth, setStatisticOrderByMonth] = useState({})
    const [StatisticOrderByDay, setStatisticOrderByDay] = useState({})
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [DateTime, setDateTime] = useState(new Date());
    const [type, settype] = useState('month')
    const [month, setmonth] = useState(new Date());
    const [year, setyear] = useState(new Date());

    useEffect(() => {
        loadCountCard()
        loadStatusOrder()
        loadStatisticOrderByMonth(moment(year).format("YYYY"))
        loadStatisticOrderByDay(moment(year).format("YYYY"), moment(new Date()).format("M"))
    }, [])

    useEffect(() => {
        loadStatusOrder()
    }, [type, startDate, endDate, DateTime])

    const dataPie = {
        labels: CountStatusOrder.arrayLable,
        datasets: [
            {
                label: '# of Votes',
                data: CountStatusOrder.arrayValue,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const dataLine = {
        labels: StatisticOrderByMonth.arrayMonthLable,
        datasets: [
            {
                label: 'Doanh thu',
                data: StatisticOrderByMonth.arrayMonthValue,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    const dataBar = {
        labels: StatisticOrderByDay.arrayDayLable,
        datasets: [
            {
                label: 'Doanh thu',
                data: StatisticOrderByDay.arrayDayValue,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },

        ],
    };

    let loadCountCard = async () => {
        let res = await getCountCardStatistic()
        if (res && res.errCode == 0) {
            setCountCard(res.data)
        }
    }

    let loadStatusOrder = async () => {
        let res = await getCountStatusOrder({
            oneDate: type == 'day' ? moment(startDate).toISOString() : moment(DateTime).toISOString(),
            twoDate: moment(endDate).toISOString(),
            type: type
        })
        if (res && res.errCode == 0) {
            setCountStatusOrder(res.data)
        }
    }

    let loadStatisticOrderByMonth = async (year) => {
        let res = await getStatisticByMonth(year)
        if (res && res.errCode == 0) {
            setStatisticOrderByMonth(res.data)
        }
    }

    let loadStatisticOrderByDay = async (year, month) => {
        let res = await getStatisticByDay({ year, month })
        if (res && res.errCode == 0) {
            setStatisticOrderByDay(res.data)
        }
    }

    let handleOnChangeYear = (year) => {
        setyear(year)
        loadStatisticOrderByMonth(moment(year).format("YYYY"))
    }

    let handleOnChangeDatePickerFromDate = (date) => {
        setmonth(date)
        loadStatisticOrderByDay(moment(date).format("YYYY"), moment(date).format("M"))
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">TRANG CHỦ</h1>
            <div className="row">
                <div className="col-xl-4 col-md-6">
                    <div className="card bg-primary text-white mb-4">
                        <div className="card-body">TỔNG SỐ ĐƠN HÀNG ({CountCard.countOrder})</div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to={'/admin/list-order'}>Chi tiết</Link>
                            <div className="small text-white"><i className="fas fa-angle-right" /></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-6">
                    <div className="card bg-success text-white mb-4">
                        <div className="card-body">SẢN PHẨM ({CountCard.countProduct})</div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to={'/admin/list-product'}>Chi tiết</Link>
                            <div className="small text-white"><i className="fas fa-angle-right" /></div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-md-6">
                    <div className="card bg-danger text-white mb-4">
                        <div className="card-body">THÀNH VIÊN ({CountCard.countUser})</div>
                        <div className="card-footer d-flex align-items-center justify-content-between">
                            <Link className="small text-white stretched-link" to={'/admin/list-user'}>Chi tiết</Link>
                            <div className="small text-white"><i className="fas fa-angle-right" /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-8">
                    <label>Chọn năm</label>
                    <DatePicker
                        selected={year}
                        onChange={(date) => handleOnChangeYear(date)}
                        dateFormat="yyyy"
                        showYearPicker
                        className='form-control col-md-2'
                    />
                    <Line options={getOptions('Biểu đồ doanh thu theo từng tháng trong năm')} data={dataLine} />
                </div>
                <div className="col-md-4">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <label htmlFor="inputZip">Loại thống kê</label>
                                <select value={type} name="type" onChange={(event) => settype(event.target.value)} id="inputState" className="form-control">
                                    <option value="day">Ngày</option>
                                    <option value="month">Tháng</option>
                                    <option value="year">Năm</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
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
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                        isClearable={true}
                                    />
                                </div>
                            }
                            {
                                type == "month" &&
                                <div className="form-group col-md-8">
                                    <label htmlFor="inputCity">Chọn tháng</label>
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
                                <div className="form-group col-md-8">
                                    <label htmlFor="inputCity">Chọn năm</label>
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
                    <Pie data={dataPie} options={getOptions('Thống kê trạng thái đơn hàng')} />;
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-11'>
                    <label>Chọn tháng</label>
                    <DatePicker
                        selected={month}
                        onChange={(date) => handleOnChangeDatePickerFromDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className='form-control col-md-2'
                    />
                    <Bar options={getOptions('Biểu đồ doanh thu theo từng ngày trong tháng')} data={dataBar} />
                </div>
            </div>
        </div>
    )
}

export default Home;