import express from 'express';
import DeletedImagesController from '../app/controllers/DeletedImagesController.js'
import auth from "../middleware/auth.js";
const router = express.Router();
router.all("*", auth);
router.get('/', DeletedImagesController.showAllDeletedImages);
router.post('/restore/multiple', DeletedImagesController.restoreMultipleDeletedImage);
router.post('/multiple', DeletedImagesController.removeMultipleDeletedImages);
router.delete('/restore/:id', DeletedImagesController.restoreDeletedImages);
router.delete('/:id', DeletedImagesController.removeDeletedImage);


export default router;