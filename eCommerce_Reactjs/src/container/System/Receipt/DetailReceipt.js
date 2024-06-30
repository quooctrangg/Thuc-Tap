import React from 'react';
import CommonUtils from '../../../utils/CommonUtils';
import { useEffect, useState } from 'react';
import { deleteDetailReceiptService, getDetailReceiptByIdService } from '../../../services/userService';
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import AddDetailReceiptModal from './AddDetailReceiptModal';

const DetailReceipt = (props) => {
    const { id } = useParams();

    const [dataReceiptDetail, setdataReceiptDetail] = useState({})
    const [billNumber, setBillNumber] = useState('')
    const [isOpenDetailReceiptModal, setIsOpenDetailReceiptModal] = useState(false)
    const [current, setCurrent] = useState(null)
    const [status, setStatus] = useState(null)

    useEffect(() => {
        loadReceiptDetail(id)
    }, [])

    let loadReceiptDetail = async (id) => {
        let res = await getDetailReceiptByIdService(id)
        if (res && res.errCode == 0) {
            setStatus(res.data.status)
            setdataReceiptDetail(res.data.receiptDetail)
            setBillNumber(res.data.billNumber)
        }
    }

    const handleShowDetailReceiptModal = () => {
        setIsOpenDetailReceiptModal(true)
    }

    const handleCloseDetailReceiptModal = () => {
        setIsOpenDetailReceiptModal(false)
        setCurrent(null)
    }

    const handleDeleteDetailReceipt = async (detailReceiptId) => {
        let res = await deleteDetailReceiptService({
            data: {
                id: detailReceiptId
            }
        })
        if (res && res.errCode === 0) {
            toast.success("Xóa sản phẩm thành công")
            await loadReceiptDetail(id)
        } else toast.error("Xóa sản phẩm thất bại")
    }


    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý chi tiết nhập hàng hóa đơn {billNumber}</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách chi tiết nhập hàng
                </div>
                <div className="card-body">
                    <div style={{ width: '100%' }} className='' >
                        <div className='d-flex gap-2 justify-content-end mb-2'>
                            {
                                status !== 1 &&
                                <button onClick={() => handleShowDetailReceiptModal()} className="btn btn-success" >Thêm</button>
                            }
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Số lô</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá / 1 chiếc</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataReceiptDetail && dataReceiptDetail.length > 0 ?
                                        dataReceiptDetail.map((item, index) => {
                                            let name = `${item.productData.name} - ${item.productDetailData.nameDetail} - ${item.productDetailSizeData.sizeData.value}`
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.lotNumber}</td>
                                                    <td>{name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{CommonUtils.formatter.format(item.price)}</td>
                                                    <td style={{ display: 'flex', gap: 2 }}>
                                                        {
                                                            !item.status &&
                                                            <button onClick={() => handleDeleteDetailReceipt(item.id)} className='btn btn-danger'>
                                                                Xóa
                                                            </button>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan={6} className='text-center text-red'>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div style={{ width: '100%' }} className='' >
                        <div className='d-flex gap-2 justify-content-end mb-2'>
                            {
                                status !== 1 &&
                                <button onClick={() => handleShowDetailReceiptModal()} className="btn btn-info" >Nhập kho</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <AddDetailReceiptModal isOpenDetailReceiptModal={isOpenDetailReceiptModal} handleCloseDetailReceiptModal={handleCloseDetailReceiptModal} loadReceiptDetail={loadReceiptDetail} />
        </div>
    )
}

export default DetailReceipt;