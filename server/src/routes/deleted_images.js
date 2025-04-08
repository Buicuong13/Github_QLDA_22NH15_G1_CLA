import  express  from "express";
import Deleted_ImagesController from '../app/controllers/Deleted_ImagesController.js'
import auth from "../middleware/auth.js";
import delay from "../middleware/auth.js";

const router = express.Router();

router.all("*",auth);

router.get('/',Deleted_ImagesController.getAllImages_Deleted);

router.delete('/:id',Deleted_ImagesController.restoreImages);

export default router; 