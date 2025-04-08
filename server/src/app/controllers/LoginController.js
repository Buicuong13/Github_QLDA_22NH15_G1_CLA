import AuthenService from '../services/AuthenService.js';

class LoginController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await AuthenService.login(username, password);
            return res.status(200).json({
                message: result.message,
                token: result.token,
                user: result.user
            })
        } catch (error) {
            console.error(error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new LoginController();
