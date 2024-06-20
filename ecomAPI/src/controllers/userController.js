import userService from '../services/userService';

let handleCreateNewUser = async (req, res) => {
    try {
        let data = await userService.handleCreateNewUser(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleUpdateUser = async (req, res) => {
    try {
        let data = await userService.updateUserData(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleBanUser = async (req, res) => {
    try {
        let data = await userService.banUser(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleunBanUser = async (req, res) => {
    try {
        let data = await userService.unBanUser(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleLogin = async (req, res) => {
    try {
        let data = await userService.handleLogin(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleChangePassword = async (req, res) => {
    try {
        let data = await userService.handleChangePassword(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllUser = async (req, res) => {
    try {
        let data = await userService.getAllUser(req.query, req.user.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailUserById = async (req, res) => {
    try {
        let data = await userService.getDetailUserById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailUserByEmail = async (req, res) => {
    try {
        let data = await userService.getDetailUserByEmail(req.query.email);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleSendVerifyEmailUser = async (req, res) => {
    try {
        let data = await userService.handleSendVerifyEmailUser(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleVerifyEmailUser = async (req, res) => {
    try {
        let data = await userService.handleVerifyEmailUser(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleSendEmailForgotPassword = async (req, res) => {
    try {
        let data = await userService.handleSendEmailForgotPassword(req.body.email);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let handleForgotPassword = async (req, res) => {
    try {
        let data = await userService.handleForgotPassword(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let checkPhonenumberEmail = async (req, res) => {
    try {
        let data = await userService.checkPhonenumberEmail(req.query);
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
    handleCreateNewUser: handleCreateNewUser,
    handleUpdateUser: handleUpdateUser,
    handleBanUser: handleBanUser,
    handleLogin: handleLogin,
    handleChangePassword: handleChangePassword,
    getAllUser: getAllUser,
    getDetailUserById: getDetailUserById,
    handleSendVerifyEmailUser: handleSendVerifyEmailUser,
    handleVerifyEmailUser: handleVerifyEmailUser,
    handleSendEmailForgotPassword: handleSendEmailForgotPassword,
    handleForgotPassword: handleForgotPassword,
    checkPhonenumberEmail: checkPhonenumberEmail,
    getDetailUserByEmail: getDetailUserByEmail,
    handleunBanUser: handleunBanUser
}