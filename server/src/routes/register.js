import express from 'express';
import RegisterController from '../app/controllers/RegisterController.js'
const router = express.Router();

router.post('/', RegisterController.register);

export default router;