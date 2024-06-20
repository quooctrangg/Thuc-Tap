import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getItemCartStart } from '../../action/ShopCartAction'
import { listRoomOfAdmin } from '../../services/userService';
import './Header1.scss';
import socketIOClient from "socket.io-client";
require('dotenv').config();
const Header = () => {
    const [quantityMessage, setquantityMessage] = useState('')
    const [user, setUser] = useState({})
    const dispatch = useDispatch()
    const socketRef = useRef();
    const [setId] = useState();
    const host = process.env.REACT_APP_BACKEND_URL;
    let handleLogout = () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        window.location.href = '/login'
    }

    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
        if (userData) {
            dispatch(getItemCartStart(userData.id))
            socketRef.current.on('getId', data => {
                setId(data)
            }) // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.
            fetchListRoom(userData.id)
            socketRef.current.on('sendDataServer', dataGot => {
                fetchListRoom(userData.id)
            })
            socketRef.current.on('loadRoomServer', dataGot => {
                fetchListRoom(userData.id)
            })
            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [])

    let fetchListRoom = async (userId) => {
        let res = await listRoomOfAdmin(userId)
        if (res && res.errCode == 0) {
            let count = 0;
            if (res.data && res.data.length > 0 && res.data[0].messageData && res.data[0].messageData.length > 0) {
                res.data[0].messageData.forEach((item) => {
                    if (item.unRead === 1 && item.userId !== userId) count = count + 1;
                })
            }
            setquantityMessage(count)
        }
    }

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            {/* Navbar Brand*/}
            <p className="navbar-brand ps-3">Trang quản trị</p>
            {/* Sidebar Toggle*/}
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars" /></button>
            {/* Navbar Search*/}
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
            </form>
            {/* Navbar*/}
            <div className="main_menu col-lg-3 pr-0">
                <ul className="nav navbar-nav navbar-right right_nav pull-right">
                    <li className="nav-item">
                        <Link to={"/admin/chat"} className="icons">
                            <i className="fa-brands fa-facebook-messenger"></i>
                        </Link>
                        {quantityMessage > 0 &&
                            <span className="box-message-quantity">{quantityMessage}</span>
                        }
                    </li>
                </ul>
            </div>
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-user fa-fw" />
                        {' '}{user.firstName} {user.lastName}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li>
                            <Link to={`/admin/infor/${user.id}`} className="dropdown-item" >Thông tin cá nhân</Link>
                        </li>
                        <li>
                            <Link to={`/admin/change-password/${user.id}`} className="dropdown-item">Đổi mật khẩu</Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" onClick={() => handleLogout()} >Đăng xuất</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Header;