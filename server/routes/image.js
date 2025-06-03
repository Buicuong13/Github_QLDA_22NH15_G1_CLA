const express = require('express');
const { auth } = require('../middleware/auth');
const Image = require('../models/Image');
const { Album, AlbumImage } = require('../models/Album');
const DeletedImage = require('../models/DeletedImage');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Sequelize, Op } = require('sequelize');
const path = require('path');
const streamifier = require('streamifier');
const sequelize = require('../models/db');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dcvl3jxl0',
  upload_preset: 'demo-upload'
});

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max size
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all images for user
router.get('/', auth, async (req, res) => {
  try {
    const images = await Image.findAll({
      where: { userId: req.user.id },
      order: [['uploadDate', 'DESC']],
      include: [{
        model: Album,
        through: { attributes: [] },
        attributes: ['id', 'albumName']
      }]
    });
    res.json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload new image
router.post('/', auth, async (req, res) => {
  try {
    const { url, fileName, fileSize, fileWidth, fileHeight, fileFormat, albumId } = req.body;
    if (!url || !fileName || !fileName.trim()) {
      return res.status(400).json({ message: 'Missing required image data' });
    }

    // Save to database
    const image = await Image.create({
      userId: req.user.id,
      url: url,
      fileName: fileName.trim(),
      fileSize: fileSize,
      fileWidth: fileWidth,
      fileHeight: fileHeight,
      fileFormat: fileFormat,
      uploadDate: new Date()
    });

    // If albumId is provided, add image to album
    if (albumId) {
      await AlbumImage.create({
        albumId: albumId,
        imageId: image.id
      });
    }

    // Return the image with album info if any
    const imageWithAlbum = await Image.findByPk(image.id, {
      include: [{
        model: Album,
        through: { attributes: [] },
        attributes: ['id', 'albumName']
      }]
    });

    res.status(201).json(imageWithAlbum);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Edit image details
router.put('/:id', auth, async (req, res) => {
  try {
    const { fileName } = req.body;
    if (!fileName || !fileName.trim()) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const image = await Image.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    image.fileName = fileName.trim();
    await image.save();

    res.json(image);
  } catch (err) {
    console.error('Error updating image:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete image (raw SQL, soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Lấy thông tin ảnh
    const images = await sequelize.query(
      'SELECT * FROM images WHERE id = ? AND userId = ?',
      { replacements: [req.params.id, req.user.id], type: require('sequelize').QueryTypes.SELECT }
    );
    const image = images[0];
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // Kiểm tra đã có trong deleted_images chưa
    const deleted = await sequelize.query(
      'SELECT id FROM deleted_images WHERE id = ?',
      { replacements: [image.id], type: require('sequelize').QueryTypes.SELECT }
    );
    if (!deleted.length) {
      // Thêm vào deleted_images nếu chưa có
      await sequelize.query(
        'INSERT INTO deleted_images (id, url, fileName, fileSize, fileWidth, fileHeight, fileFormat, deletedBy, deletedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        { replacements: [
          image.id,
          image.url,
          image.fileName,
          image.fileSize,
          image.fileWidth,
          image.fileHeight,
          image.fileFormat,
          req.user.id
        ] }
      );
    }
    // Xóa tất cả các liên kết album_images trước khi xóa ảnh (tránh lỗi khóa ngoại)
    await sequelize.query(
      'DELETE FROM album_images WHERE imageId = ?',
      { replacements: [req.params.id] }
    );
    // Xóa khỏi images (chỉ cần theo id)
    await sequelize.query(
      'DELETE FROM images WHERE id = ?',
      { replacements: [req.params.id] }
    );
    res.json({ message: 'Image moved to trash successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Lấy danh sách ảnh đã xóa (thùng rác)
router.get('/deleted', auth, async (req, res) => {
  try {
    const deletedImages = await DeletedImage.findAll({
      where: { deletedBy: req.user.id },
      order: [['deletedAt', 'DESC']]
    });
    res.json(deletedImages);
  } catch (err) {
    console.error('Error fetching deleted images:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add image to album
router.post('/:id/album/:albumId', auth, async (req, res) => {
  try {
    // Check if image exists and belongs to user
    const image = await Image.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if album exists and belongs to user
    const album = await Album.findOne({
      where: {
        id: req.params.albumId,
        userId: req.user.id
      }
    });

    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    // Add image to album
    await AlbumImage.create({
      albumId: album.id,
      imageId: image.id
    });

    res.json({ message: 'Image added to album successfully' });
  } catch (err) {
    console.error('Error adding image to album:', err);
    res.status(500).json({ message: 'Failed to add image to album' });
  }
});

// Remove image from album
router.delete('/:id/album/:albumId', auth, async (req, res) => {
  try {
    const removed = await AlbumImage.destroy({
      where: {
        imageId: req.params.id,
        albumId: req.params.albumId
      }
    });

    if (!removed) {
      return res.status(404).json({ message: 'Image not found in album' });
    }

    res.json({ message: 'Image removed from album successfully' });
  } catch (err) {
    console.error('Error removing image from album:', err);
    res.status(500).json({ message: 'Failed to remove image from album' });
  }
});

// Lấy danh sách album chứa một ảnh cụ thể
router.get('/:id/album', auth, async (req, res) => {
  try {
    // Kiểm tra ảnh có thuộc user không
    const image = await Image.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    // Lấy danh sách album chứa ảnh này
    const albums = await sequelize.query(
      `SELECT a.id, a.albumName FROM album a
       JOIN album_images ai ON a.id = ai.albumId
       WHERE ai.imageId = ? AND a.userId = ?`,
      { replacements: [req.params.id, req.user.id], type: require('sequelize').QueryTypes.SELECT }
    );
    res.json(albums);
  } catch (err) {
    console.error('Error fetching album for image:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Khôi phục ảnh đã xoá (restore from trash)
router.post('/restore', auth, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: 'Missing image id' });
    }
    // Lấy thông tin ảnh đã xoá
    const deletedImage = await DeletedImage.findOne({ where: { id, deletedBy: req.user.id } });
    if (!deletedImage) {
      return res.status(404).json({ message: 'Deleted image not found' });
    }
    // Khôi phục về images
    await sequelize.query(
      'INSERT INTO images (id, url, fileName, fileSize, fileWidth, fileHeight, fileFormat, userId, uploadDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      { replacements: [
        deletedImage.id,
        deletedImage.url,
        deletedImage.fileName,
        deletedImage.fileSize,
        deletedImage.fileWidth,
        deletedImage.fileHeight,
        deletedImage.fileFormat,
        req.user.id
      ] }
    );
    // Xoá khỏi deleted_images
    await DeletedImage.destroy({ where: { id } });
    res.json({ message: 'Image restored successfully' });
  } catch (err) {
    console.error('Error restoring image:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Xoá vĩnh viễn ảnh trong thùng rác (permanent delete)
router.delete('/deleted/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    // Kiểm tra ảnh đã xoá có thuộc user không
    const deletedImage = await DeletedImage.findOne({ where: { id, deletedBy: req.user.id } });
    if (!deletedImage) {
      return res.status(404).json({ message: 'Deleted image not found' });
    }
    // Xoá vĩnh viễn
    await DeletedImage.destroy({ where: { id } });
    res.json({ message: 'Image permanently deleted' });
  } catch (err) {
    console.error('Error permanently deleting image:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
