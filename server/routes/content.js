const express = require('express');
const { auth } = require('../middleware/auth');
const Content = require('../models/Content');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const upload = multer();

// Get all content for user
router.get('/', auth, async (req, res) => {
  const content = await Content.findAll({ where: { userId: req.user.id } });
  res.json(content);
});

// Upload content
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {    const { title, description, fileName } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!fileName) return res.status(400).json({ message: 'File name is required' });
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    const result = await streamUpload(file.buffer);    const content = await Content.create({
      userId: req.user.id,
      title,
      description,
      fileName: fileName.trim(),
      fileUrl: result.secure_url,
      fileType: result.resource_type,
      cloudinaryId: result.public_id,
    });
    res.status(201).json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit content metadata
router.put('/:id', auth, async (req, res) => {
  try {
    const { fileName } = req.body;
    
    if (!fileName || fileName.trim() === '') {
      return res.status(400).json({ message: 'File name is required' });
    }

    // Tìm content hiện tại
    const content = await Content.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Cập nhật fileName
    content.fileName = fileName.trim();
    await content.save();

    res.json(content);
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete content
router.delete('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!content) return res.status(404).json({ message: 'Content not found' });
    if (content.cloudinaryId) {
      await cloudinary.uploader.destroy(content.cloudinaryId, { resource_type: 'auto' });
    }
    await content.destroy();
    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
