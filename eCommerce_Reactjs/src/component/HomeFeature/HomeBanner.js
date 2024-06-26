import React from 'react';
import './HomeBanner.scss';

function HomeBanner(props) {
    return (
        <section className="home_banner_area mb-40" >
            <div className="box-banner" style={{ backgroundImage: `url(${props.image})`, backgroundPosition: 'center' }}>
                <div className="banner_inner d-flex align-items-center">
                    <div className="container">
                        <div className="banner_content row"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeBanner;