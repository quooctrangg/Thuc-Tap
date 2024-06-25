import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { useState, useEffect } from 'react';
import { createNewBannerService, getDetailBannerByIdService, updateBannerService } from '../../../services/userService';
import { toast } from 'react-toastify';
import './AddBannerModal.scss';
import 'react-toastify/dist/ReactToastify.css';
import CommonUtils from '../../../utils/CommonUtils';

const AddBannerModal = props => {
    const [inputValues, setInputValues] = useState({
        name: '', description: '', image: '', imageReview: '', isOpen: false,
    });
    const [bannerId, setBannerId] = useState(null)

    useEffect(() => {
        setBannerId(props.id)
    })

    useEffect(() => {
        if (bannerId) {
            fetchBanner(bannerId);
        } else {
            setInputValues({
                ["name"]: '',
                ["image"]: '',
                ["description"]: '',
                ["imageReview"]: ''
            })
        }
    }, [bannerId])

    const fetchBanner = async (id) => {
        let res = await getDetailBannerByIdService(id)
        if (res && res.errCode === 0) {
            setStateBanner(res.data)
        }
    }

    let setStateBanner = (data) => {
        setInputValues({
            ["name"]: data.name,
            ["description"]: data.description,
            ["image"]: data.image,
            ["imageReview"]: data.image,
        })

    }

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file.size > 31312281) {
            toast.error("Dung lượng file bé hơn 30mb")
        }
        else {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file)
            console.log(base64)
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl })

        }
    }

    let openPreviewImage = () => {
        if (!inputValues.imageReview) return;
        setInputValues({ ...inputValues, ["isOpen"]: true })
    }


    const handleAddBanner = async () => {
        let res = await createNewBannerService({
            name: inputValues.name,
            description: inputValues.description,
            image: inputValues.image
        })
        if (res && res.errCode === 0) {
            toast.success("Tạo mới băng rôn thành công !")
            setInputValues({
                ...inputValues,
                ["name"]: '',
                ["image"]: '',
                ["description"]: '',
                ["imageReview"]: ''
            })
            props.handleCloseAddBannerModal()
            props.loadBanner()
        } else {
            toast.error(res.errMessage)
        }
    }

    const handleUpdateBanner = async () => {
        let res = await updateBannerService({
            name: inputValues.name,
            description: inputValues.description,
            image: inputValues.image,
            id: bannerId
        })
        if (res && res.errCode === 0) {
            toast.success("Cập nhật băng rôn thành công !")
            props.handleCloseAddBannerModal()
            props.loadBanner()
        } else {
            toast.error(res.errMessage)
        }
    }

    return (
        <Modal isOpen={props.isOpenAddBannerModal} size={'xl'}>
            <div className="modal-header">
                <h4 className="modal-title">
                    {
                        bannerId ? 'Cập nhật băng rôn' : 'Thêm băng rôn'
                    }
                </h4>
                <button onClick={props.handleCloseAddBannerModal} type="button" className="btn btn-time" aria-label="Close">X</button>
            </div>
            <ModalBody>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="name">Tên băng rôn</label>
                        <input type="text" value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} className="form-control" id="name" />
                    </div>
                    <div className="col-md-4 form-group">
                        <label htmlFor="image">Chọn hình ảnh</label>
                        <input accept=".jpg,.png" onChange={(event) => handleOnChangeImage(event)} type="file" className="form-control form-file" id='image' />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reviewimage">Hình ảnh hiển thị</label>
                        <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} id='reviewimage' onClick={() => openPreviewImage()} className="box-img-preview"></div>
                    </div>
                    <div className="form-group col-md-12">
                        <label htmlFor="description">Mô tả chi tiết</label>
                        <textarea rows="4" value={inputValues.description} id='description' name="description" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                    </div>
                </div>
                {
                    bannerId ?
                        <button type="button" onClick={() => handleUpdateBanner()} className="btn btn-primary">Cập nhật</button>
                        :
                        <button type="button" onClick={() => handleAddBanner()} className="btn btn-primary">Thêm</button>
                }
            </ModalBody>
        </Modal>
    )
}

export default AddBannerModal