import React from 'react';
import Header from './container/Header/Header';
import Footer from './container/Footer/Footer';
import HomePage from './container/Home/HomePage';
import ShopPage from './container/Shop/ShopPage';
import DetailProductPage from './container/DetailProduct/DetailProductPage';
import ShopCartPage from './container/ShopCart/ShopCartPage';
import HomePageAdmin from './container/System/HomePageAdmin';
import VerifyEmail from './container/System/Email/VerifyEmail';
import LoginWebPage from './container/Login/LoginWebPage';
import UserHomePage from './container/User/UseHomePage';
import VoucherHomePage from './container/Voucher/VoucherHomePage';
import OrderHomePage from './container/Order/OrderHomePage';
import TopMenu from './container/Header/TopMenu';
import PaymentSuccess from './container/User/PaymentSuccess';
import VnpayPaymentPage from './container/Order/VnpayPaymentPage';
import VnpayPaymentSuccess from './container/Order/VnpayPaymentSuccess';
import AboutHomePage from './container/About/AboutHomePage'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Redirect } from 'react-router';
import './css/App.css';

function App() {
    return (
        <Router>
            <Switch>
                <div className="App">
                    <Route exact path="/">
                        <Header />
                        <HomePage />
                        <Footer />
                    </Route>
                    <Route path="/shop">
                        <Header />
                        <ShopPage />
                        <Footer />
                    </Route>
                    <Route path="/detail-product/:id">
                        <Header />
                        <DetailProductPage />
                        <Footer />
                    </Route>
                    <Route path="/admin/" render={() => {
                        if (JSON.parse(localStorage.getItem("userData")) && (JSON.parse(localStorage.getItem("userData")).roleId === "R1" || JSON.parse(localStorage.getItem("userData")).roleId === "R4")) {
                            return <HomePageAdmin />
                        } else return <Redirect to={"/login"} />
                    }}>
                    </Route>
                    <Route path="/user/" render={() => {
                        return JSON.parse(localStorage.getItem("userData")) && JSON.parse(localStorage.getItem("userData")) ? <div>
                            <Header />
                            <UserHomePage />
                            <Footer />
                        </div> : <Redirect to={"/login"} />
                    }}>
                    </Route>
                    <Route path="/shopcart">
                        <Header />
                        <ShopCartPage />
                        <Footer />
                    </Route>
                    <Route exact path="/payment/success">
                        <Header />
                        <PaymentSuccess />
                        <Footer />
                    </Route>
                    <Route exact path="/payment/vnpay">
                        <TopMenu user={JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : ''} />
                        <VnpayPaymentPage />
                        <Footer />
                    </Route>
                    <Route exact path="/payment/vnpay_return">
                        <TopMenu user={JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : ''} />
                        <VnpayPaymentSuccess />
                        <Footer />
                    </Route>
                    <Route path="/login">
                        <Header />
                        <LoginWebPage />
                        <Footer />
                    </Route>
                    <Route path="/voucher">
                        <Header />
                        <VoucherHomePage />
                        <Footer />
                    </Route>
                    <Route path="/about">
                        <Header />
                        <AboutHomePage />
                        <Footer />
                    </Route>
                    <Route path="/verify-email">
                        <Header />
                        <VerifyEmail />
                        <Footer />
                    </Route>
                    <Route path="/order/:userId">
                        <TopMenu user={JSON.parse(localStorage.getItem("userData")) ? JSON.parse(localStorage.getItem("userData")) : ''} />
                        <OrderHomePage />
                        <Footer />
                    </Route>
                    <ToastContainer
                        position="top-right"
                        autoClose={4000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Switch>
        </Router>
    );
}

export default App;
