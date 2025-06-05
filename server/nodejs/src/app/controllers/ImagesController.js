import ImageService from '../services/ImageService.js';
class ImagesController {
    async showAllImage(req, res) {
        try {
            const { id } = req.user;
            const images = await ImageService.getAllImages(id);
            return res.status(200).json({ data: images });
        } catch (error) {
            console.error("Error fetching images:", error); // Log lỗi chi tiết
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async postImages(req, res) {
        try {
            const { url } = req.body;
            const { id } = req.user;
            const result = await ImageService.uploadImage(url, id);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Error uploading image:', error); // Log detail error
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteImages(req, res) {
        try {
            const imgId = req.params.id;
            const result = await ImageService.deleteImage(imgId);
            res.status(200).json(result);

        } catch (error) {
            console.error("Error deleting image:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
    async deleteMultiple(req, res) {
        try {
            const arrIdImg = req.body;
            const result = await ImageService.deleteMultipleImages(arrIdImg);
            if (result.statusCode === 207) {
                return res.status(207).json({
                    message: result.message,
                    deletedImages: result.deletedImages,
                    notFoundIds: result.notFoundIds,
                });
            }
            return res.status(200).json({
                message: result.message,
                deletedImages: result.deletedImages,
            });

        } catch (error) {
            console.error("Error deleting images:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
    async postMultipleImages(req, res) {
        try {
            const { urls } = req.body;
            const { id } = req.user;
            const result = await ImageService.uploadImages(urls, id);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Error uploading multiple images:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new ImagesController();