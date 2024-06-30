import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { createNewTypeShipService, getDetailTypeShipByIdService, updateTypeShipService } from '../../../services/userService';
import { toast } from 'react-toastify';

const AddTypeShipModal = props => {
    const [inputValues, setInputValues] = useState({ type: '', price: '' });
    const [typeShipId, setTypeShipId] = useState(null)

    useEffect(() => {
        setTypeShipId(props.id)
    })

    useEffect(() => {
        if (typeShipId) {
            fetchDetailTypeShip(typeShipId)
        } else {
            setInputValues({
                ["type"]: '',
                ["price"]: ''
            })
        }
    }, [typeShipId])

    let fetchDetailTypeShip = async (id) => {
        let typeship = await getDetailTypeShipByIdService(id)
        if (typeship && typeship.errCode === 0) {
            setInputValues({ ...inputValues, ["type"]: typeship.data.type, ["price"]: typeship.data.price })
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleAddTypeShip = async () => {
        let res = await createNewTypeShipService({
            type: inputValues.type,
            price: inputValues.price,
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm loại ship thành công")
            setInputValues({
                ["type"]: '',
                ["price"]: ''
            })
            props.fetchData()
            props.handleCloseAddTypeShipModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm loại ship thất bại")
    }

    const handleUpdateTypeShip = async () => {
        let res = await updateTypeShipService({
            type: inputValues.type,
            price: inputValues.price,
            id: typeShipId
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật loại ship thành công")
            props.fetchData()
            props.handleCloseAddTypeShipModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Cập nhật loại ship thất bại")
    }

    return (
        <Modal isOpen={props.isOpenAddTypeShipModal} size={'sm'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    {
                        typeShipId ? 'Cập nhật loại giao hàng' : 'Thêm loại giao hàng'
                    }
                </h4>
                <button onClick={props.handleCloseAddTypeShipModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="">
                    <div className="form-group">
                        <label htmlFor="type">Tên loại ship</label>
                        <input type="text" value={inputValues.type} name="type" onChange={(event) => handleOnChange(event)} className="form-control" id="type" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Giá tiền</label>
                        <input type="number" value={inputValues.price} name="price" onChange={(event) => handleOnChange(event)} className="form-control" id="price" />
                    </div>
                </div>
                {
                    typeShipId ?
                        <button type="button" onClick={() => handleUpdateTypeShip()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => handleAddTypeShip()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddTypeShipModal