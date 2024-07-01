import receiptService from '../services/receiptService';

let createNewReceipt = async (req, res) => {
    try {
        let data = await receiptService.createNewReceipt(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailReceiptById = async (req, res) => {
    try {
        let data = await receiptService.getDetailReceiptById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllReceipt = async (req, res) => {
    try {
        let data = await receiptService.getAllReceipt(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let updateReceipt = async (req, res) => {
    try {
        let data = await receiptService.updateReceipt(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let deleteReceipt = async (req, res) => {
    try {
        let data = await receiptService.deleteReceipt(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

const deleteDetailReceipt = async (req, res) => {
    try {
        let data = await receiptService.deleteDetailReceipt(req.body?.id)
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let createNewReceiptDetail = async (req, res) => {
    try {
        let data = await receiptService.createNewReceiptDetail(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let importGoods = async (req, res) => {
    try {
        let data = await receiptService.importGoods(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

module.exports = {
    createNewReceipt: createNewReceipt,
    getDetailReceiptById: getDetailReceiptById,
    getAllReceipt: getAllReceipt,
    updateReceipt: updateReceipt,
    deleteReceipt: deleteReceipt,
    createNewReceiptDetail: createNewReceiptDetail,
    deleteDetailReceipt: deleteDetailReceipt,
    importGoods: importGoods
}