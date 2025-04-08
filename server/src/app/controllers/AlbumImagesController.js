import AlbumImageService from '../services/AlbumImageService.js';

class AlbumImageController {
    async addImageToAlbum(req, res) {
        try {
            const { albumId, imageId } = req.body;
            await AlbumImageService.createImageInAlbum(albumId, imageId);
            return res.status(201).json({ message: 'Push image into album successfully' });
        } catch (error) {
            console.error('Error uploading image:', error); // Log lỗi chi tiết
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });

        }
    }
    async addMultipleImageToAlbum(req, res) {
        try {
            const { albumId, listImageId } = req.body;
            if (!albumId || !Array.isArray(listImageId) || listImageId.length === 0) {
                return res.status(400).json({ message: 'Invalid input data. Please provide a valid albumId and a list of image IDs.' });
            }
            for (const imageId of listImageId) {
                await AlbumImageService.createImageInAlbum(albumId, imageId);
            }
            return res.status(201).json({ message: 'Images added to the album successfully.' });
        } catch (error) {
            console.error('Error adding images to album:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async showImagesFromAlbum(req, res) {
        try {
            const urlParams = req.params.slug;
            const images = await AlbumImageService.getAllImagesFromAlbum(urlParams);
            return res.status(200).json({ data: images });
        } catch (error) {
            console.error("Error fetching images:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteImageFromAlbum(req, res) {
        try {
            const albumImgId = req.params.id;
            const isDeleted = await AlbumImageService.deleteImageFromAlbum(albumImgId);
            if (isDeleted) {
                res.status(200).json({ message: "Image deleted successfully." });
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });;
        }
    }
    async deleteMultipleImageFromAlbum(req, res) {
        try {
            const listAlbumImgId = req.body;
            let deletedCount = 0;
            for (const albumImgId of listAlbumImgId) {
                const isDeleted = await AlbumImageService.deleteImageFromAlbum(albumImgId);
                if (isDeleted) {
                    deletedCount++;
                }
            }
            if (deletedCount > 0) {
                res.status(200).json({ message: `${deletedCount} image(s) deleted successfully.` });
            }
        } catch (error) {
            console.error("Error deleting images:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });;
        }
    }
}

export default new AlbumImageController();
