import express from 'express';
import Albums_ImagesController from '../app/controllers/Albums_ImagesController.js';
// import delay from "../middleware/auth.js";

const router = express.Router();
// router.all("*", delay);

router.get('/', Albums_ImagesController.getAllImageswithId_album);

router.post('/', Albums_ImagesController.addImagesToAlbum);

export default router;