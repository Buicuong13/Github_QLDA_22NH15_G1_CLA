import express from 'express';
import AlbumController from '../app/controllers/AlbumController.js'
import auth from "../middleware/auth.js";
const router = express.Router();
router.all("*", auth);

// Route xác nhận đã xác thực khuôn mặt cho album (lưu vào session)
router.post('/face-auth/:id', (req, res) => {
    if (!req.session) req.session = {};
    if (!req.session.faceAuth) req.session.faceAuth = {};
    req.session.faceAuth[req.params.id] = true;
    res.json({ success: true });
});

// Route lấy chi tiết album, kiểm tra bảo mật và xác thực khuôn mặt
router.get("/:id", async (req, res, next) => {
    // Lấy thông tin album
    const albumDetail = await AlbumController.getAlbumDetailRaw(req.params.id);
    const faceAuth = !!(req.session && req.session.faceAuth && req.session.faceAuth[req.params.id]);
    console.log('Album detail:', albumDetail.isPrivate);
    if (albumDetail.isPrivate === 1) {
        if (faceAuth) {
            // Đã xác thực, trả về chi tiết album kèm trạng thái xác thực
            return res.status(200).json({ ...albumDetail, faceAuth: true });
        } else {
            // Chưa xác thực, trả về 403
            return res.status(403).json({
                requireFaceAuth: true,
                message: "Album này yêu cầu xác thực khuôn mặt trước khi truy cập."
            });
        }
    } else {
        // Nếu không bảo mật (isPrivate = 0), trả về chi tiết album kèm trạng thái xác thực (nếu có)
        return res.status(200).json({ ...albumDetail, faceAuth });
    }
});

router.get('/', AlbumController.showAllAlbums);
router.post('/', AlbumController.createNewAlbum);
router.delete('/:id', AlbumController.deleteAlbum);
router.put('/:id', AlbumController.updateAlbum);

export default router;