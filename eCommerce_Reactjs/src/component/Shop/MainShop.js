import React, { useState, useEffect } from 'react';
import ItemProduct from '../Product/ItemProduct';
import { getAllProductUser } from '../../services/userService';
import ReactPaginate from 'react-paginate';
import FormSearch from '../Search/FormSearch';

function MainShop(props) {
    const limitPage = 9
    const [dataProduct, setdataProduct] = useState([])
    const [count, setCount] = useState(0)
    const [numberPage, setnumberPage] = useState(0)
    const [sortPrice, setsortPrice] = useState('')
    const [sortName, setsortName] = useState('')
    const [categoryId, setcategoryId] = useState('')
    const [brandId, setbrandId] = useState('')
    const [keyword, setkeyword] = useState('')

    useEffect(() => {
        setcategoryId(props.categoryId)
        setbrandId(props.brandId)
    })

    useEffect(() => {
        loadProduct()
    }, [numberPage, sortPrice, sortName, categoryId, brandId, keyword])

    let loadProduct = async () => {
        let arrData = await getAllProductUser({
            sortPrice: sortPrice,
            sortName: sortName,
            limit: limitPage,
            offset: numberPage * limitPage,
            categoryId: categoryId,
            brandId: brandId,
            keyword: keyword
        })
        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data)
            setCount(Math.ceil(arrData.count / limitPage))
        }
    }

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        props.myRef.current.scrollIntoView()
    }

    let handleSelectSort = async (event) => {
        let value = +event.target.value
        if (value === 1) {
            setsortName('')
            setsortPrice('')
        }
        else if (value === 2) {
            setsortName('')
            setsortPrice(true)
        }
        else if (value === 3) {
            setsortPrice('')
            setsortName(true)
        }
    }

    let handleSearch = (keyword) => {

    }

    let handleOnchangeSearch = (keyword) => {
        setkeyword(keyword)
    }

    return (
        <div className="col-lg-9">
            <div className="product_top_bar">
                <div className="left_dorp">
                    <select style={{ outline: 'none', width: 'auto', borderRadius: '3px' }} onChange={(event) => handleSelectSort(event)} className="sorting">
                        <option value={1}>Sắp xếp</option>
                        <option value={2}>Theo giá tiền</option>
                        <option value={3}>Theo tên</option>
                    </select>
                    <div style={{ display: 'inline-block', marginLeft: '10px', width: '300px' }}>
                        <FormSearch title={"tên sản phẩm"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearch} />
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: '10px' }} className="latest_product_inner">
                <div className="row">
                    {dataProduct && dataProduct.length > 0 ?
                        dataProduct.map((item, index) => {
                            return (
                                <ItemProduct id={item.id} width={"255px"} height={"254px"} key={index} type="col-lg-4 col-md-6" name={item.name} img={item.productDetail[0].productImage[0].image}
                                    discountPrice={item.productDetail[0].discountPrice} price={item.productDetail[0].originalPrice}>
                                </ItemProduct>
                            )
                        })
                        :
                        <h4 className='text-center text-2xl text-red'>Không có sản phẩm nào.</h4>
                    }
                </div>
            </div>
            {
                count > 1 &&
                <ReactPaginate
                    previousLabel={'Quay lại'}
                    nextLabel={'Tiếp'}
                    breakLabel={'...'}
                    pageCount={count}
                    marginPagesDisplayed={3}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    activeClassName={"active"}
                    onPageChange={handleChangePage}
                />
            }
        </div>
    );
}

export default MainShop;