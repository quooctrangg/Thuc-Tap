import React from 'react';

function Footer(props) {
    return (
        <div>
            <footer className="footer-area section_gap">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-md-5 single-footer-widget">
                            <h4>Truy cập nhanh</h4>
                            <ul>
                                <li><a href="#">Trang chủ</a></li>
                                <li><a href="#">Giới thiệu</a></li>
                                <li><a href="#">Mua hàng</a></li>
                                <li><a href="#">Liên hệ</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-5 single-footer-widget">
                            <h4>Liên kết</h4>
                            <ul>
                                <li><a href="#">Đăng nhập</a></li>
                                <li><a href="#">Đăng ký</a></li>
                                <li><a href="#">Giỏ hàng</a></li>
                                <li><a href="#">Đơn hàng</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-5 single-footer-widget">
                            <h4>Liên hệ với chúng tôi</h4>
                            <ul>
                                <li><a href="#">0229.666.555</a></li>
                                <li><a href="#">0949.332.107</a></li>
                                <li><a href="#">example@gmail.com</a></li>
                                <li><a href="#">Khu 586, Cái Răng, TP.Cần Thơ</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-5 single-footer-widget">
                            <h4>Theo dõi chúng tôi</h4>
                            <ul>
                                <li><a href="#">Facebook</a></li>
                                <li><a href="#">Zalo</a></li>
                                <li><a href="#">Google</a></li>
                                <li><a href="#">Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom row align-items-center">
                        <p className="footer-text m-0 col-lg-8 col-md-12">{/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                            <a href="https://colorlib.com" target="_blank"></a>
                            {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;