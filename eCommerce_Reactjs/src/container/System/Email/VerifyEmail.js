import React from 'react';
import { useEffect, useState } from 'react';
import { handleVerifyEmail } from '../../../services/userService';
import 'react-toastify/dist/ReactToastify.css';
import './VerifyEmail.scss';

const VerifyEmail = () => {
    const [status, setstatus] = useState(false)

    useEffect(() => {
        let token = getParam("token");
        let id = getParam("userId");
        fetchVerifyEmail(id, token)
    })

    let fetchVerifyEmail = async (id, token) => {
        let res = await handleVerifyEmail({
            token: token,
            id: id
        })
        console.log(res.errCode)
        if (res.errCode === 0) {
            setstatus(true)
        }
    }

    let getParam = (param) => {
        let url = new URL(window.location.href);
        return url.searchParams.get(param);
    }

    return (
        <div className="container-verify-email">
            <h3 className="text-verify-email">
                {status === true && "Xác thực email thành công !"}
                {status === false && "Email đã được xác thực hoặc không tồn tại !"}
            </h3>
        </div>
    )
}

export default VerifyEmail;