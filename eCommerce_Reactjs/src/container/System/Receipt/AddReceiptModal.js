import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createNewReceiptService, getAllSupplier } from '../../../services/userService';

const AddReceiptModal = props => {
    const [user, setUser] = useState({})
    const [dataSupplier, setdataSupplier] = useState([])
    const [inputValues, setInputValues] = useState({
        supplierId: '', billNumber: ''
    });
    if (dataSupplier.length && inputValues.supplierId == '') {
        setInputValues({ ...inputValues, ["supplierId"]: dataSupplier[0].id, })
    }

    useEffect(() => {
        loadDataSupplier()
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
    }, [])

    let loadDataSupplier = async () => {
        let arrData = await getAllSupplier({
            limit: '',
            offset: '',
            keyword: ''
        })
        if (arrData && arrData.errCode === 0) {
            setdataSupplier(arrData.data)
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let handleSaveReceipt = async () => {
        let res = await createNewReceiptService({
            supplierId: inputValues.supplierId,
            userId: user.id,
            billNumber: inputValues.billNumber
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm hóa đơn thành công")
            setInputValues({
                ...inputValues,
                ["billNumber"]: ''
            })
            props.handleCloseReceiptModal()
            props.fetchData()
        }
        else if (res && res.errCode !== 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm hóa đơn thất bại")
    }

    return (
        <Modal isOpen={props.isOpenModalReceipt} >
            <div className="modal-header">
                <h4 className="modal-title">
                    Thêm hóa đơn
                </h4>
                <button onClick={props.handleCloseReceiptModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className='card mb-4'>
                    <div className='card-body'>
                        <div className="mb-2">
                            <label htmlFor='lotNumber'>Số hóa đơn</label>
                            <input value={inputValues.billNumber} name='billNumber' onChange={(event) => handleOnChange(event)} className="form-control" id='lotNumber'></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="inputState">Nhà cung cấp</label>
                            <select value={inputValues.supplierId} name="supplierId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                {dataSupplier && dataSupplier.length > 0 &&
                                    dataSupplier.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <button type="button" onClick={() => handleSaveReceipt()} className="w-100 btn btn-primary">Thêm</button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default AddReceiptModal;