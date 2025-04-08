import db from '../../config/database.js'

const AlbumImage = {
    getAllImagesFromAlbum: async (urlParams) => {
        try {
            const query = `
                SELECT 
                    album_images.id,  
                    images.id AS imageId, 
                    images.url, 
                    album.albumName,
                    album.description,
                    album.createdAt
                FROM album
                JOIN album_images ON album.id = album_images.albumId
                JOIN images ON album_images.imageId = images.id
                WHERE album.location = ?;
            `;
            const [rows] = await db.query(query, [urlParams]);
            return rows;
        } catch (error) {
            console.error("Error retrieving images from album:", error);
            throw new Error("Unable to retrieve images from the album. Please try again later.");
        }
    },
    findByIdAlbum: async (albumId) => {
        try {
            const query = 'SELECT * FROM album_images WHERE albumId = ?';
            const [rows] = await db.query(query, [albumId]);
            if (rows.length > 0) {
                return rows[0];
            }
            return null;
        } catch (error) {
            console.error("Error finding album images by albumId:", error);
            throw new Error("Unable to find album images. Please try again later.");
        }
    },
    create: async (albumId, imageId) => {
        try {
            const query = 'INSERT INTO album_images (albumId, imageId) VALUES (?, ?)';
            const [result] = await db.query(query, [albumId, imageId]);
            return result.insertId;
        } catch (error) {
            console.error("Error inserting album image:", error);
            throw new Error("Unable to add image to album. Please try again later.");
        }
    },
    delete: async (albumImgId) => {
        try {
            const query = 'DELETE FROM album_images WHERE id = ?';
            const [result] = await db.query(query, [albumImgId]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting album image by id:", error);
            throw new Error("Unable to delete image from album. Please try again later.");
        }
    },
    deleteByImgId: async (imageId) => {
        try {
            const query = 'DELETE FROM album_images WHERE imageId = ?';
            const [result] = await db.query(query, [imageId]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting album image by imageId:", error);
            throw new Error("Unable to delete image by imageId. Please try again later.");
        }
    },
    deleteByAlbumId: async (albumId) => {
        try {
            const query = 'DELETE FROM album_images WHERE albumId = ?';
            const [result] = await db.query(query, [albumId]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting album images by albumId:", error);
            throw new Error("Unable to delete images by albumId. Please try again later.");
        }
    }
}

export default AlbumImage;
