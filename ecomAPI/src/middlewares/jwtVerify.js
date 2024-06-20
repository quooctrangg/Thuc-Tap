const jwt = require('jsonwebtoken')
import db from "../models/index";
require('dotenv').config();
const secretString = process.env.JWT_SECRET

const middlewareControllers = {
    verifyTokenUser: (req, res, next) => {
        const token = req.headers.authorization
        if (token) {
            const accessToken = token.split(' ')[1]
            jwt.verify(accessToken, secretString, async (err, payload) => {
                if (err) {
                    return res.status(403).json({
                        status: false,
                        errMessage: 'Token không hợp lệ!',
                        refresh: true,
                    })
                }
                const user = await db.User.findOne({ where: { id: payload.sub } })
                if (!user) {
                    return res.status(404).json({
                        status: false,
                        errMessage: 'Người dùng không tồn tại!',
                        refresh: true,
                    })
                }
                if (user.statusId !== 'S1') {
                    return res.status(404).json({
                        status: false,
                        errMessage: 'Tài khoản đã bị khóa!',
                        refresh: true
                    })
                }
                req.user = user
                next()
            })
        } else {
            return res.status(401).json({
                status: false,
                message: "Bạn không xác thực!",
                refresh: true,
            })
        }
    },

    verifyTokenAdmin: (req, res, next) => {
        const token = req.headers.authorization
        if (token) {
            const accessToken = token.split(' ')[1]
            jwt.verify(accessToken, secretString, async (err, payload) => {
                if (err) {
                    return res.status(403).json({
                        status: false,
                        errMessage: 'Token không hợp lệ!',
                        refresh: true,
                    })
                }
                const user = await db.User.findOne({ where: { id: payload.sub } })
                if (!user) {
                    return res.status(404).json({
                        status: false,
                        errMessage: 'Người dùng không tồn tại!',
                        refresh: true,
                    })
                }
                if (user && (user.roleId == 'R4' || user.roleId == 'R1')) {
                    req.user = user
                    next()
                } else {
                    return res.status(404).json({
                        status: false,
                        errMessage: 'Bạn không có đủ quyền',
                        refresh: true,
                    })
                }
            })
        } else {
            return res.status(401).json({
                status: false,
                errMessage: "Bạn không xác thực!",
                refresh: true,
            })
        }
    },
}

module.exports = middlewareControllers