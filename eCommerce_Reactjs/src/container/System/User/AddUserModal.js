import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { UpdateUserService, createNewUser, getDetailUserById } from '../../../services/userService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchAllcode } from '../../customize/fetch';
import DatePicker from "react-datepicker";
import CommonUtils from '../../../utils/CommonUtils'

const AddUserModal = props => {
    const [inputValues, setInputValues] = useState({
        email: '', password: '', firstName: '', lastName: '', address: '', phonenumber: '', genderId: '', roleId: '', id: '', dob: new Date()
    });
    const { data: dataGender } = useFetchAllcode('GENDER');
    const [userId, setUserId] = useState(null)

    useEffect(async () => {
        setUserId(props.id)
    })

    useEffect(async () => {
        if (userId) {
            await fetchUser(userId)
        } else {
            setInputValues({
                ["firstName"]: '',
                ["lastName"]: '',
                ["address"]: '',
                ["phonenumber"]: '',
                ["genderId"]: 'M',
                ["roleId"]: '',
                ["email"]: '',
                ["id"]: '',
                ["dob"]: new Date()
            })
        }
    }, [userId])

    let fetchUser = async (userId) => {
        let user = await getDetailUserById(userId)
        if (user && user.errCode === 0) {
            setStateUser(user.data)
        }
    }

    let setStateUser = (data) => {
        setInputValues({
            ["firstName"]: data.firstName,
            ["lastName"]: data.lastName,
            ["address"]: data.address,
            ["phonenumber"]: data.phonenumber,
            ["genderId"]: data.genderId,
            ["roleId"]: data.roleId,
            ["email"]: data.email,
            ["id"]: data.id,
            ["dob"]: new Date(data.dob)
        })
    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleAddUser = async () => {
        if (!CommonUtils.isValidPhoneNumber(inputValues.phonenumber)) {
            toast.error("Số điện thoại không hợp lệ")
            return
        }
        let res = await createNewUser({
            email: inputValues.email,
            password: inputValues.password,
            firstName: inputValues.firstName,
            lastName: inputValues.lastName,
            address: inputValues.address,
            genderId: inputValues.genderId,
            phonenumber: inputValues.phonenumber,
            dob: moment(inputValues.dob).format('MM/DD/YYYY')
        })
        if (res && res.errCode === 0) {
            toast.success("Thêm mới người dùng thành công")
            setInputValues({
                ...inputValues,
                ["firstName"]: '',
                ["lastName"]: '',
                ["address"]: '',
                ["phonenumber"]: '',
                ["genderId"]: '',
                ["roleId"]: '',
                ["email"]: '',
                ["dob"]: new Date()
            })
            props.handleCloseAddUserModal()
        } else {
            toast.error(res.errMessage)
        }
    }

    const handleUpdateUser = async () => {
        if (!CommonUtils.isValidPhoneNumber(inputValues.phonenumber)) {
            toast.error("Số điện thoại không hợp lệ")
            return
        }
        let res = await UpdateUserService({
            id: inputValues.id,
            firstName: inputValues.firstName,
            lastName: inputValues.lastName,
            address: inputValues.address,
            genderId: inputValues.genderId,
            phonenumber: inputValues.phonenumber,
            dob: moment(inputValues.dob).format('MM/DD/YYYY')
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật người dùng thành công")
            props.handleCloseAddUserModal()
        } else {
            toast.error(res.errMessage)
        }
    }

    return (
        <Modal isOpen={props.isOpenAddUserModal} size={'xl'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    Thêm người dùng
                </h4>
                <button onClick={props.handleCloseAddUserModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={inputValues.email} disabled={props.id == null ? false : true} name="email" onChange={(event) => handleOnChange(event)} className="form-control" id="email" />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="password">Password</label>
                        <input type="password" disabled={props.id == null ? false : true} name="password" onChange={(event) => handleOnChange(event)} className="form-control" id="password" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-4">
                        <label htmlFor="firstName">Họ</label>
                        <input type="text" value={inputValues.firstName} name="firstName" onChange={(event) => handleOnChange(event)} className="form-control" id="firstName" />
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="lastName">Tên</label>
                        <input type="text" value={inputValues.lastName} name="lastName" onChange={(event) => handleOnChange(event)} className="form-control" id="lastName" />
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="phonenumber">Số điện thoại</label>
                        <input type="text" value={inputValues.phonenumber} name="phonenumber" onChange={(event) => handleOnChange(event)} className="form-control" id="phonenumber" />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Địa chỉ</label>
                    <input type="text" value={inputValues.address} name="address" onChange={(event) => handleOnChange(event)} className="form-control" id="address" />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="birthday">Ngày sinh</label>
                        <DatePicker
                            id='birthday'
                            selected={inputValues.dob}
                            onChange={(update) => {
                                setInputValues({
                                    ...inputValues,
                                    ["dob"]: update
                                })
                            }}
                            className="form-control"
                            isClearable={true}
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="genderId">Giới tính</label>
                        <select value={inputValues.genderId} name="genderId" onChange={(event) => handleOnChange(event)} id="genderId" className="form-control">
                            {dataGender && dataGender.length > 0 &&
                                dataGender.map((item, index) => {
                                    return (
                                        <option key={index} value={item.code}>{item.value}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                {
                    props.id ?
                        <button type="button" onClick={() => handleUpdateUser()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => handleAddUser()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddUserModal;