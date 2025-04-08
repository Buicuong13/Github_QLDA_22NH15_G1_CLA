import express from 'express';
import HistoryUpgradeController from '../app/controllers/HistoryUpgradeController.js'
import auth from "../middleware/auth.js";
const router = express.Router();
router.all("*", auth);
router.get('/success', HistoryUpgradeController.showUpgradeSuccessOfUser);
router.get('/pending/:id', HistoryUpgradeController.showUpgradePendingOfUser);
router.get('/pending', HistoryUpgradeController.showHistoryUpgradePading);
router.get('/', HistoryUpgradeController.showAllHistoryUpgrades);
router.post('/', HistoryUpgradeController.postHistoryUpgrade);

export default router;