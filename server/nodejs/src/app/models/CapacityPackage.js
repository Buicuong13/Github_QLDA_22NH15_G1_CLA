import db from '../../config/database.js';

const CapacityPackage = {
    getAll: async () => {
        try {
            const query = 'SELECT * FROM capacity_package';
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error('Error fetching capacity packages:', error);
            throw new Error('Unable to fetch capacity packages. Please try again later.');
        }
    },
    create: async (data) => {
        const { name, size, description, price } = data;
        try {
            const query = `
                INSERT INTO capacity_package (name, size, description, price)
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [name, size, description, price]);
            return result.insertId;
        } catch (error) {
            console.error('Error inserting capacity package:', error);
            throw new Error('Failed to create capacity package. Please try again.');
        }
    },
    update: async (id, data) => {
        const { name, size, description, price } = data;
        try {
            const query = `
                UPDATE capacity_package
                SET name = ?, size = ?, description = ?, price = ?
                WHERE id = ?
            `;
            const [result] = await db.query(query, [name, size, description, price, id]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error updating capacity package:', error);
            throw new Error('Failed to update capacity package. Please try again.');
        }
    },
    delete: async (id) => {
        try {
            const query = 'DELETE FROM capacity_package WHERE id = ?';
            const [result] = await db.query(query, [id]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error deleting capacity package:', error);
            throw new Error('Failed to delete capacity package. Please try again.');
        }
    }
};

export default CapacityPackage;
