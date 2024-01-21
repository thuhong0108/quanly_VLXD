import express from "express";
import Order from "../models/Order.js";
import OrderDetails from "../models/OrderDetails.js";
import { getAllUsers } from "../services/User.js";
import User from "../models/User.js";

const router = express.Router();

// Lấy tất cả các đơn hàng
router.get('/', async (req, res) => {
    try {
        let orders = await Order.find();
        const users = await getAllUsers();
        //lấy tất cả user
        orders = orders.map(order => {
            const user = users.find(user => user._id == order.userId);
            order = { ...order._doc, username: user.username }
            return order;
        })
        res.status(200).json({ 
            message: 'Lấy tất cả đơn hàng thành công', 
            data: orders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Đặt hàng
router.post('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = req.body[0]; // Thông tin khách hàng
        const products = req.body[1]; // Danh sách các sản phẩm được đặt hàng

        let orderItems = [];
        let totalPrice = 0;

        for (const product of products) {
            totalPrice += product.price * product.quantity;

            orderItems.push({
                productId: product._id,
                quantity: product.quantity,
                price: product.price,
            });
        }

        await User.findOneAndUpdate(
            { _id: userId },
            { phone: user.phone, address: user.address }
        )

        // Tạo và lưu đơn hàng vào database
        const newOrder = new Order({ userId, totalPrice, address: user.address });
        const savedOrder = await newOrder.save();

        orderItems = orderItems.map(item => {
            item.orderId = savedOrder._id;
            return item;
        });
        await OrderDetails.insertMany(orderItems);

        res.status(200).json({
            success: true,
            message: 'Đặt hàng thành công',
            data: savedOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;