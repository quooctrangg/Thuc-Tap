import productService from '../services/productService';

let createNewProduct = async (req, res) => {
    try {
        let data = await productService.createNewProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllProductAdmin = async (req, res) => {
    try {
        let data = await productService.getAllProductAdmin(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllProductUser = async (req, res) => {
    try {
        let data = await productService.getAllProductUser(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let UnactiveProduct = async (req, res) => {
    try {
        let data = await productService.UnactiveProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let ActiveProduct = async (req, res) => {
    try {
        let data = await productService.ActiveProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailProductById = async (req, res) => {
    try {
        let data = await productService.getDetailProductById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let updateProduct = async (req, res) => {
    try {
        let data = await productService.updateProduct(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllProductDetailById = async (req, res) => {
    try {
        let data = await productService.getAllProductDetailById(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllProductDetailImageById = async (req, res) => {
    try {
        let data = await productService.getAllProductDetailImageById(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let createNewProductDetail = async (req, res) => {
    try {
        let data = await productService.createNewProductDetail(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let updateProductDetail = async (req, res) => {
    try {
        let data = await productService.updateProductDetail(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailProductDetailById = async (req, res) => {
    try {
        let data = await productService.getDetailProductDetailById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let createNewProductDetailImage = async (req, res) => {
    try {
        let data = await productService.createNewProductDetailImage(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailProductImageById = async (req, res) => {
    try {
        let data = await productService.getDetailProductImageById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let updateProductDetailImage = async (req, res) => {
    try {
        let data = await productService.updateProductDetailImage(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let deleteProductDetailImage = async (req, res) => {
    try {
        let data = await productService.deleteProductDetailImage(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let deleteProductDetail = async (req, res) => {
    try {
        let data = await productService.deleteProductDetail(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getAllProductDetailSizeById = async (req, res) => {
    try {
        let data = await productService.getAllProductDetailSizeById(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let createNewProductDetailSize = async (req, res) => {
    try {
        let data = await productService.createNewProductDetailSize(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getDetailProductDetailSizeById = async (req, res) => {
    try {
        let data = await productService.getDetailProductDetailSizeById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let updateProductDetailSize = async (req, res) => {
    try {
        let data = await productService.updateProductDetailSize(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let deleteProductDetailSize = async (req, res) => {
    try {
        let data = await productService.deleteProductDetailSize(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getProductFeature = async (req, res) => {
    try {
        let data = await productService.getProductFeature(req.query.limit);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getProductNew = async (req, res) => {
    try {
        let data = await productService.getProductNew(req.query.limit);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getProductShopCart = async (req, res) => {
    try {
        let data = await productService.getProductShopCart(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ máy chủ'
        })
    }
}

let getProductRecommend = async (req, res) => {
    try {
        let data = await productService.getProductRecommend(req.query);
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
    createNewProduct: createNewProduct,
    getAllProductAdmin: getAllProductAdmin,
    getAllProductUser: getAllProductUser,
    UnactiveProduct: UnactiveProduct,
    ActiveProduct: ActiveProduct,
    getDetailProductById: getDetailProductById,
    updateProduct: updateProduct,
    getAllProductDetailById: getAllProductDetailById,
    getAllProductDetailImageById: getAllProductDetailImageById,
    createNewProductDetail: createNewProductDetail,
    updateProductDetail: updateProductDetail,
    getDetailProductDetailById: getDetailProductDetailById,
    createNewProductDetailImage: createNewProductDetailImage,
    getDetailProductImageById: getDetailProductImageById,
    updateProductDetailImage: updateProductDetailImage,
    deleteProductDetailImage: deleteProductDetailImage,
    deleteProductDetail: deleteProductDetail,
    getAllProductDetailSizeById: getAllProductDetailSizeById,
    createNewProductDetailSize: createNewProductDetailSize,
    getDetailProductDetailSizeById: getDetailProductDetailSizeById,
    updateProductDetailSize: updateProductDetailSize,
    deleteProductDetailSize: deleteProductDetailSize,
    getProductFeature: getProductFeature,
    getProductNew: getProductNew,
    getProductShopCart: getProductShopCart,
    getProductRecommend: getProductRecommend
}