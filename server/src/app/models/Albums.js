import db from '../../config/database.js'
const Album = {
    getAllAblums: async () => {
        const query = 'SELECT * FROM album';
        const [rows] = await db.query(query);
        return rows;
    },
    create: async (data) => {
        
        const {userId,albumName,description }= data;
        const query = 'INSERT INTO album (userId, albumName,description) VALUES (?, ?,?)';
        const [result] = await db.query(
            query, [userId,albumName,description]
        );
        return result.insertId;
    },
    delete: async (data) => {
        const { album_id } = data; // Lấy album_id từ data
        const query = 'DELETE FROM album WHERE id = ?';
    
        try {
            const [result] = await db.query(query, [album_id]);
            return result.affectedRows; // Trả về số lượng bản ghi đã bị xóa (nếu thành công là 1)
        } catch (error) {
            console.error("Lỗi khi xóa album:", error);
            throw error;
        }
    }
    
}

export default Album;