import express from "express";
import LoginController from '../app/controllers/LoginController.js'
import auth from "../middleware/auth.js";
const router = express.Router();
router.all("*", auth);
router.post('/', LoginController.login);

export default router;



