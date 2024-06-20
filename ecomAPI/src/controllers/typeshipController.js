import typeshipService from '../services/typeshipService';

let createNewTypeShip = async (req, res) => {
    try {
        let data = await typeshipService.createNewTypeShip(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailTypeshipById = async (req, res) => {
    try {
        let data = await typeshipService.getDetailTypeshipById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllTypeship = async (req, res) => {
    try {
        let data = await typeshipService.getAllTypeship(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let updateTypeship = async (req, res) => {
    try {
        let data = await typeshipService.updateTypeship(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let deleteTypeship = async (req, res) => {
    try {
        let data = await typeshipService.deleteTypeship(req.body);
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
    createNewTypeShip: createNewTypeShip,
    getDetailTypeshipById: getDetailTypeshipById,
    getAllTypeship: getAllTypeship,
    updateTypeship: updateTypeship,
    deleteTypeship: deleteTypeship
}