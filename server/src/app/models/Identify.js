import db from '../../config/database.js';

const Identify = {
    getIdentify: async (idCode) => {
        try {
            const query = 'SELECT * FROM identify WHERE idCode = ?';
            const [rows] = await db.query(query, [idCode]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching identify:', error);
            throw new Error('Unable to fetch identify. Please try again later.');
        }
    },
    create: async (email, idCode) => {
        try {
            const query = `
                INSERT INTO identify (email, idCode) VALUES (?, ?)
            `;
            const [result] = await db.query(query, [email, idCode]);
            return result.insertId;
        } catch (error) {
            console.error("Error creating identify:", error);
            throw new Error('Failed to create identify. Please try again later.');
        }
    },
    deleteById: async (idCode) => {
        try {
            const query = 'DELETE FROM identify WHERE idCode = ?';
            const [result] = await db.query(query, [idCode]);
            return result.affectedRows;
        } catch (error) {
            console.error("Error deleting identify:", error);
            throw new Error("Failed to delete identify. Please try again.");
        }
    }
}

export default Identify;
