import Product from "../models/Product.js";

// Hàm lấy tất cả sản phẩm
async function getAllProducts() {
    try {
        const products = await Product.find();
        return products;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Hàm lấy sản phẩm theo ID
async function getProductById(productId) {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
}

export { getAllProducts, getProductById };