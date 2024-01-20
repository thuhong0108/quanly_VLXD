import jwt from 'jsonwebtoken';
import Authentication from '../models/Authentication.js';

export const verifyPermission = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Không tìm thấy token"
        });
    }

    const extistToken = await Authentication.findOne({ token });
    if (!extistToken) {
        return res.status(403).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }

    try {
        const data = jwt.verify(token, 'token_key');
        if (data.isAdmin) {
            next();
        } else {
            res.status(403).json({ 
                success: false,
                message: 'Bạn không phải phải là admin'
            });
        }

    } catch (error) {
        res.status(403).json({
            success: false,
            message: error.message
        });
    }
}