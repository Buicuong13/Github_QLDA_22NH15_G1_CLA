import HistoryUpgradeService from '../services/HistoryUpgradeService.js';

class HistoryUpgradeController {
    async showAllHistoryUpgrades(req, res) {
        try {
            const { id } = req.user;
            const result = await HistoryUpgradeService.getAllHistoryUpgrade(id);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching capacity packages:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async showHistoryUpgradePading(req, res) {
        try {
            const { id } = req.user;
            const result = await HistoryUpgradeService.getHistoryUpgradePading(id);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching capacity packages:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async showUpgradePendingOfUser(req, res) {
        try {
            const { id } = req.user;
            const selectUserId = req.params.id;
            const result = await HistoryUpgradeService.getUpgradePendingOfUser(id, selectUserId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching upgrade history:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async showUpgradeSuccessOfUser(req, res) {
        try {
            const { id } = req.user;
            const result = await HistoryUpgradeService.getUpgradeSuccessOfUser(id);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching upgrade history:", error);  // In ra lỗi chi tiết
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async postHistoryUpgrade(req, res) {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({ message: 'Missing request data.' });
            }
            const { id } = req.user;
            const result = await HistoryUpgradeService.createNewUpgrade(id, data);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error in postHistoryUpgrade:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new HistoryUpgradeController();