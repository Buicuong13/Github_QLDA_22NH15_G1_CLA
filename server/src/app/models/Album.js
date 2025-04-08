import db from '../../config/database.js';

const Album = {
    getAllAlbums: async (userId) => {
        try {
            const query = 'SELECT * FROM album WHERE userId = ?';
            const [rows] = await db.query(query, [userId]);
            return rows;
        } catch (error) {
            console.error("Error retrieving albums:", error);
            throw new Error("Unable to retrieve albums. Please try again later.");
        }
    },
    findAlbumByUrlParams: async (urlParams) => {
        try {
            const query = 'SELECT * FROM album WHERE location = ?';
            const [rows] = await db.query(query, [urlParams]);
            return rows[0];
        } catch (error) {
            console.error("Error finding album by URL params:", error);
            throw new Error("Unable to find album by URL parameters. Please try again later.");
        }
    },
    isAlbumNameExists: async (albumName, userId) => {
        try {
            const query = 'SELECT COUNT(*) AS count FROM album WHERE albumName = ? AND userId = ?';
            const [rows] = await db.query(query, [albumName, userId]);
            return rows[0].count > 0;
        } catch (error) {
            console.error("Error checking album name existence:", error);
            throw new Error("Unable to check album name existence. Please try again later.");
        }
    },
    create: async (data, userId) => {
        try {
            const { albumName, description, location } = data;
            const query = 'INSERT INTO album (userId, albumName, description, location) VALUES (?, ?, ?, ?)';
            const [result] = await db.query(query, [userId, albumName, description, location]);
            return result.insertId;
        } catch (error) {
            console.error("Error creating album:", error);
            throw new Error("Unable to create album. Please try again later.");
        }
    },
    update: async (id, data) => {
        try {
            const { albumName, description } = data;
            const query = 'UPDATE album SET albumName = ?, description = ? WHERE id = ?';
            const [result] = await db.query(query, [albumName, description, id]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error updating album:", error);
            throw new Error("Unable to update album. Please try again later.");
        }
    },
    delete: async (id) => {
        try {
            const query = 'DELETE FROM album WHERE id = ?';
            const [result] = await db.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting album:", error);
            throw new Error("Unable to delete album. Please try again later.");
        }
    },
    checkDuplicateAlbumName: async (id, albumName, userId) => {
        try {
            const query = `
                SELECT COUNT(*) as count 
                FROM album 
                WHERE albumName = ? AND userId = ? AND id != ?
            `;
            const [rows] = await db.query(query, [albumName, userId, id]);
            return rows[0].count > 0;
        } catch (error) {
            console.error("Error checking duplicate album name:", error);
            throw new Error("Unable to check for duplicate album name. Please try again later.");
        }
    }
};

export default Album;
