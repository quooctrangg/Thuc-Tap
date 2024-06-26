import React from 'react';
import './Header.scss';

const TopMenu = props => {

    const handleLogout = () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        window.location.href = '/login'
    }

    return (
        <div className="top_menu">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7">
                        <div className="float-left"> </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="float-right">
                            <ul className="right_side">
                                <li>
                                    {
                                        props.user && props.user.id ?
                                            ''
                                            :
                                            <a href="/login">Đăng nhập </a>
                                    }
                                </li>
                                <li style={{ cursor: 'pointer' }}>
                                    {
                                        props.user && props.user.id ?
                                            <a onClick={() => handleLogout()}>
                                                Đăng xuất
                                            </a>
                                            :
                                            <a href="/login">
                                                Đăng ký
                                            </a>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopMenu;