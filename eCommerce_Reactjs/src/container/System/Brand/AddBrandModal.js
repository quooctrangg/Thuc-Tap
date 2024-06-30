import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { UpdateAllcodeService, createAllCodeService, getDetailAllcodeById } from '../../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBrandModal = props => {
    const [inputValues, setInputValues] = useState({ value: '', code: '' });
    const [barndId, setBrandId] = useState(null)

    useEffect(() => {
        setBrandId(props.id)
    })

    useEffect(() => {
        if (barndId) {
            fetchDetailCategory(barndId)
        } else {
            setInputValues({
                ["value"]: '',
                ["code"]: ''
            })
        }
    }, [barndId])

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const fetchDetailCategory = async (id) => {
        let allcode = await getDetailAllcodeById(id)
        if (allcode && allcode.errCode === 0) {
            setInputValues({ ...inputValues, ["value"]: allcode.data.value, ["code"]: allcode.data.code })
        }
    }

    const handleAddBrand = async () => {
        let res = await createAllCodeService({
            value: inputValues.value,
            code: inputValues.code,
            type: 'BRAND'
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm nhãn hàng thành công")
            setInputValues({
                ["value"]: '',
                ["code"]: ''
            })
            props.handleCloseAddBrandModal()
            props.fetchData()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm nhãn hàng thất bại")
    }

    const handleUpdateBrand = async () => {
        let res = await UpdateAllcodeService({
            value: inputValues.value,
            code: inputValues.code,
            id: barndId
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật nhãn hàng thành công")
            props.handleCloseAddBrandModal()
            props.fetchData()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Cập nhật nhãn hàng thất bại")
    }

    return (
        <Modal isOpen={props.isOpenAddBrandModal} size={'sm'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    {
                        barndId ? 'Cập nhật nhãn hàng' : 'Thêm nhãn hàng'
                    }
                </h4>
                <button onClick={props.handleCloseAddBrandModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="">
                    <div className="form-group">
                        <label htmlFor="value">Tên nhãn hàng</label>
                        <input type="text" value={inputValues.value} name="value" onChange={(event) => handleOnChange(event)} className="form-control" id="value" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="code">Mã code</label>
                        <input type="text" value={inputValues.code} name="code" onChange={(event) => handleOnChange(event)} className="form-control" id="code" />
                    </div>
                </div>
                {
                    barndId ?
                        <button type="button" onClick={() => handleUpdateBrand()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => handleAddBrand()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddBrandModal