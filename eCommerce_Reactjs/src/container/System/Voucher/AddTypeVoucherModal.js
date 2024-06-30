import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { createNewTypeVoucherService, getDetailTypeVoucherByIdService, updateTypeVoucherService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useFetchAllcode } from '../../customize/fetch';
import 'react-toastify/dist/ReactToastify.css';

const AddTypeVoucherModal = props => {
    const { data: dataTypeVoucher } = useFetchAllcode('DISCOUNT')

    const [typeVoucherId, setTypeVoucherId] = useState(null)
    const [inputValues, setInputValues] = useState({ typeVoucher: '', value: '', maxValue: '', minValue: '' });

    if (dataTypeVoucher && dataTypeVoucher.length > 0 && inputValues.typeVoucher === '') {
        setInputValues({ ...inputValues, ["typeVoucher"]: dataTypeVoucher[0].code })
    }

    useEffect(() => {
        setTypeVoucherId(props.id)
    })

    useEffect(() => {
        if (typeVoucherId) {
            fetchDetailTypeVoucher(typeVoucherId)
        } else {
            setInputValues({
                ...inputValues,
                ["typeVoucher"]: '',
                ["value"]: '',
                ["maxValue"]: '',
                ["minValue"]: '',
            })
        }
    }, [typeVoucherId])

    let fetchDetailTypeVoucher = async (id) => {
        let typevoucher = await getDetailTypeVoucherByIdService(id)
        if (typevoucher && typevoucher.errCode === 0) {
            setInputValues({
                ...inputValues,
                ["typeVoucher"]: typevoucher.data.typeVoucher,
                ["value"]: typevoucher.data.value,
                ["maxValue"]: typevoucher.data.maxValue,
                ["minValue"]: typevoucher.data.minValue
            })
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleAddTypeVoucher = async () => {
        let res = await createNewTypeVoucherService({
            typeVoucher: inputValues.typeVoucher,
            value: inputValues.value,
            maxValue: inputValues.maxValue,
            minValue: inputValues.minValue
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm loại mã khuyến thành công")
            setInputValues({
                ...inputValues,
                ["typeVoucher"]: '',
                ["value"]: '',
                ["maxValue"]: '',
                ["minValue"]: '',
            })
            props.fetchTypeVoucherData()
            props.hanldeCloseAddTypeVoucherModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm loại mã khuyến thất bại")
    }

    const handleUpdateTypeVoucher = async () => {
        let res = await updateTypeVoucherService({
            typeVoucher: inputValues.typeVoucher,
            value: inputValues.value,
            maxValue: inputValues.maxValue,
            minValue: inputValues.minValue,
            id: typeVoucherId
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật loại mã khuyến thành công")
            props.fetchTypeVoucherData()
            props.hanldeCloseAddTypeVoucherModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Cập nhật loại mã khuyến thất bại")
    }

    return (
        <Modal isOpen={props.isOpenAddTypeVoucherModal} size={'xl'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    {
                        typeVoucherId ? 'Cập nhật loại khuyến mãi' : 'Thêm loại khuyến mãi'
                    }
                </h4>
                <button onClick={props.hanldeCloseAddTypeVoucherModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="typeVoucher">Loại voucher</label>
                        <select value={inputValues.typeVoucher} name="typeVoucher" onChange={(event) => handleOnChange(event)} id="typeVoucher" className="form-control">
                            {
                                dataTypeVoucher && dataTypeVoucher.length > 0 &&
                                dataTypeVoucher.map((item, index) => {
                                    return (
                                        <option key={index} value={item.code}>{item.value}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="value">Giá trị</label>
                        <input type="text" value={inputValues.value} name="value" onChange={(event) => handleOnChange(event)} className="form-control" id="value" />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="minValue">Giá trị tối thiểu</label>
                        <input type="number" value={inputValues.minValue} name="minValue" onChange={(event) => handleOnChange(event)} className="form-control" id="minValue" />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="maxValue">Giá trị tối đa</label>
                        <input type="number" value={inputValues.maxValue} name="maxValue" onChange={(event) => handleOnChange(event)} className="form-control" id="maxValue" />
                    </div>
                </div>
                {
                    typeVoucherId ?
                        <button type="button" onClick={() => handleUpdateTypeVoucher()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => handleAddTypeVoucher()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddTypeVoucherModal