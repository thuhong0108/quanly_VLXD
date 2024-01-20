import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true
    },
    address: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        min: 0,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: { 
        type: String,
        enum: [ 'Đang chờ', 'Đang giao', 'Đã giao' ],
        default: 'Đang chờ'
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
