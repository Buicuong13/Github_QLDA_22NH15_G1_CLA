import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import Identify from '../models/Identify.js';
import User from '../models/User.js';
import createError from '../../utils/errorUtils.js';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateResetId = () => Math.floor(100000 + Math.random() * 900000).toString();

const IdentifyService = {
    // Kiểm tra mã xác nhận
    getIdentify: async (idCode) => {
        try {
            const identify = await Identify.getIdentify(idCode);
            if (!identify) {
                throw createError('ID code not found', 404);
            }
            return { message: 'ID code exists' };
        } catch (error) {
            console.error('Error in getIdentify:', error);
            throw error;
        }
    },
    // Gửi email chứa mã xác nhận
    handleSendMail: async (email) => {
        try {
            const idCode = generateResetId(); // Tạo mã xác nhận
            await Identify.create(email, idCode); // Lưu mã xác nhận vào cơ sở dữ liệu

            const msg = {
                to: email,
                from: 'cuong1372004@gmail.com', // Địa chỉ email gửi mã xác nhận
                subject: 'Password Reset Confirmation Code',
                text: `Your confirmation code is: ${idCode}`,
            };

            await sgMail.send(msg); // Gửi email

            // Xóa mã xác nhận sau 5 phút
            setTimeout(async () => {
                try {
                    await Identify.deleteById(idCode);
                } catch (error) {
                    console.error(`Error deleting ID code ${idCode}:`, error);
                }
            }, 300000); // 300,000 ms = 5 phút

            return { message: 'ID code has been sent' };
        } catch (error) {
            console.error('Error in handleSendMail:', error);
            throw error;
        }
    },
    // Cập nhật mật khẩu mới
    updateNewPassword: async (username, email, newPassword) => {
        try {
            const user = await User.findByUsername(username); // Tìm người dùng theo tên đăng nhập
            if (!user) {
                throw createError('User not found', 404);
            }
            const userId = user.id; // Lấy ID người dùng
            const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash mật khẩu mới
            const data = {
                email: email,
                password: hashedPassword,
            };
            // Cập nhật mật khẩu
            const updatePassword = await User.update(userId, data);
            if (!updatePassword) {
                throw createError('Failed to update user data', 500);
            }

            return { message: 'Password updated successfully' };
        } catch (error) {
            console.error('Error in updateNewPassword:', error);
            throw error;
        }
    },
};

export default IdentifyService;
