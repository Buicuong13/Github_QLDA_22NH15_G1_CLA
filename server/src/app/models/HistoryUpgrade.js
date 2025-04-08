import db from '../../config/database.js'
const HistoryUpgrade = {
    getAllHistoryUpgrade: async () => {
        try {
            const query = `
                        SELECT
                            users.id, 
                            users.name AS userName,
                            capacity_package.name AS packageName,
                            capacity_package.size,
                            capacity_package.price,
                            history_upgrade.createdAt,
                            history_upgrade.status
                        FROM users
                        JOIN history_upgrade ON users.id = history_upgrade.userId
                        JOIN capacity_package ON history_upgrade.capacityPackageId = capacity_package.id
                        ORDER BY history_upgrade.createdAt ASC
                    `;
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Error retrieving images from album:", error);
            throw new Error("Unable to retrieve images. Please try again later.");
        }
    },
    getHistoryUpgradePading: async () => {
        const status = 'pending';
        try {
            const query = `
                SELECT
                    users.id, 
                    users.name AS userName,
                    capacity_package.name AS packageName,
                    capacity_package.size,
                    capacity_package.price,
                    history_upgrade.createdAt,
                    history_upgrade.status
                FROM users
                JOIN history_upgrade ON users.id = history_upgrade.userId
                JOIN capacity_package ON history_upgrade.capacityPackageId = capacity_package.id
                WHERE history_upgrade.status = ?
            `;
            const [rows] = await db.query(query, [status]);
            return rows;
        } catch (error) {
            console.error("Error retrieving images from album:", error);
            throw new Error("Unable to retrieve images. Please try again later.");
        }
    },
    getByUserIdAndStatus: async (userId, status) => {
        try {
            const query = `
                SELECT
                    users.id, 
                    users.name AS userName,
                    capacity_package.name AS packageName,
                    capacity_package.size,
                    capacity_package.price,
                    history_upgrade.createdAt,
                    history_upgrade.status
                FROM users
                JOIN history_upgrade ON users.id = history_upgrade.userId
                JOIN capacity_package ON history_upgrade.capacityPackageId = capacity_package.id
                WHERE history_upgrade.status = ? AND history_upgrade.userId = ?
            `;
            const [rows] = await db.query(query, [status, userId]);
            return rows;
        } catch (error) {
            console.error("Error retrieving images from album:", error);
            throw new Error("Unable to retrieve images. Please try again later.");
        }
    },
    checkPendingByUserId: async (userId) => {
        const status = 'pending';
        try {
            const query = 'SELECT * FROM history_upgrade WHERE userId = ? AND status = ?'; // Sửa 'WHEN' thành 'WHERE'
            const [rows] = await db.query(query, [userId, status]);
            return rows;
        } catch (error) {
            console.error(
                `Error querying the history_upgrade table with userId: ${userId}, status: ${status}`,
                error
            );
            throw new Error('Unable to fetch data from the database. Please try again later.');
        }
    },
    create: async (data, userId) => {
        const { capacityPackageId } = data;
        const status = 'pending';
        try {
            const query = 'INSERT INTO history_upgrade (userId, capacityPackageId, status) VALUES (?, ?, ?)';
            const [result] = await db.query(query, [userId, capacityPackageId, status]);
            return result.insertId;
        } catch (error) {
            console.error(
                `Error inserting into history_upgrade table with data: ${JSON.stringify(data)}, userId: ${userId}`,
                error
            );
            throw new Error('Unable to insert data into the database. Please try again later.');
        }
    },
    updateStatusByUserId: async (userId) => {
        const statusSuccess = 'success';
        const statusPending = 'pending';
        try {
            const query = 'UPDATE history_upgrade SET status = ? WHERE userId = ? AND status = ? ';
            const [result] = await db.query(query, [statusSuccess, userId, statusPending]);
            return result.affectedRows;
        } catch (error) {
            console.error('Error updating album:', error);
            throw new Error('Failed to update album');
        }
    },
}

export default HistoryUpgrade;