import User from "../models/User.js";

// Hàm lấy tất cả user
async function getAllUsers() {
    try {
        const products = await User.find();
        return products;
    } catch (error) {
        throw new Error(error.message);
    }
}

export { getAllUsers };