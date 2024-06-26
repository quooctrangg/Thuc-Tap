import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';
import CommonUtils from '../utils/CommonUtils';
const { Op } = require("sequelize");
require('dotenv').config();
const salt = bcrypt.genSaltSync(10);

let buildUrlEmail = (token, userId) => {
    let result = `${process.env.URL_REACT}/verify-email?token=${token}&userId=${userId}`;
    return result;
}

let hashUserPasswordFromBcrypt = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleCreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.lastName) {
                resolve({
                    errCode: 2,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let check = await checkUserEmail(data.email);
                if (check === true) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Email của bạn đã được sử dụng, vui lòng thử email khác'
                    })
                } else {
                    let hashPassword = await hashUserPasswordFromBcrypt(data.password);
                    await db.User.create({
                        email: data.email,
                        password: hashPassword,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        roleId: 'R2',
                        genderId: data.genderId,
                        phonenumber: data.phonenumber,
                        image: data.avatar,
                        dob: data.dob,
                        isActiveEmail: 0,
                        statusId: 'S1',
                        usertoken: '',
                    })
                    resolve({
                        errCode: 0,
                        message: 'OK'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let unBanUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: `Thiếu tham số bắt buộc`
                })
            } else {
                let foundUser = await db.User.findOne({
                    where: { id: userId },
                    raw: false
                })
                if (!foundUser) {
                    resolve({
                        errCode: 2,
                        errMessage: `Người dùng không tồn tại`
                    })
                }
                foundUser.statusId = 'S1'
                await foundUser.save()
                resolve({
                    errCode: 0,
                    message: `Mở khóa người dùng thành công`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let banUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: `Thiếu tham số bắt buộc`
                })
            } else {
                let foundUser = await db.User.findOne({
                    where: { id: userId },
                    raw: false
                })
                if (!foundUser) {
                    resolve({
                        errCode: 2,
                        errMessage: `Tài khoản không tồn tại`
                    })
                }
                foundUser.statusId = 'S2'
                await foundUser.save()
                resolve({
                    errCode: 0,
                    message: `Khóa tài khoản thành công`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.genderId) {
                resolve({
                    errCode: 2,
                    errMessage: `Thiếu tham số bắt buộc`
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (user) {
                    user.firstName = data.firstName
                    user.lastName = data.lastName
                    user.address = data.address
                    user.genderId = data.genderId
                    user.phonenumber = data.phonenumber
                    user.dob = data.dob
                    if (data.image) {
                        user.image = data.image
                    }
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật thành công tài khoản'
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Người dùng không tồn tại'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password) {
                resolve({
                    errCode: 4,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            }
            else {
                let userData = {};
                let isExist = await checkUserEmail(data.email);
                if (isExist === true) {
                    let user = await db.User.findOne({
                        attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id', 'statusId'],
                        where: { email: data.email },
                        raw: true
                    })
                    if (user) {
                        if (user.statusId == 'S1') {
                            let check = await bcrypt.compareSync(data.password, user.password);
                            if (check) {
                                userData.errCode = 0;
                                userData.errMessage = 'Thành công';
                                delete user.password;
                                userData.user = user;
                                userData.accessToken = CommonUtils.encodeToken(user.id)
                            } else {
                                userData.errCode = 3;
                                userData.errMessage = 'Sai mật khẩu';
                            }
                        } else {
                            userData.errCode = 1
                            userData.errMessage = 'Tài khoản đã bị khóa'
                        }
                    } else {
                        userData.errCode = 2;
                        userData.errMessage = 'Người dùng không tồn tại'
                    }
                } else {
                    userData.errCode = 1;
                    userData.errMessage = `Email của bạn không tồn tại trong hệ thống của bạn. vui lòng thử email khác`
                }
                resolve(userData)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleChangePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.password || !data.oldpassword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (await bcrypt.compareSync(data.oldpassword, user.password)) {
                    if (user) {
                        user.password = await hashUserPasswordFromBcrypt(data.password);
                        await user.save();
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Mật khẩu cũ không chính xác'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUser = (data, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let objectFilter = {
                where: {
                    id: {
                        [Op.not]: userId
                    }
                },
                attributes: {
                    exclude: ['password', 'image']
                },
                include: [
                    { model: db.Allcode, as: 'roleData', attributes: ['value', 'code'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['value', 'code'] },
                ],
                order: [['createdAt', 'ASC']],
                raw: true,
                nest: true
            }
            if (data.limit && data.offset) {
                objectFilter.limit = +data.limit
                objectFilter.offset = +data.offset
            }
            if (data.keyword !== '') objectFilter.where = { ...objectFilter.where, phonenumber: { [Op.substring]: data.keyword } }
            let res = await db.User.findAndCountAll(objectFilter)
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

let getDetailUserById = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userid) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let res = await db.User.findOne({
                    where: { id: userid, statusId: 'S1' },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'roleData', attributes: ['value', 'code'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['value', 'code'] },
                    ],
                    raw: true,
                    nest: true
                })
                if (res.image) {
                    res.image = Buffer.from(res.image, 'base64').toString('binary');
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

let getDetailUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let res = await db.User.findOne({
                    where: { id: userid, statusId: 'S1' },
                    attributes: ['password']
                })
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

let handleSendVerifyEmailUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })
                if (user) {
                    let token = uuidv4();
                    user.usertoken = token;
                    await emailService.sendSimpleEmail({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        redirectLink: buildUrlEmail(token, user.id),
                        email: user.email,
                        type: 'verifyEmail'
                    })
                    await user.save();
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Thành công'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleVerifyEmailUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.id,
                        usertoken: data.token
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })
                if (user) {
                    user.isActiveEmail = 1
                    user.usertoken = "";
                    await user.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Người dùng không tồn tại'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleSendEmailForgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let check = await checkUserEmail(email)
                if (check === true) {
                    let user = await db.User.findOne({
                        where: { email: email },
                        attributes: {
                            exclude: ['password']
                        },
                        raw: false
                    })
                    if (user) {
                        let token = uuidv4();
                        user.usertoken = token;
                        await emailService.sendSimpleEmail({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            redirectLink: `${process.env.URL_REACT}/verify-forgotpassword?token=${token}&userId=${user.id}`,
                            email: user.email,
                            type: 'forgotpassword'
                        })
                        await user.save();
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'Thành công'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Email của bạn không tồn tại trong hệ thống của bạn. vui lòng thử email khác`
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.token || !data.password) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                })
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: data.id,
                        usertoken: data.token
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: false
                })
                if (user) {
                    user.password = await hashUserPasswordFromBcrypt(data.password);
                    user.usertoken = "";

                    await user.save();
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Thành công'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let checkPhonenumberEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let phone = await db.User.findOne({
                where: { phonenumber: data.phonenumber }
            })
            let email = await db.User.findOne({
                where: { email: data.email }
            })
            if (phone) {
                resolve({
                    isCheck: true,
                    errMessage: "Số điện thoại đã tồn tại"
                })
            }
            if (email) {
                resolve({
                    isCheck: true,
                    errMessage: "Email đã tồn tại"
                })
            }
            resolve({
                isCheck: false,
                errMessage: "Hợp lệ"
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleCreateNewUser: handleCreateNewUser,
    unBanUser: unBanUser,
    updateUserData: updateUserData,
    handleLogin: handleLogin,
    handleChangePassword: handleChangePassword,
    getAllUser: getAllUser,
    getDetailUserById: getDetailUserById,
    handleSendVerifyEmailUser: handleSendVerifyEmailUser,
    handleVerifyEmailUser: handleVerifyEmailUser,
    handleSendEmailForgotPassword: handleSendEmailForgotPassword,
    handleForgotPassword: handleForgotPassword,
    checkPhonenumberEmail: checkPhonenumberEmail,
    banUser: banUser
}