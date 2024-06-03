import React from 'react';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './FormSearch.scss'

const FormSearch = (props) => {
    const [keyword, setkeyword] = useState('')

    let handleSearchProduct = () => {
        props.handleSearch(keyword)
    }

    let handleOnchange = (keyword) => {
        setkeyword(keyword)
        props.handleOnchange(keyword)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchProduct()
        }
    }

    return (
        <form>
            <div className="form-group">
                <div className="input-group">
                    <input onChange={(e) => handleOnchange(e.target.value)} onKeyDown={handleKeyDown} value={keyword} type="text" className="form-control" placeholder={`Tìm kiếm theo ${props.title}`} />
                    <div className="input-group-append">
                        <button onClick={() => handleSearchProduct()} className="btn" type="button"><i className="ti-search" /></button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default FormSearch;