import express from 'express';;
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Authentication from '../models/Authentication.js';

const router = express.Router();

// Đăng kí
router.post('/register', async (req, res) => {
    try {
        const validUsername = await User.findOne({ email: req.body.email });

        if (validUsername) {
            return res.status(400).json({
                success: false,
                message: 'Email đã tồn tại'
            })
        }
        
        const newUser = new User(req.body);
        const savedUser = await newUser.save();

        res.status(200).json({
            success: true, 
            message: 'Đăng kí thành công', 
            data: savedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
})


// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false, 
                message: 'Email không chính xác', 
            })
        }

        const passwordValid = user.password === req.body.password;
        if (!passwordValid)(
            res.status(403).json({
                success: false, 
                message: 'Mật khẩu không chính xác', 
            })
        )
        else {
             // tạo token
             const data = { userId: user._id, isAdmin: user.isAdmin };
             const newToken = jwt.sign(data, 'token_key');
 
             // tìm trong bảng Authentication, user vừa đăng nhập đã có token hay chưa
             const authentication  = await Authentication.findOne({ userId: user._id });
 
             // nếu có => cập nhập lại token đó cho user vừa đăng nhập
             if (authentication) {
                authentication.token = newToken;
                await authentication.save();
             // nếu không => tạo token mới cho user vừa đăng nhập
             } else {
                const newAuthentication = new Authentication({ userId: user._id, token: newToken });
                await newAuthentication.save();
             }

            res.status(200).json({ 
                success: true, 
                message: 'Đăng nhập thành công', 
                data: { user, token: newToken }
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

// Đăng xuất
router.delete('/logout/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const deletedToken = await Authentication.findOneAndDelete({ userId });
        if (deletedToken) {
            res.status(200).json({ message: 'Đăng xuất thành công' });
        } else {
            res.status(404).json({ message: 'Đăng xuất không thành công' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
});


export default router;