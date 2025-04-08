import DeletedImageService from '../services/DeletedImageService.js';
class DeletedImagesController {
    async showAllDeletedImages(req, res) {
        try {
            const { id } = req.user;
            const deletedImages = await DeletedImageService.getAllDeletedImages(id);;
            return res.status(200).json({ data: deletedImages });
        } catch (error) {
            console.error("Error fetching images:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async restoreDeletedImages(req, res) {
        const idDeteleImage = req.params.id;
        try {
            const result = await DeletedImageService.restoreDeletedImages(idDeteleImage);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching images:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async restoreMultipleDeletedImage(req, res) {
        const listIdDeletedImage = req.body;
        if (!Array.isArray(listIdDeletedImage) || listIdDeletedImage.length === 0) {
            return res.status(400).json({ message: "Invalid input. Please provide an array of image IDs." });
        }
        try {
            const result = await DeletedImageService.restoreMultipleDeletedImages(listIdDeletedImage);
            return res.status(200).json({
                message: `${result.successCount} image(s) restored successfully.`,
                successCount: result.successCount,
                failedCount: result.failedCount,
                failedIds: result.failedIds,
            });
        } catch (error) {
            console.error("Error in restoring images:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async removeDeletedImage(req, res) {
        const { id } = req.params; // Lấy ID ảnh từ tham số trong URL
        try {
            const result = await DeletedImageService.removeDeletedImageById(id);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in removeDeletedImage controller:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async removeMultipleDeletedImages(req, res) {
        const listIdDeletedImage = req.body; // Lấy mảng ID ảnh từ yêu cầu
        if (!Array.isArray(listIdDeletedImage) || listIdDeletedImage.length === 0) {
            return res.status(400).json({ message: "Invalid input. Please provide an array of image IDs." });
        }
        try {
            const result = await DeletedImageService.removeMultipleDeletedImages(listIdDeletedImage);
            return res.status(200).json({
                message: `${result.successCount} Image deletion process completed.`,
                successCount: result.successCount,
                failedCount: result.failedCount,
                failedIds: result.failedIds,
            });
        } catch (error) {
            console.error('Error in removeMultipleDeletedImages controller:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new DeletedImagesController();