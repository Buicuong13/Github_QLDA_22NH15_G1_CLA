import IdentifyService from '../services/IdentifyService.js';

class IdentifyController {
    // Lấy thông tin mã xác nhận
    async findIdentify(req, res) {
        try {
            const { id } = req.params;
            const result = await IdentifyService.getIdentify(id);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error retrieving identification data:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Gửi email chứa mã xác nhận
    async postIdentify(req, res) {
        try {
            const { email } = req.body;
            const result = await IdentifyService.handleSendMail(email);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error processing email request:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Cập nhật mật khẩu mới
    async confirmNewPassword(req, res) {
        try {
            const { username, email, newPassword } = req.body;
            const result = await IdentifyService.updateNewPassword(username, email, newPassword);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error updating user password:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new IdentifyController();
