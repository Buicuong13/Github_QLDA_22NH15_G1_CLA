import CapacityPackageService from '../services/CapacityPackageService.js';

class CapacityPackageController {
    async showAllCapacityPackages(req, res) {
        try {
            const capacityPackages = await CapacityPackageService.getAllCapacityPackages();
            return res.status(200).json({ data: capacityPackages });
        } catch (error) {
            console.error("Error fetching capacity packages:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async createCapacityPackage(req, res) {
        try {
            const { id } = req.user;
            const data = req.body;
            await CapacityPackageService.createCapacityPackage(id, data);
            return res.status(200).json({ message: 'create capacity package sucssess' });
        } catch (error) {
            console.error("Error fetching capacity packages:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateCapacityPackage(req, res) {
        try {
            const { id } = req.user;
            const idPackage = req.params.id;
            const data = req.body;
            await CapacityPackageService.updateCapacityPackage(id, idPackage, data);
            return res.status(200).json({ message: 'update capacity package sucssess' });
        } catch (error) {
            console.error("Error fetching capacity packages:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteCapacityPackage(req, res) {
        try {
            const { id } = req.user;
            const idPackage = req.params.id;
            await CapacityPackageService.deleteCapacityPackage(id, idPackage);
            return res.status(200).json({ message: 'delete capacity package sucssess' });
        } catch (error) {
            console.error("Error fetching capacity packages:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new CapacityPackageController();