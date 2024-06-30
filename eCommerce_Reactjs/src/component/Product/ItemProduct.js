import React from 'react';
import CommonUtils from '../../utils/CommonUtils';
import { Link } from 'react-router-dom';
import './ItemProduct.scss';

function ItemProduct(props) {
    return (
        <div className={props.type}>
            <div style={{ cursor: 'pointer' }} className="single-product">
                <Link to={`/detail-product/${props.id}`}>
                    <div style={{ width: props.width, height: props.height }} className="product-img">
                        <img className="img-fluid w-100" src={props.img} alt="" />
                        <div className="p_icon">
                            <a href='/' >
                                <i className="ti-eye" />
                            </a>
                            <a href='/' >
                                <i className="ti-shopping-cart" />
                            </a>
                        </div>
                    </div>
                    <div style={{ width: props.width, height: '130px' }} className="product-btm">
                        <a href='/' className="d-block">
                            <h4 >{props.name}</h4>
                            {
                                props.price !== props.discountPrice &&
                                <del className='text-sm' >{props.price ? CommonUtils.formatter.format(props.price) : ''}</del>
                            }
                        </a>
                        <div className="mt-3">
                            <span className="mr-4 text-danger">{CommonUtils.formatter.format(props.discountPrice)}</span>
                            {
                                props.price && props.price !== props.discountPrice &&
                                <span className='text-red border bg-warning p-1'>{"-" + Math.trunc((props.price - props.discountPrice) / props.price * 100) + '%'}</span>
                            }
                        </div>
                    </div>
                </Link>
            </div >
        </div >
    );
}

export default ItemProduct;