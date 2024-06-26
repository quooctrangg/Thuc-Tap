import React from 'react';
import Header from './Header';
import SideBar from './SideBar';
import Home from './Home';
import ManageUser from './User/ManageUser';
import ManageCategory from './Category/ManageCategory';
import ManageBrand from './Brand/ManageBrand';
import Information from './User/Information';
import ChangePassword from './User/ChangePassword';
import ManageProduct from './Product/ManageProduct';
import ManageProductDetail from './Product/ProductDetail/ManageProductDetail';
import ManageProductImage from './Product/ProductImage/ManageProductImage';
import ManageBanner from './Banner/ManageBanner';
import ManageTypeShip from './TypeShip/ManageTypeShip';
import ManageTypeVoucher from './Voucher/ManageTypeVoucher';
import ManageVoucher from './Voucher/ManageVoucher';
import ManageOrder from './Order/ManageOrder';
import DetailOrder from './Order/DetailOrder';
import Message from './Message/Message';
import ManageSupplier from './Supplier/ManageSupplier';
import ManageReceipt from './Receipt/ManageReceipt';
import DetailReceipt from './Receipt/DetailReceipt';
import Turnover from './Statistic/Turnover';
import Profit from './Statistic/Profit';
import StockProduct from './Statistic/StockProduct';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function HomePageAdmin(props) {
    return (
        <Router>
            <Switch>
                <div className="sb-nav-fixed">
                    <Header />
                    <div id="layoutSidenav">
                        <SideBar />
                        <div id="layoutSidenav_content">
                            <main>
                                <Route exact path="/admin/">
                                    <Home />
                                </Route>
                                <Route exact path="/admin/list-user">
                                    <ManageUser />
                                </Route>
                                <Route exact path="/admin/list-category">
                                    <ManageCategory />
                                </Route>
                                <Route exact path="/admin/list-brand">
                                    <ManageBrand />
                                </Route>
                                <Route exact path="/admin/infor/:id">
                                    <Information />
                                </Route>
                                <Route exact path="/admin/change-password/:id">
                                    <ChangePassword />
                                </Route>
                                <Route exact path="/admin/list-product">
                                    <ManageProduct />
                                </Route>
                                <Route exact path="/admin/list-supplier">
                                    <ManageSupplier />
                                </Route>
                                <Route exact path="/admin/list-receipt">
                                    <ManageReceipt />
                                </Route>
                                <Route exact path="/admin/detail-receipt/:id">
                                    <DetailReceipt />
                                </Route>
                                <Route exact path="/admin/list-product-detail/:id">
                                    <ManageProductDetail />
                                </Route>
                                <Route exact path="/admin/list-product-detail-image/:id">
                                    <ManageProductImage />
                                </Route>
                                <Route exact path="/admin/list-banner">
                                    <ManageBanner />
                                </Route>
                                <Route exact path="/admin/list-typeship">
                                    <ManageTypeShip />
                                </Route>
                                <Route exact path="/admin/list-typevoucher">
                                    <ManageTypeVoucher />
                                </Route>
                                <Route exact path="/admin/list-voucher">
                                    <ManageVoucher />
                                </Route>
                                <Route exact path="/admin/list-order">
                                    <ManageOrder />
                                </Route>
                                <Route exact path="/admin/order-detail/:id">
                                    <DetailOrder />
                                </Route>
                                <Route exact path="/admin/chat">
                                    <Message />
                                </Route>
                                <Route exact path="/admin/turnover">
                                    <Turnover />
                                </Route>
                                <Route exact path="/admin/profit">
                                    <Profit />
                                </Route>
                                <Route exact path="/admin/stock-product">
                                    <StockProduct />
                                </Route>
                            </main>
                        </div>
                    </div>
                </div>
            </Switch>
        </Router>
    );
}

export default HomePageAdmin;