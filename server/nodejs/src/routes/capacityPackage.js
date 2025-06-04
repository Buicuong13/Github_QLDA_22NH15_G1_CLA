import express from 'express';
import CapacityPackageController from '../app/controllers/CapacityPackageController.js'
import auth from "../middleware/auth.js";
const router = express.Router();
router.all("*", auth);

router.get('/', CapacityPackageController.showAllCapacityPackages);

router.post('/', CapacityPackageController.createCapacityPackage);

router.put('/:id', CapacityPackageController.updateCapacityPackage);

router.delete('/:id', CapacityPackageController.deleteCapacityPackage);

export default router;