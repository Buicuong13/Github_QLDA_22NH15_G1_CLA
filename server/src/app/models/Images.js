import db from '../../config/database.js'
import axios from 'axios';
import sharp from 'sharp';

const Image = {
    getAllImages: async (userId) => {
        try {
            const query = 'SELECT * FROM images WHERE userId = ?';
            const [rows] = await db.query(query, [userId]);
            return rows;
        } catch (error) {
            console.error("Error fetching images:", error); // Log lỗi chi tiết
            throw new Error("Unable to fetch images.");
        }
    },
    getImage: async (id) => {
        try {
            const query = 'SELECT * FROM images WHERE id = ?';
            const [rows] = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error("Error fetching images:", error); // Log lỗi chi tiết
            throw new Error("Unable to fetch images.");
        }
    },
    create: async (url, userId) => {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            // Tính kích thước file bằng byte và chuyển đổi sang KB
            const fileSizeInKB = buffer.length / 1024; // Chuyển đổi kích thước từ byte sang KB
            // Sử dụng sharp để lấy thông tin ảnh
            const metadata = await sharp(buffer).metadata();
            const query = 'INSERT INTO images (userId,url, fileName, fileSize, fileWidth, fileHeight, fileFormat) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(query, [userId, url, url.split('/').pop(), fileSizeInKB.toFixed(2), metadata.width, metadata.height, metadata.format]);
            return result.insertId;
        } catch (error) {
            console.error('Error inserting image:', error); // Ghi log lỗi chi tiết
            throw new Error('Unable to insert image into the database.');
        }
    },
    delete: async (imgId) => {
        try {
            const query = 'DELETE FROM images WHERE id = ?';
            const [result] = await db.query(query, [imgId]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting image:", error);
            throw new Error("Failed to delete image. Please try again.");
        }
    }
}

export default Image;