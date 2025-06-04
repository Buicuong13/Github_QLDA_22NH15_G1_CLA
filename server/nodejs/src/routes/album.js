import express from 'express';
import AlbumController from '../app/controllers/AlbumController.js'
import auth from "../middleware/auth.js";
const router = express.Router();
router.all("*", auth);

// router.get('/:id', AlbumController.showAlbumDetail);
// Route lấy chi tiết album, kiểm tra bảo mật
router.get("/:id", async (req, res, next) => {
    // Lấy thông tin album
    const albumDetail = await AlbumController.getAlbumDetailRaw(req.params.id);
    console.log('Album detail:', albumDetail.isPrivate);
    if (albumDetail.isPrivate === 1) {
        // Nếu là album bảo mật (isPrivate = 1), chạy middleware checkface
        // return checkface(req, res, () => AlbumController.showAlbumDetail(req, res));
        // Nếu mà checkface đúng thì chuyển qua hàm showAlbumDetail ở check face sẽ xây dựng 
        // hàm kiểm tra khuôn mặt và tạo 1 foder chứa khuôn mặt trong đó 
        return res.status(403).json({
            requireFaceAuth: true,
            message: "Album này yêu cầu xác thực khuôn mặt trước khi truy cập."
        });
    } else {
        // Nếu không bảo mật (isPrivate = 0), trả về luôn
        return AlbumController.showAlbumDetail(req, res);
    }
});

router.get('/', AlbumController.showAllAlbums);
router.post('/', AlbumController.createNewAlbum);
router.delete('/:id', AlbumController.deleteAlbum);
router.put('/:id', AlbumController.updateAlbum);

export default router;