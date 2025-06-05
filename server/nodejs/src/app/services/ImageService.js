import Images from '../models/Images.js';
import AlbumImage from '../models/AlbumImage.js';
import DeletedImages from '../models/DeletedImages.js';
import createError from '../../utils/errorUtils.js';

const ImageService = {
    getAllImages: async (userId) => {
        try {
            const images = await Images.getAllImages(userId);
            return images;
        } catch (error) {
            console.error('Error fetching images from the database:', error);
            throw error;
        }
    },
    uploadImage: async (url, userId) => {
        try {
            if (!url) {
                throw createError('Image URL is required.', 400);
            }
            await Images.create(url, userId);
            return { message: 'Image uploaded successfully' };
        } catch (error) {
            console.error('Error saving image to the database:', error);
            throw error; // Ném lỗi lên controller để xử lý
        }
    },
    uploadImages: async (urls, userId) => {
        try {
            if (!Array.isArray(urls) || urls.length === 0) {
                throw createError('Image URLs are required.', 400);
            }
            const results = [];
            for (const url of urls) {
                if (!url) continue;
                await Images.create(url, userId);
                results.push(url);
            }
            return { message: 'Images uploaded successfully', uploaded: results };
        } catch (error) {
            console.error('Error uploading multiple images:', error);
            throw error;
        }
    },
    deleteImage: async (imgId) => {
        try {
            const image = await Images.getImage(imgId);
            if (image.length === 0) {
                throw createError('Image not found.', 404);
            }
            // step2: add image deleted throw table deleted_images
            await DeletedImages.create(image);
            //step3: delete images from album before delete original images
            await AlbumImage.deleteByImgId(imgId);
            //step4: delete original images
            const affectedRows = await Images.delete(imgId);
            if (affectedRows === 0) {
                res.status(404).json({ message: "Image not found." });
            }
            return { message: "Image deleted successfully." };
        } catch (error) {
            console.error('Error in createAlbum:', error);
            throw error;
        }
    },
    updateAlbum: async (id, data, userId) => {
        try {
            const existingAlbum = await Album.checkDuplicateAlbumName(id, data.albumName, userId);
            if (existingAlbum) {
                throw createError('Album name already exists.', 409);
            }
            const updatedRows = await Album.update(id, data);
            if (updatedRows === 0) {
                throw createError('Failed to update album. Album may not exist.', 404);
            }
            return true;
        } catch (error) {
            console.error('Error in updateAlbum:', error);
            throw error;
        }
    },
    deleteAlbum: async (id) => {
        try {
            const idAlbumExists = await AlbumImage.findByIdAlbum(id);
            if (idAlbumExists) {
                await AlbumImage.deleteByAlbumId(id);
            }
            const deletedRows = await Album.delete(id);
            if (deletedRows === 0) {
                throw createError('Failed to delete album. Album may not exist.', 404);
            }
            return true;
        } catch (error) {
            console.error('Error in deleteAlbum:', error);
            throw error;
        }
    },
    deleteMultipleImages: async (arrIdImg) => {
        try {
            if (!arrIdImg || arrIdImg.length === 0) {
                throw createError('No image IDs provided.', 400);
            }
            const notFoundIds = [];
            const deletedImages = [];
            for (const id of arrIdImg) {
                // Bước 1: Kiểm tra sự tồn tại của ảnh
                const image = await Images.getImage(id);
                if (!image) {
                    notFoundIds.push(id);
                    continue;
                }
                // Bước 2: Lưu thông tin ảnh vào bảng deleted_images
                await DeletedImages.create(image);
                // Bước 3: Xóa ảnh khỏi album
                await AlbumImage.deleteByImgId(id);
                // Bước 4: Xóa ảnh gốc
                await Images.delete(id);
                deletedImages.push(id);
            }
            if (notFoundIds.length > 0) {
                return {
                    statusCode: 207,
                    message: "Some images were not found.",
                    deletedImages,
                    notFoundIds,
                };
            }
            return {
                statusCode: 200,
                message: "All images deleted successfully.",
                deletedImages,
            };
        } catch (error) {
            console.error("Error deleting images:", error);
            throw error;
        }
    }
};

export default ImageService;
