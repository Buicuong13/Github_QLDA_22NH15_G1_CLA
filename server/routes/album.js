const express = require('express');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();
const db = require('../models/db');
const cloudinary = require('cloudinary').v2;
const archiver = require('archiver');
const axios = require('axios');

// Cấu hình Cloudinary (thêm vào đầu file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Album model (bảng album)
const Album = db.define('album', {}, { tableName: 'album', timestamps: false });
// Image model (bảng images)
const Image = db.define('images', {}, { tableName: 'images', timestamps: false });

// GET /api/album - lấy danh sách album của user
router.get('/', auth, async (req, res) => {
  try {
    const albums = await db.query(
      'SELECT * FROM album WHERE userId = ?',
      { replacements: [req.user.id], type: db.QueryTypes.SELECT }
    );
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/album - tạo album mới
router.post('/', auth, async (req, res) => {
  try {
    const { albumName, description } = req.body;
    const location = require('crypto').randomUUID();
    const [result] = await db.query(
      'INSERT INTO album (userId, albumName, description, location, createdAt) VALUES (?, ?, ?, ?, NOW())',
      { replacements: [req.user.id, albumName, description, location] }
    );
    const [album] = await db.query('SELECT * FROM album WHERE id = LAST_INSERT_ID()', { type: db.QueryTypes.SELECT });
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/album/:id - sửa album
router.put('/:id', auth, async (req, res) => {
  try {
    const { albumName, description } = req.body;
    await db.query(
      'UPDATE album SET albumName = ?, description = ? WHERE id = ? AND userId = ?',
      { replacements: [albumName, description, req.params.id, req.user.id] }
    );
    const [album] = await db.query('SELECT * FROM album WHERE id = ?', { replacements: [req.params.id], type: db.QueryTypes.SELECT });
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/album/:id - xóa album
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM album WHERE id = ? AND userId = ?', { replacements: [req.params.id, req.user.id] });
    res.json({ message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/image - lấy danh sách ảnh của user
router.get('/image', auth, async (req, res) => {
  try {
    const images = await db.query(
      'SELECT * FROM images WHERE userId = ?',
      { replacements: [req.user.id], type: db.QueryTypes.SELECT }
    );
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/image - thêm ảnh mới
router.post('/image', auth, async (req, res) => {
  try {
    const { url, fileName, fileSize, fileWidth, fileHeight, fileFormat, albumId } = req.body;
    const [result] = await db.query(
      'INSERT INTO images (userId, url, fileName, fileSize, fileWidth, fileHeight, fileFormat, uploadDate) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      { replacements: [req.user.id, url, fileName, fileSize, fileWidth, fileHeight, fileFormat] }
    );
    const [image] = await db.query('SELECT * FROM images WHERE id = LAST_INSERT_ID()', { type: db.QueryTypes.SELECT });
    // Nếu có albumId thì thêm vào album_images
    if (albumId) {
      await db.query('INSERT INTO album_images (albumId, imageId) VALUES (?, ?)', { replacements: [albumId, image.id] });
    }
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/image/:id - lấy thông tin ảnh để sửa
router.get('/image/:id', auth, async (req, res) => {
  try {
    // Lấy thông tin ảnh hiện tại
    const [image] = await db.query(
      'SELECT i.*, a.albumId FROM images i LEFT JOIN album_images a ON i.id = a.imageId WHERE i.id = ? AND i.userId = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    if (!image) {
      return res.status(404).json({ message: 'Ảnh không tồn tại hoặc không có quyền truy cập' });
    }

    res.json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/image/:id - sửa thông tin ảnh
router.put('/image/:id', auth, async (req, res) => {
  try {
    const { fileName, albumId } = req.body;
    
    // Kiểm tra ảnh tồn tại và thuộc về user
    const [image] = await db.query(
      'SELECT * FROM images WHERE id = ? AND userId = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    if (!image) {
      return res.status(404).json({ message: 'Ảnh không tồn tại hoặc không có quyền truy cập' });
    }

    // Kiểm tra nếu tên file không thay đổi
    if (fileName === image.fileName) {
      return res.json(image);
    }

    // Cập nhật tên file mới
    await db.query(
      'UPDATE images SET fileName = ? WHERE id = ? AND userId = ?',
      { replacements: [fileName, req.params.id, req.user.id] }
    );

    // Xử lý thay đổi album
    if (albumId) {
      // Xóa liên kết album cũ (nếu có)
      await db.query('DELETE FROM album_images WHERE imageId = ?', 
        { replacements: [req.params.id] }
      );
      
      // Thêm vào album mới
      await db.query('INSERT INTO album_images (albumId, imageId) VALUES (?, ?)', 
        { replacements: [albumId, req.params.id] }
      );
    }

    // Lấy thông tin ảnh sau khi cập nhật
    const [updatedImage] = await db.query(
      'SELECT i.*, a.albumId FROM images i LEFT JOIN album_images a ON i.id = a.imageId WHERE i.id = ?',
      { replacements: [req.params.id], type: db.QueryTypes.SELECT }
    );

    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/image/:id - xóa ảnh và lưu vào deleted_images
router.delete('/image/:id', auth, async (req, res) => {
  try {
    // Lấy thông tin ảnh cần xóa
    const [image] = await db.query(
      'SELECT i.*, a.albumId FROM images i LEFT JOIN album_images a ON i.id = a.imageId WHERE i.id = ? AND i.userId = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    if (!image) {
      return res.status(404).json({ message: 'Ảnh không tồn tại hoặc không có quyền truy cập' });
    }

    // Xóa ảnh khỏi Cloudinary
    const publicId = image.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    // Xóa liên kết với album (nếu có)
    await db.query('DELETE FROM album_images WHERE imageId = ?', 
      { replacements: [req.params.id] }
    );

    // Lưu thông tin ảnh vào bảng deleted_images
    await db.query(
      'INSERT INTO deleted_images (id, url, fileName, fileSize, fileWidth, fileHeight, fileFormat, deletedBy, deletedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      {
        replacements: [
          image.id,
          image.url,
          image.fileName,
          image.fileSize,
          image.fileWidth,
          image.fileHeight,
          image.fileFormat,
          req.user.id
        ]
      }
    );

    // Xóa ảnh khỏi bảng images
    await db.query('DELETE FROM images WHERE id = ? AND userId = ?', 
      { replacements: [req.params.id, req.user.id] }
    );

    res.json({ message: 'Ảnh đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/album/add-image - thêm ảnh vào album
router.post('/add-image', auth, async (req, res) => {
  try {
    const { albumId, imageId } = req.body;

    // Kiểm tra album và ảnh có tồn tại không
    const [album] = await db.query('SELECT * FROM album WHERE id = ?', { replacements: [albumId], type: db.QueryTypes.SELECT });
    const [image] = await db.query('SELECT * FROM images WHERE id = ?', { replacements: [imageId], type: db.QueryTypes.SELECT });

    if (!album) return res.status(404).json({ message: 'Album không tồn tại' });
    if (!image) return res.status(404).json({ message: 'Ảnh không tồn tại' });

    // Thêm ảnh vào album
    await db.query('INSERT INTO album_images (albumId, imageId) VALUES (?, ?)', { replacements: [albumId, imageId] });

    res.status(200).json({ message: 'Thêm ảnh vào album thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/album/:id/images - lấy danh sách ảnh trong album
router.get('/:id/images', auth, async (req, res) => {
  try {
    // Kiểm tra album tồn tại và thuộc về user
    const [album] = await db.query(
      'SELECT * FROM album WHERE id = ? AND userId = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    if (!album) {
      return res.status(404).json({ message: 'Album không tồn tại hoặc không có quyền truy cập' });
    }

    // Lấy danh sách ảnh với phân trang
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Lấy tổng số ảnh chỉ của user hiện tại
    const [{ total }] = await db.query(
      'SELECT COUNT(*) as total FROM images i INNER JOIN album_images ai ON i.id = ai.imageId WHERE ai.albumId = ? AND i.userId = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    // Lấy danh sách ảnh với sắp xếp và phân trang, chỉ lấy ảnh của user hiện tại
    const sortField = req.query.sortBy || 'uploadDate';
    const sortOrder = req.query.order || 'DESC';
    const images = await db.query(
      `SELECT i.* FROM images i 
       INNER JOIN album_images ai ON i.id = ai.imageId 
       WHERE ai.albumId = ? AND i.userId = ?
       ORDER BY i.${sortField} ${sortOrder}
       LIMIT ? OFFSET ?`,
      { 
        replacements: [req.params.id, req.user.id, limit, offset],
        type: db.QueryTypes.SELECT 
      }
    );

    res.json({
      images,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/album/:id/stats - lấy thống kê về album
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const [stats] = await db.query(
      `SELECT 
        COUNT(i.id) as totalImages,
        SUM(i.fileSize) as totalSize,
        MIN(i.uploadDate) as oldestImage,
        MAX(i.uploadDate) as newestImage
       FROM album a
       LEFT JOIN album_images ai ON a.id = ai.albumId
       LEFT JOIN images i ON ai.imageId = i.id
       WHERE a.id = ? AND a.userId = ?
       GROUP BY a.id`,
      { 
        replacements: [req.params.id, req.user.id],
        type: db.QueryTypes.SELECT 
      }
    );

    if (!stats) {
      return res.status(404).json({ message: 'Album không tồn tại hoặc không có quyền truy cập' });
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/album/:id/images - xóa nhiều ảnh khỏi album
router.delete('/:id/images', auth, async (req, res) => {
  try {
    const { imageIds } = req.body; // Mảng các ID ảnh cần xóa
    
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ message: 'Danh sách ảnh không hợp lệ' });
    }

    // Kiểm tra album tồn tại và thuộc về user
    const [album] = await db.query(
      'SELECT * FROM album WHERE id = ? AND userId = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    if (!album) {
      return res.status(404).json({ message: 'Album không tồn tại hoặc không có quyền truy cập' });
    }

    // Xóa các ảnh khỏi album_images
    await db.query(
      'DELETE FROM album_images WHERE albumId = ? AND imageId IN (?)',
      { replacements: [req.params.id, imageIds] }
    );

    res.json({ message: 'Đã xóa ảnh khỏi album thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trash - lấy danh sách ảnh đã xóa
router.get('/trash', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    // Lấy tổng số ảnh đã xóa
    const [{ total }] = await db.query(
      'SELECT COUNT(*) as total FROM deleted_images WHERE deletedBy = ?',
      { replacements: [req.user.id], type: db.QueryTypes.SELECT }
    );

    // Lấy danh sách ảnh đã xóa với phân trang
    const deletedImages = await db.query(
      'SELECT * FROM deleted_images WHERE deletedBy = ? ORDER BY deletedAt DESC LIMIT ? OFFSET ?',
      { 
        replacements: [req.user.id, limit, offset],
        type: db.QueryTypes.SELECT 
      }
    );

    res.json({
      images: deletedImages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trash/:id/restore - khôi phục ảnh đã xóa
router.post('/trash/:id/restore', auth, async (req, res) => {
  try {
    // Lấy thông tin ảnh đã xóa
    const [deletedImage] = await db.query(
      'SELECT * FROM deleted_images WHERE id = ? AND deletedBy = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    if (!deletedImage) {
      return res.status(404).json({ message: 'Ảnh không tồn tại trong thùng rác' });
    }

    // Khôi phục ảnh vào bảng images
    await db.query(
      'INSERT INTO images (id, userId, url, fileName, fileSize, fileWidth, fileHeight, fileFormat, uploadDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      {
        replacements: [
          deletedImage.id,
          req.user.id,
          deletedImage.url,
          deletedImage.fileName,
          deletedImage.fileSize,
          deletedImage.fileWidth,
          deletedImage.fileHeight,
          deletedImage.fileFormat
        ]
      }
    );

    // Xóa khỏi bảng deleted_images
    await db.query('DELETE FROM deleted_images WHERE id = ?', {
      replacements: [req.params.id]
    });

    res.json({ message: 'Đã khôi phục ảnh thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/trash/:id - xóa vĩnh viễn ảnh
router.delete('/trash/:id', auth, async (req, res) => {
  try {
    // Kiểm tra ảnh tồn tại trong thùng rác
    const [deletedImage] = await db.query(
      'SELECT * FROM deleted_images WHERE id = ? AND deletedBy = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );

    if (!deletedImage) {
      return res.status(404).json({ message: 'Ảnh không tồn tại trong thùng rác' });
    }

    // Xóa ảnh từ Cloudinary nếu còn tồn tại
    try {
      const publicId = deletedImage.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryErr) {
      console.error('Lỗi khi xóa ảnh từ Cloudinary:', cloudinaryErr);
    }

    // Xóa khỏi bảng deleted_images
    await db.query('DELETE FROM deleted_images WHERE id = ?', {
      replacements: [req.params.id]
    });

    res.json({ message: 'Đã xóa ảnh vĩnh viễn' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/search - tìm kiếm ảnh
router.get('/search', auth, async (req, res) => {
  try {    const {
      query,          // Từ khóa tìm kiếm
      startDate,      // Ngày upload từ
      endDate,        // Ngày upload đến
      albumId,        // Lọc theo album
      sortBy = 'uploadDate',  // Sắp xếp theo trường
      order = 'DESC', // Thứ tự sắp xếp
      page = 1,       // Trang hiện tại
      limit = 12      // Số ảnh mỗi trang
    } = req.query;

    let conditions = ['userId = ?'];
    let params = [req.user.id];

    // Tìm theo tên file
    if (query) {
      conditions.push('fileName LIKE ?');
      params.push(`%${query}%`);
    }

    // Lọc theo thời gian
    if (startDate) {
      conditions.push('uploadDate >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('uploadDate <= ?');
      params.push(endDate);
    }

    // Lọc theo album
    if (albumId) {
      conditions.push('id IN (SELECT imageId FROM album_images WHERE albumId = ?)');
      params.push(albumId);
    }

    const whereClause = conditions.join(' AND ');

    // Đếm tổng số kết quả
    const [{ total }] = await db.query(
      `SELECT COUNT(*) as total FROM images WHERE ${whereClause}`,
      { replacements: params, type: db.QueryTypes.SELECT }
    );

    // Thêm LIMIT và OFFSET cho phân trang
    const offset = (page - 1) * limit;
    params.push(parseInt(limit), parseInt(offset));

    // Lấy kết quả với sắp xếp và phân trang
    const images = await db.query(
      `SELECT i.*, a.albumId 
       FROM images i 
       LEFT JOIN album_images a ON i.id = a.imageId 
       WHERE ${whereClause} 
       ORDER BY ${sortBy} ${order}
       LIMIT ? OFFSET ?`,
      { replacements: params, type: db.QueryTypes.SELECT }
    );

    res.json({
      images,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/album/:id/download - tải toàn bộ ảnh trong album dưới dạng zip
router.get('/:id/download', auth, async (req, res) => {
  try {
    // Kiểm tra album thuộc về user
    const [album] = await db.query('SELECT * FROM album WHERE id = ? AND userId = ?', {
      replacements: [req.params.id, req.user.id],
      type: db.QueryTypes.SELECT
    });
    if (!album) return res.status(404).json({ message: 'Album không tồn tại hoặc không có quyền truy cập' });

    // Lấy danh sách ảnh trong album
    const images = await db.query(
      'SELECT i.* FROM images i INNER JOIN album_images ai ON i.id = ai.imageId WHERE ai.albumId = ? AND i.userId = ?',
      { replacements: [req.params.id, req.user.id], type: db.QueryTypes.SELECT }
    );
    if (!images || images.length === 0) return res.status(404).json({ message: 'Album không có ảnh' });

    // Thiết lập header trả về file zip
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${album.albumName || 'album'}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    // Thêm từng ảnh vào file zip
    for (const img of images) {
      // Lấy file từ Cloudinary hoặc URL
      const response = await axios.get(img.url, { responseType: 'stream' });
      archive.append(response.data, { name: img.fileName || `${img.id}.jpg` });
    }
    await archive.finalize();
  } catch (err) {
    res.status(500).json({ message: 'Không thể tạo file zip cho album', error: err.message });
  }
});

module.exports = router;
