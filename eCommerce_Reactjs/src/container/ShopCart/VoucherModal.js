import React from 'react';
import { useEffect, useState } from 'react';
import { getAllVoucherByUserIdService } from '../../services/userService';
import { Modal, ModalFooter, ModalBody, Button } from 'reactstrap';
import moment from 'moment';
import CommonUtils from '../../utils/CommonUtils';
import VoucherItemSmall from '../User/VoucherItemSmall';
import '../User/StoreVoucher.scss';

const VoucherModal = (props) => {
    const [dataVoucher, setdataVoucher] = useState([])
    const [userId, setUserId] = useState(null)

    function compareDates(d1, d2) {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]);
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);
        if (d1 <= d2) return true
        if (d1 >= d2) return false
    }

    useEffect(() => {
        setUserId(props.id)
    })

    useEffect(() => {
        if (userId) {
            fetchData(userId)
        }
    }, [userId])

    let fetchData = async (id) => {
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
                let minValue = arrData.data[i].voucherData.typeVoucherOfVoucherData.minValue
                if (amount > usedAmount && compareDates(toDate, nowDate) === false && compareDates(fromDate, nowDate) === true && minValue <= props.price) {
                    arrTemp[i] = arrData.data[i]
                }
            }
            setdataVoucher(arrTemp)
        }
    }

    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'} size="md" centered>
                <div className="modal-header">
                    <h5 className="modal-title">Chọn Jolido Voucher</h5>
                    <button onClick={props.closeModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }} className="container-voucher">
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
                                    <VoucherItemSmall closeModalFromVoucherItem={props.closeModalFromVoucherItem} data={item} id={item.id} key={index} name={item.voucherData.codeVoucher} maxValue={MaxValue} usedAmount={Math.round((item.voucherData.usedAmount * 100 / item.voucherData.amount) * 10) / 10} typeVoucher={percent} />
                                )
                            })
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    {' '}
                    <Button onClick={props.closeModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </div >
    )
}

export default VoucherModal;