import db from '../../config/database.js';

const DeletedImages = {
    getAllDeletedImages: async (idUser) => {
        try {
            const query = 'SELECT * FROM deleted_images WHERE deletedBy = ?';
            const [rows] = await db.query(query, [idUser]);
            return rows;
        } catch (error) {
            console.error('Error fetching deleted images:', error);
            throw new Error('Unable to fetch deleted images. Please try again later.');
        }
    },
    getDeletedImageById: async (id) => {
        try {
            const query = 'SELECT * FROM deleted_images WHERE id = ?';
            const [rows] = await db.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching deleted image by id:', error);
            throw new Error('Unable to fetch the deleted image. Please try again later.');
        }
    },
    create: async (data) => {
        const { userId, fileName, fileSize, fileWidth, fileHeight, fileFormat, url } = data;
        try {
            const query = `
                INSERT INTO Deleted_Images (url, fileName, fileSize, fileWidth, fileHeight, fileFormat, deletedBy)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [url, fileName, fileSize, fileWidth, fileHeight, fileFormat, userId]);
            return result.insertId;
        } catch (error) {
            console.error("Error inserting deleted image:", error);
            throw new Error('Failed to insert deleted image. Please try again later.');
        }
    },
    deleteById: async (id) => {
        try {
            const query = 'DELETE FROM deleted_images WHERE id = ?';
            const [result] = await db.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting image:", error);
            throw new Error("Failed to delete image. Please try again.");
        }
    }
}

export default DeletedImages;
