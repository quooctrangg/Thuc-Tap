import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
const SideBar = () => {
    const [user, setUser] = useState({})

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
    }, [])

    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading"></div>
                        <Link to="/admin" className="nav-link">
                            <div className="sb-nav-link-icon">
                                <i className="fas fa-tachometer-alt" />
                            </div>
                            Trang chủ
                        </Link>
                        <div className="sb-sidenav-menu-heading">Quản lý</div>
                        {
                            user && user.roleId === "R1" &&
                            <>
                                <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseStatistic" aria-expanded="false" aria-controls="collapseLayouts">
                                    <div className="sb-nav-link-icon"><i className="fa-solid fa-magnifying-glass-chart"></i></div>
                                    Thống kê
                                    <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down" /></div>
                                </a>
                                <div className="collapse" id="collapseStatistic" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <Link to={'/admin/turnover'} className="nav-link" >Thống kê doanh thu</Link>
                                        <Link to={'/admin/profit'} className="nav-link" >Thống kê lợi nhuận</Link>
                                        <Link to={'/admin/stock-product'} className="nav-link" >Thống kê tồn kho</Link>
                                    </nav>
                                </div>
                            </>
                        }
                        {
                            user && user.roleId === "R1" &&
                            <>
                                <div >
                                    <Link to={'/admin/list-user'} className="nav-link flex gap-2" >
                                        <i className="fas fa-users"></i>
                                        Quản lý người dùng
                                    </Link>
                                </div>
                                <div >
                                    <Link to={'/admin/list-category'} className="nav-link flex gap-2" >
                                        <i className="fas fa-list-ol"></i>
                                        Quản lý danh mục
                                    </Link>
                                </div>
                                <div >
                                    <Link to={'/admin/list-brand'} className="nav-link flex gap-2" >
                                        <i className="far fa-copyright"></i>
                                        Quản lý nhãn hàng
                                    </Link>
                                </div>
                                <div >
                                    <Link to={'/admin/list-product'} className="nav-link flex gap-2" >
                                        <i className="fa-solid fa-clock"></i>
                                        Quản lý sản phẩm
                                    </Link>
                                </div>
                                <div >
                                    <Link to={'/admin/list-banner'} className="nav-link flex gap-2" >
                                        <i className="fab fa-adversal"></i>
                                        Quản lý băng rôn
                                    </Link>
                                </div>
                                <div >
                                    <Link to={'/admin/list-typeship'} className="nav-link flex gap-2" >
                                        <i className="fas fa-shipping-fast"></i>
                                        Quản lý loại giao hàng
                                    </Link>
                                </div>
                                <div >
                                    <Link to={'/admin/list-voucher'} className="nav-link flex gap-2" >
                                        <i className="fas fa-percentage"></i>
                                        Quản lý khuyến mãi
                                    </Link>
                                </div>
                            </>
                        }
                        <div >
                            <Link to={'/admin/list-supplier'} className="nav-link flex gap-2" >
                                <i className="fa-solid fa-person-military-pointing"></i>
                                Quản lý Nhà cung cấp
                            </Link>
                        </div>
                        <div >
                            <Link to={'/admin/list-receipt'} className="nav-link flex gap-2" >
                                <i className="fas fa-cart-plus"></i>
                                Quản lý nhập hàng
                            </Link>
                        </div>
                        <div >
                            <Link to={'/admin/list-order'} className="nav-link flex gap-2" >
                                <i className="fas fa-cart-plus"></i>
                                Quản lý đơn hàng
                            </Link>
                        </div>
                        <div>
                            <Link to={'/admin/chat'} className="nav-link flex gap-2">
                                <div className="sb-nav-link-icon"><i className="fa-brands fa-facebook-messenger"></i></div>
                                Quản lý tin nhắn
                            </Link>
                        </div>
                    </div>
                </div >
            </nav >
        </div >
    )
}

export default SideBar;