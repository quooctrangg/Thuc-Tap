import React from 'react';
import moment from 'moment';
import DatePicker from "react-datepicker";
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { createNewVoucherService, getDetailVoucherByIdService, getSelectTypeVoucher, updateVoucherService } from '../../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddVoucherModal = props => {
    const [voucherId, setVoucherId] = useState(null)
    const [dataTypeVoucher, setdataTypeVoucher] = useState([])
    const [inputValues, setInputValues] = useState({ fromDate: '', toDate: '', typeVoucherId: '', amount: '', codeVoucher: '' });

    if (dataTypeVoucher && dataTypeVoucher.length > 0 && inputValues.typeVoucherId === '') {
        setInputValues({ ...inputValues, ["typeVoucherId"]: dataTypeVoucher[0].id })
    }

    useEffect(() => {
        setVoucherId(props.id)
    })

    useEffect(() => {
        fetchTypeVoucher()
    }, [])

    useEffect(() => {
        if (voucherId) {
            fetchVoucher(voucherId)
        } else {
            setInputValues({
                ...inputValues,
                ["fromDate"]: '',
                ["toDate"]: '',
                ["typeVoucherId"]: '',
                ["amount"]: '',
                ["codeVoucher"]: '',
            })
        }
    }, [voucherId])

    let fetchTypeVoucher = async () => {
        let typevoucher = await getSelectTypeVoucher()
        if (typevoucher && typevoucher.errCode === 0) {
            setdataTypeVoucher(typevoucher.data)
        }
    }

    let fetchVoucher = async (id) => {
        let voucher = await getDetailVoucherByIdService(id)
        if (voucher && voucher.errCode === 0) {
            setStateVoucher(voucher.data)
        }
    }

    let setStateVoucher = (data) => {
        setInputValues({
            ...inputValues,
            ["fromDate"]: new Date(moment.unix(+data.fromDate / 1000).locale('vi').format('MM/DD/YYYY')),
            ["toDate"]: new Date(moment.unix(+data.toDate / 1000).locale('vi').format('MM/DD/YYYY')),
            ["typeVoucherId"]: data.typeVoucherId,
            ["amount"]: data.amount,
            ["codeVoucher"]: data.codeVoucher,
        })
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleAddVoucher = async () => {
        let response = await createNewVoucherService({
            fromDate: new Date(inputValues.fromDate).getTime(),
            toDate: new Date(inputValues.toDate).getTime(),
            typeVoucherId: inputValues.typeVoucherId,
            amount: inputValues.amount,
            codeVoucher: inputValues.codeVoucher
        })
        if (response && response.errCode === 0) {
            toast.success("Tạo mã khuyến thành công !")
            setInputValues({
                ...inputValues,
                ["fromDate"]: '',
                ["toDate"]: '',
                ["typeVoucherId"]: '',
                ["amount"]: '',
                ["codeVoucher"]: '',
            })
            props.fetchVoucherData()
            props.hanldeCloseAddVoucherModal()
        } else {
            toast.error(response.errMessage)
        }
    }

    const handleUpdateVoucher = async () => {
        let response = await updateVoucherService({
            toDate: new Date(inputValues.toDate).getTime(),
            fromDate: new Date(inputValues.fromDate).getTime(),
            typeVoucherId: inputValues.typeVoucherId,
            amount: inputValues.amount,
            codeVoucher: inputValues.codeVoucher,
            id: voucherId
        })
        if (response && response.errCode === 0) {
            toast.success("Cập nhật khuyến thành công !")
            props.fetchVoucherData()
            props.hanldeCloseAddVoucherModal()
        } else toast.error(response.errMessage)
    }

    return (
        <Modal isOpen={props.isOpenAddVoucherModal} size={'xl'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    {
                        voucherId ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'
                    }
                </h4>
                <button onClick={props.hanldeCloseAddVoucherModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="fromDate">Ngày bắt đầu</label>
                        <DatePicker
                            id='fromDate'
                            selected={inputValues.fromDate}
                            onChange={(update) => {
                                setInputValues({
                                    ...inputValues,
                                    ["fromDate"]: update
                                })
                            }}
                            className="form-control"
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="toDate">Ngày kết thúc</label>
                        <DatePicker
                            id='toDate'
                            selected={inputValues.toDate}
                            onChange={(update) => {
                                setInputValues({
                                    ...inputValues,
                                    ["toDate"]: update
                                })
                            }}
                            className="form-control"
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="typeVoucherId">Loại voucher</label>
                        <select value={inputValues.typeVoucherId} name="typeVoucherId" onChange={(event) => handleOnChange(event)} id="typeVoucherId" className="form-control">
                            {
                                dataTypeVoucher && dataTypeVoucher.length > 0 &&
                                dataTypeVoucher.map((item, index) => {
                                    let name = `${item.value} ${item.typeVoucherData.value}`
                                    return (
                                        <option key={index} value={item.id}>{name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="amount">Số lượng mã</label>
                        <input type="number" value={inputValues.amount} name="amount" onChange={(event) => handleOnChange(event)} className="form-control" id="amount" />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="codeVoucher">Mã voucher</label>
                        <input type="text" value={inputValues.codeVoucher} name="codeVoucher" onChange={(event) => handleOnChange(event)} className="form-control" id="codeVoucher" />
                    </div>
                </div>
                {
                    voucherId ?
                        <button type="button" onClick={() => handleUpdateVoucher()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => handleAddVoucher()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddVoucherModal