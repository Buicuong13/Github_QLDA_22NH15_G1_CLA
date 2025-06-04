import Deleted_Images from '../models/Deleted_Images.js';

class Deleted_ImagesController {
    async getAllImages_Deleted(req, res) {
        try {
            const images = await Deleted_Images.getAllImages_Deleted();
            console.log(images);
            return res.status(200).json({ data: images });
        } catch (error) {
            console.error('Error fetching deleted images:', error);
            return res.status(500).json({ message: 'Failed to fetch deleted images' });
        }
    }

    async restoreImages(req, res) {
        const imageId = req.params.id;
        const deletedBy = req.body.deletedBy;

        try {
            const result = await Deleted_Images.restoreImages(imageId, deletedBy);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error restoring image:', error);
            res.status(500).json({ message: 'Failed to restore image' });
        }
    }
}

export default new Deleted_ImagesController();
