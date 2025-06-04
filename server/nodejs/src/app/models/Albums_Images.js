import db from '../../config/database.js'
const Albums_Images = {
    getAllImageswithId_album: async () => {
        const query = `
            SELECT images.id, images.filePath, images.fileName, album.albumName
            FROM album
            JOIN album_images ON album.id = album_images.albumId
            JOIN images ON album_images.imageId = images.id;
        `;
        const [rows] = await db.query(query);
        return rows;
    },
    addImagesToAlbum: async (albumId, imageId) => {
        // if (!albumId || !imageId) {
        //     throw new Error('Both albumId and imageId must be provided.');
        // }
        const query = 'INSERT INTO album_images (albumId, imageId) VALUES (?,?)';
        const [result] = await db.query(query, [albumId, imageId]);
        return result.insertId;
    },
    
    // delete: async (data) => {
    //     const { album_id } = data; // Lấy album_id từ data
    //     const query = 'DELETE FROM album WHERE id = ?';
    
    //     try {
    //         const [result] = await db.query(query, [album_id]);
    //         return result.affectedRows; // Trả về số lượng bản ghi đã bị xóa (nếu thành công là 1)
    //     } catch (error) {
    //         console.error("Lỗi khi xóa album:", error);
    //         throw error;
    //     }
    // }
    
}

export default Albums_Images;