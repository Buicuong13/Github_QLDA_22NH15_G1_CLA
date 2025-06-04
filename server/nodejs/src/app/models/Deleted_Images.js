import db from '../../config/database.js';

const deleted_images = {
    // Hàm lấy tất cả ảnh đã xóa
    getAllImages_Deleted: async () => {
        const query = 'SELECT filePath FROM Deleted_Images';
        const [rows] = await db.query(query);
        return rows;
    },

    // Hàm phục hồi ảnh
    restoreImages: async (imageId, deletedBy) => {
        try {
            // Truy vấn để lấy ảnh từ bảng Deleted_Images dựa trên ID
            const [deletedImageRows] = await db.query(
                'SELECT * FROM Deleted_Images WHERE id = ?',
                [imageId]
            );

            if (deletedImageRows.length === 0) {
                throw new Error('Deleted image in table Deleted_Images not found');
            }

            const deletedImage = deletedImageRows[0];

            // Thêm ảnh vào bảng Images
            await db.query(
                'INSERT INTO Images (filePath, fileName, fileSize, fileWidth, fileHeight, fileFormat) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    deletedImage.filePath, 
                    deletedImage.fileName,
                    deletedImage.fileSize,
                    deletedImage.fileWidth,
                    deletedImage.fileHeight,
                    deletedImage.fileFormat
                ]
            );

            // Xóa ảnh khỏi bảng Deleted_Images sau khi phục hồi
            await db.query('DELETE FROM Deleted_Images WHERE id = ?', [imageId]);

            return { message: 'Image restored successfully' };
        } catch (error) {
            console.error('Restore error:', error);
            throw error;  // Ném lỗi để controller có thể bắt và phản hồi
        }
    },
};

export default deleted_images;
