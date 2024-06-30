import React from 'react';
import { useEffect, useState } from 'react';
import { useFetchAllcode } from '../../../customize/fetch';
import { Modal, ModalFooter, ModalBody, Button } from 'reactstrap';
import { UpdateProductDetailSizeService, createNewProductSizeService, getProductDetailSizeByIdService } from '../../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'react-image-lightbox/style.css';

const AddSizeModal = (props) => {
    const { id } = useParams()

    const { data: dataSize } = useFetchAllcode('SIZE')

    const [inputValues, setInputValues] = useState({ sizeId: '', width: '', height: '', id: '', weight: '' });
    const [productSizeId, setProductSizeId] = useState(null)

    if (dataSize && dataSize.length > 0 && inputValues.sizeId === '') {
        setInputValues({ ...inputValues, ["sizeId"]: dataSize[0].code })
    }

    useEffect(() => {
        setProductSizeId(props.productSizeId)
    })

    useEffect(() => {
        if (productSizeId) {
            fetchDetailProductSize(productSizeId)
        } else {
            setInputValues({
                ...inputValues,
                ["sizeId"]: '',
                ["width"]: '',
                ["height"]: '',
                ["weight"]: ''
            })
        }
    }, [productSizeId])

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let fetchDetailProductSize = async (id) => {
        let res = await getProductDetailSizeByIdService(id)
        if (res && res.errCode === 0) {
            setInputValues({
                ...inputValues,
                ["sizeId"]: res.data.sizeId,
                ["width"]: res.data.width,
                ["height"]: res.data.height,
                ["weight"]: res.data.weight
            })
        }
    }

    const handleAddProductSize = async () => {
        let response = await createNewProductSizeService({
            productdetailId: id,
            sizeId: inputValues.sizeId,
            width: inputValues.width,
            height: inputValues.height,
            weight: inputValues.weight
        })
        if (response && response.errCode === 0) {
            toast.success("Thêm kích thước thành công !")
            setInputValues({
                ...inputValues,
                ["sizeId"]: '',
                ["width"]: '',
                ["height"]: '',
                ["weight"]: ''
            })
            props.loadProductDetailSize()
            props.handleCloseSizeModal()
        } else {
            toast.error("Thêm kích thước thất bại")
        }
    }

    const handleUpdateProductSize = async () => {
        let response = await UpdateProductDetailSizeService({
            sizeId: inputValues.sizeId,
            width: inputValues.width,
            height: inputValues.height,
            id: productSizeId,
            weight: inputValues.weight
        })
        if (response && response.errCode === 0) {
            toast.success("Cập nhật kích thước thành công !")
            props.loadProductDetailSize()
            props.handleCloseSizeModal()
        } else {
            toast.error("Cập nhật kích thước thất bại !")
        }
    }

    return (
        <div className="">
            <Modal isOpen={props.isOpenSizeModal} className={'booking-modal-container'} size="md" centered >
                <div className="modal-header">
                    <h5 className="modal-title">
                        {
                            productSizeId ?
                                'Cập nhật kích thước chi tiết sản phẩm'
                                :
                                'Thêm kích thước chi tiết sản phẩm'
                        }
                    </h5>
                    <button onClick={props.handleCloseSizeModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    <div className="row">
                        <div className="col-12 form-group">
                            <label>Kích thước</label>
                            <select value={inputValues.sizeId} name="sizeId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                {
                                    dataSize && dataSize.length > 0 &&
                                    dataSize.map((item, index) => {
                                        return (
                                            <option key={index} value={item.code}>{item.value}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-12 form-group">
                            <label>Chiều rộng</label>
                            <input value={inputValues.width} name="width" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Chiều dài</label>
                            <input value={inputValues.height} name="height" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                        <div className="col-12 form-group">
                            <label>Khối lượng</label>
                            <input value={inputValues.weight} name="weight" onChange={(event) => handleOnChange(event)} type="text" className="form-control"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {
                        productSizeId ?
                            <button type="button" onClick={() => handleUpdateProductSize()} className="btn btn-primary">Cập nhật</button>
                            :
                            <button type="button" onClick={() => handleAddProductSize()} className="btn btn-primary">Thêm</button>
                    }
                    <Button onClick={props.handleCloseSizeModal}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </div >
    )
}

export default AddSizeModal;