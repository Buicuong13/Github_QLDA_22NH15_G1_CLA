import AuthenService from '../services/AuthenService.js';

class RegisterController {
    async register(req, res) {
        try {
            const data = req.body;
            const result = await AuthenService.register(data);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error during registration:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new RegisterController();
