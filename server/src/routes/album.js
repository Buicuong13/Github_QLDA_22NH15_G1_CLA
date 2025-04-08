import express from 'express';
import AlbumController from '../app/controllers/AlbumController.js'
import auth from "../middleware/auth.js";
const router = express.Router();
router.all("*", auth);

router.get('/:id', AlbumController.showAlbumDetail);
router.get('/', AlbumController.showAllAlbums);
router.post('/', AlbumController.createNewAlbum);
router.delete('/:id', AlbumController.deleteAlbum);
router.put('/:id', AlbumController.updateAlbum);

export default router;