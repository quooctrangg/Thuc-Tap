import db from "../models/index";
require('dotenv').config();

let createNewReceipt = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.supplierId || !data.billNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let isReceipt = await db.Receipt.findOne({
                    where: {
                        billNumber: data.billNumber
                    }
                })
                if (isReceipt) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Số hóa đơn đã tồn tại'
                    })
                    return
                }
                let receipt = await db.Receipt.create({
                    userId: data.userId,
                    supplierId: data.supplierId,
                    billNumber: data.billNumber
                })
                if (receipt) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                    return
                }
                resolve({
                    errCode: 1,
                    errMessage: 'Thất bại'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let createNewReceiptDetail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.receiptId || !data.productDetailSizeId || !data.quantity || !data.price || !data.lotNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                const isLotNumber = await db.ReceiptDetail.findOne({
                    where: {
                        lotNumber: data.lotNumber,
                    }
                })
                if (isLotNumber) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Sô lô đã tồn tại'
                    })
                    return
                }
                const isReceiptDetail = await db.ReceiptDetail.create({
                    receiptId: data.receiptId,
                    productDetailSizeId: data.productDetailSizeId,
                    quantity: data.quantity,
                    price: data.price,
                    lotNumber: data.lotNumber
                })
                if (isReceiptDetail) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                    return
                }
                resolve({
                    errCode: 1,
                    errMessage: 'Thất bại'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailReceiptById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let res = await db.Receipt.findOne({
                    where: { id: id }
                })
                res.receiptDetail = await db.ReceiptDetail.findAll({ where: { receiptId: id } })
                if (res.receiptDetail && res.receiptDetail.length > 0) {
                    for (let i = 0; i < res.receiptDetail.length; i++) {
                        let productDetailSize = await db.ProductDetailSize.findOne({
                            where: { id: res.receiptDetail[i].productDetailSizeId },
                            include: [
                                { model: db.Allcode, as: 'sizeData', attributes: ['value', 'code'] },
                            ],
                            raw: true,
                            nest: true
                        })
                        res.receiptDetail[i].productDetailSizeData = productDetailSize
                        res.receiptDetail[i].productDetailData = await db.ProductDetail.findOne({ where: { id: productDetailSize.productdetailId } })
                        res.receiptDetail[i].productData = await db.Product.findOne({ where: { id: res.receiptDetail[i].productDetailData.productId } })
                    }
                }
                resolve({
                    errCode: 0,
                    data: res
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllReceipt = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let objectFilter = {
                order: [['createdAt', 'DESC']]
            }
            if (data.limit && data.offset) {
                objectFilter.limit = +data.limit
                objectFilter.offset = +data.offset
            }
            let res = await db.Receipt.findAndCountAll(objectFilter)
            for (let i = 0; i < res.rows.length; i++) {
                res.rows[i].userData = await db.User.findOne({ where: { id: res.rows[i].userId } })
                res.rows[i].supplierData = await db.Supplier.findOne({ where: { id: res.rows[i].supplierId } })
            }
            resolve({
                errCode: 0,
                data: res.rows,
                count: res.count
            })
        } catch (error) {
            reject(error)
        }
    })
}

let updateReceipt = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.date || !data.supplierId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let receipt = await db.Receipt.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (receipt) {
                    receipt.supplierId = data.supplierId;
                    await receipt.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

const deleteDetailReceipt = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let detailReceipt = await db.ReceiptDetail.findOne({
                    where: {
                        id: id,
                        status: 0
                    }
                })
                if (detailReceipt) {
                    await db.ReceiptDetail.destroy({
                        where: { id: id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteReceipt = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let receipt = await db.Receipt.findOne({
                    where: {
                        id: data.id,
                        status: 0
                    }
                })
                if (receipt) {
                    await db.Receipt.destroy({
                        where: { id: data.id }
                    })
                    const detailReceipt = await db.ReceiptDetail.findAll({
                        where: {
                            receiptId: data.id,
                            status: 0
                        }
                    })
                    detailReceipt.forEach(async element => {
                        await deleteDetailReceipt(element.id)
                    });
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createNewReceipt: createNewReceipt,
    getDetailReceiptById: getDetailReceiptById,
    getAllReceipt: getAllReceipt,
    updateReceipt: updateReceipt,
    deleteReceipt: deleteReceipt,
    createNewReceiptDetail: createNewReceiptDetail,
    deleteDetailReceipt: deleteDetailReceipt
}