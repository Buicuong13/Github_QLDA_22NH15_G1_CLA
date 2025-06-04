import express from 'express';
import IdentifyController from '../app/controllers/IdentifyController.js'
const router = express.Router();

router.get('/:id', IdentifyController.findIdentify);

router.post('/', IdentifyController.postIdentify);

router.put('/', IdentifyController.confirmNewPassword);

export default router;