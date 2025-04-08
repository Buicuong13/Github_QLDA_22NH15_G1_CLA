import DeletedImages from '../models/DeletedImages.js';
import Images from '../models/Images.js';
import createError from '../../utils/errorUtils.js';
import extractPublicId from '../../utils/extractUtils.js';
import cloudinary from '../../config/cloudinary.js'

const DeletedImagesService = {
    getAllDeletedImages: async (idUser) => {
        try {
            const images = await DeletedImages.getAllDeletedImages(idUser);
            return images;
        } catch (error) {
            console.error('Error in getAllDeletedImages:', error);
            throw error;
        }
    },
    restoreDeletedImages: async (idDeletedImage) => {
        try {
            const dataDeletedImage = await DeletedImages.getDeletedImageById(idDeletedImage); // Step 1: Lấy thông tin ảnh đã xóa và kiểm tra sự tồn tại của nó
            if (!dataDeletedImage) {
                throw createError('Image not found in deleted images', 404);
            }
            const { url, deletedBy } = dataDeletedImage;  // Lấy thông tin ảnh đã xóa
            const restoredImage = await Images.create(url, deletedBy);     // Step 2: Khôi phục ảnh vào bảng Images
            if (!restoredImage) {
                throw createError('Failed to restore the image. Please try again later.', 500);
            }
            const deletedRows = await DeletedImages.deleteById(idDeletedImage); // Step 3: Xóa ảnh khỏi bảng DeletedImages
            if (deletedRows === 0) {
                throw createError('Failed to delete the image from deleted images table.', 500);
            }
            return { message: "Image restored successfully." };
        } catch (error) {
            console.error('Error in restoreDeletedImages:', error);
            throw error;
        }
    },
    restoreMultipleDeletedImages: async (listIdDeletedImage) => {
        let successCount = 0;
        let failedIds = [];
        // Lặp qua danh sách các ID ảnh đã xóa
        for (const idDeletedImage of listIdDeletedImage) {
            try {
                const dataDeletedImage = await DeletedImages.getDeletedImageById(idDeletedImage); // Step 1: Kiểm tra sự tồn tại của ảnh đã xóa
                if (!dataDeletedImage) {
                    failedIds.push(idDeletedImage);  // Thêm ID không tồn tại vào danh sách lỗi
                    continue;  // Bỏ qua ảnh này và tiếp tục với ảnh tiếp theo
                }
                const { url, deletedBy } = dataDeletedImage;
                const restoredImage = await Images.create(url, deletedBy);  // Step 2: Khôi phục ảnh vào bảng Images
                if (!restoredImage) {
                    throw createError('Failed to restore the image. Please try again later.', 500);
                }
                const deletedRows = await DeletedImages.deleteById(idDeletedImage);   // Step 3: Xóa ảnh khỏi bảng DeletedImages
                if (deletedRows === 0) {
                    throw createError('Failed to delete the image from deleted images table.', 500);
                }
                successCount++;  // Đếm số ảnh khôi phục thành công
            } catch (error) {
                console.error(`Failed to restore image with ID ${idDeletedImage}:`, error);
                failedIds.push(idDeletedImage);  // Thêm ID ảnh lỗi vào danh sách lỗi
            }
        }
        return {
            successCount,
            failedIds,
            failedCount: failedIds.length
        };
    },
    removeDeletedImageById: async (id) => {
        try {
            const deletedImage = await DeletedImages.getDeletedImageById(id);
            if (!deletedImage) {
                throw createError('Deleted image not found.', 404);
            }
            const url = deletedImage.url;
            const publicId = extractPublicId(url);
            if (!publicId) {
                throw createError('Invalid public ID extracted from URL.', 400);
            }
            await cloudinary.api.delete_resources(
                [publicId],
                { type: 'upload', resource_type: 'image', invalidate: true }
            );
            // if (deleteResult.deleted[publicId] !== 'deleted') {
            //     // console.warn(`Cloudinary deletion status for ${publicId}:`, deleteResult);
            //     throw createError('Failed to delete image on Cloudinary.', 500);
            // }
            const affectedRows = await DeletedImages.deleteById(id);
            if (affectedRows === 0) {
                throw createError('Deleted image not found in database.', 404);
            }
            return { message: 'Removed deleted image successfully.' };
        } catch (error) {
            console.error(`Error in removeDeletedImageById for ID ${id}:`, error);
            throw error;
        }
    },

    removeMultipleDeletedImages: async (listIdDeletedImage) => {
        let successCount = 0;
        let failedIds = [];
        let urls = [];
        for (const idDeletedImage of listIdDeletedImage) {
            try {
                const deletedImage = await DeletedImages.getDeletedImageById(idDeletedImage);
                urls.push(deletedImage.url);
                const affectedRows = await DeletedImages.deleteById(idDeletedImage);
                if (affectedRows > 0) {
                    successCount++;
                } else {
                    failedIds.push(idDeletedImage);
                }
            } catch (error) {
                console.error(`Error deleting image with ID ${idDeletedImage}:`, error);
                failedIds.push(idDeletedImage);
            }
        }
        const publicIds = urls.map((url) => extractPublicId(url));
        await cloudinary.api.delete_resources(
            publicIds, { type: 'upload', resource_type: 'image', invalidate: true }
        );
        return {
            successCount,
            failedIds,
            failedCount: failedIds.length,
        };
    },
};

export default DeletedImagesService;
