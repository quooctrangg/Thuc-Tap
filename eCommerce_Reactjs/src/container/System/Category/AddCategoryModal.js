import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { UpdateAllcodeService, createAllCodeService, getDetailAllcodeById } from '../../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategoryModal = props => {
    const [inputValues, setInputValues] = useState({ value: '', code: '' });
    const [categoryId, setCategoryId] = useState(null)

    useEffect(() => {
        setCategoryId(props.id)
    })

    useEffect(() => {
        if (categoryId) {
            fetchDetailCategory(categoryId)
        } else {
            setInputValues({
                ["value"]: '',
                ["code"]: ''
            })
        }
    }, [categoryId])

    const fetchDetailCategory = async (id) => {
        let allcode = await getDetailAllcodeById(id)
        if (allcode && allcode.errCode === 0) {
            setInputValues({ ["value"]: allcode.data.value, ["code"]: allcode.data.code })
        }
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const hanldeAddCategory = async () => {
        let res = await createAllCodeService({
            value: inputValues.value,
            code: inputValues.code,
            type: 'CATEGORY'
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm danh mục thành công")
            setInputValues({
                ["value"]: '',
                ["code"]: ''
            })
            props.fetchData()
            props.handleCloseCategoryModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Thêm danh mục thất bại")
    }

    const handleUpdateCategory = async () => {
        let res = await UpdateAllcodeService({
            value: inputValues.value,
            code: inputValues.code,
            id: categoryId
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật danh mục thành công")
            props.fetchData()
            props.handleCloseCategoryModal()
        }
        else if (res && res.errCode === 2) {
            toast.error(res.errMessage)
        }
        else toast.error("Cập nhật danh mục thất bại")
    }

    return (
        <Modal isOpen={props.isOpenAddCategoryModal} size={'sm'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    {
                        categoryId ? 'Cập nhật danh mục' : 'Thêm danh mục'
                    }
                </h4>
                <button onClick={props.handleCloseCategoryModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="">
                    <div className="form-group">
                        <label htmlFor="value">Tên danh mục</label>
                        <input type="text" value={inputValues.value} name="value" onChange={(event) => handleOnChange(event)} className="form-control" id="value" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="code">Mã code</label>
                        <input type="text" value={inputValues.code} name="code" onChange={(event) => handleOnChange(event)} className="form-control" id="code" />
                    </div>
                </div>
                {
                    categoryId ?
                        <button type="button" onClick={() => handleUpdateCategory()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => hanldeAddCategory()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddCategoryModal