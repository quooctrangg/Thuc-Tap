import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { createNewSupplierService, getDetailSupplierByIdService, updateSupplierService } from '../../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddSupplierModal = props => {
    const [inputValues, setInputValues] = useState({
        name: '', address: '', phonenumber: '', email: ''
    });
    const [supplierId, setSupplierId] = useState(null)

    useEffect(() => {
        setSupplierId(props.id)
    })

    useEffect(() => {
        if (supplierId) {
            fetchDetailSupplier(supplierId)
        } else {
            setInputValues({
                ["name"]: '',
                ["address"]: '',
                ["email"]: '',
                ["phonenumber"]: ''
            })
        }
    }, [supplierId])

    let fetchDetailSupplier = async (id) => {
        let supplier = await getDetailSupplierByIdService(id)
        if (supplier && supplier.errCode === 0) {
            setInputValues({
                ...inputValues,
                ["name"]: supplier.data.name,
                ["address"]: supplier.data.address,
                ["phonenumber"]: supplier.data.phonenumber,
                ["email"]: supplier.data.email
            })
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleAddSupplier = async () => {
        let res = await createNewSupplierService({
            name: inputValues.name,
            address: inputValues.address,
            email: inputValues.email,
            phonenumber: inputValues.phonenumber,
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm nhà cung cấp thành công")
            setInputValues({
                ...inputValues,
                ["name"]: '',
                ["address"]: '',
                ["email"]: '',
                ["phonenumber"]: ''
            })
            props.fetchData()
            props.handleCloseAddSupplierModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm nhà cung cấp thất bại")
    }

    const handleUpdateSupplier = async () => {
        let res = await updateSupplierService({
            name: inputValues.name,
            address: inputValues.address,
            email: inputValues.email,
            phonenumber: inputValues.phonenumber,
            id: supplierId
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật nhà cung cấp thành công")
            props.fetchData()
            props.handleCloseAddSupplierModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Cập nhật nhà cung cấp thất bại")
    }

    return (
        <Modal isOpen={props.isOpenAddSupplierModal} size={'sm'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    {
                        supplierId ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp'
                    }
                </h4>
                <button onClick={props.handleCloseAddSupplierModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="inputEmail4">Tên nhà cung cấp</label>
                        <input type="text" value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword4">Địa chỉ email</label>
                        <input type="text" value={inputValues.email} name="email" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputEmail4">Địa chỉ</label>
                        <input type="text" value={inputValues.address} name="address" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword4">Số điện thoại</label>
                        <input type="text" value={inputValues.phonenumber} name="phonenumber" onChange={(event) => handleOnChange(event)} className="form-control" id="inputPassword4" />
                    </div>
                </div>
                {
                    supplierId ?
                        <button type="button" onClick={() => handleUpdateSupplier()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => handleAddSupplier()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddSupplierModal