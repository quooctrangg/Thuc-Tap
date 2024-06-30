import React from 'react';
import VoucherItemSmall from './VoucherItemSmall';
import moment from 'moment';
import CommonUtils from '../../utils/CommonUtils';
import { useState, useEffect } from 'react'
import { getAllVoucherByUserIdService } from '../../services/userService';
import './StoreVoucher.scss';

function StoreVoucher(props) {
    const [dataVoucher, setdataVoucher] = useState([])
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        setUserId(props.id)
    })

    useEffect(() => {
        if (userId) {
            fetchData(userId)
        }
    }, [userId])

    const fetchData = async (id) => {
        let arrData = await getAllVoucherByUserIdService({
            limit: '',
            offset: '',
            id: id
        })
        let arrTemp = []
        if (arrData && arrData.errCode === 0) {
            let nowDate = moment.unix(Date.now() / 1000).format('DD/MM/YYYY')
            for (let i = 0; i < arrData.data.length; i++) {
                let fromDate = moment.unix(arrData.data[i].voucherData.fromDate / 1000).format('DD/MM/YYYY')
                let toDate = moment.unix(arrData.data[i].voucherData.toDate / 1000).format('DD/MM/YYYY')
                let amount = arrData.data[i].voucherData.amount
                let usedAmount = arrData.data[i].voucherData.usedAmount
                if (amount !== usedAmount && compareDates(toDate, nowDate) === false && compareDates(fromDate, nowDate) === true) {
                    arrTemp[i] = arrData.data[i]
                }
            }
            setdataVoucher(arrTemp)
        }
    }

    const compareDates = (d1, d2) => {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]);
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);
        if (d1 <= d2) return true
        if (d1 >= d2) return false
    }

    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-12 border-right border-left">
                    <div className="box-heading">
                        <div className="content-left">
                            <span>Ví voucher</span>
                        </div>
                    </div>
                    <div className="container-voucher">
                        {
                            dataVoucher && dataVoucher.length > 0 &&
                            dataVoucher.map((item, index) => {
                                let percent = ""
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "percent") {
                                    percent = item.voucherData.typeVoucherOfVoucherData.value + "%"
                                }
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "money") {
                                    percent = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.value)
                                }
                                let MaxValue = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.maxValue)
                                return (
                                    <VoucherItemSmall id={item.id} key={index} name={item.voucherData.codeVoucher} widthPercent={item.voucherData.usedAmount * 100 / item.voucherData.amount} maxValue={MaxValue} usedAmount={Math.round((item.voucherData.usedAmount * 100 / item.voucherData.amount) * 10) / 10} typeVoucher={percent} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreVoucher;

