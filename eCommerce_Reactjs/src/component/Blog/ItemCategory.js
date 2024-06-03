import React from 'react';

function ItemCategory(props) {
    let handleClickCategory = (code) => {
        props.handleClickCategory(code)
    }

    return (
        <li >
            <a href='/' style={{ cursor: 'pointer' }} onClick={() => handleClickCategory(props.data.code)} className={props.data.code === props.activeLinkId ? "d-flex activeCategory" : "d-flex"}>
                <p>{props.data.value}</p>
                <p>({props.data.countPost})</p>
            </a>
        </li>
    );
}

export default ItemCategory;