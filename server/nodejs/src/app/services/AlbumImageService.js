import AlbumImage from '../models/AlbumImage.js';
import createError from '../../utils/errorUtils.js';

const AlbumImageService = {
    getAllImagesFromAlbum: async (urlParams) => {
        try {
            const images = await AlbumImage.getAllImagesFromAlbum(urlParams);
            return images;
        } catch (error) {
            console.error('Error in getAllImagesFromAlbum:', error);
            throw error;
        }
    },
    findByIdAlbum: async (albumId) => {
        try {
            const albumImage = await AlbumImage.findByIdAlbum(albumId);
            if (!albumImage) {
                throw createError('No images found for this album.', 404);
            }
            return albumImage;
        } catch (error) {
            console.error('Error in findByIdAlbum:', error);
            throw error;
        }
    },
    createImageInAlbum: async (albumId, imageId) => {
        try {
            await AlbumImage.create(albumId, imageId);
            return true;
        } catch (error) {
            console.error('Error in createImageInAlbum:', error);
            throw error;
        }
    },
    deleteImageFromAlbum: async (albumImgId) => {
        try {
            const affectedRows = await AlbumImage.delete(albumImgId);
            if (affectedRows === 0) {
                throw createError('Failed to delete image.', 400);
            }
            return true;
        } catch (error) {
            console.error('Error in deleteImageFromAlbum:', error);
            throw error;
        }
    },
    deleteImageByImageId: async (imageId) => {
        try {
            const affectedRows = await AlbumImage.deleteByImgId(imageId);
            if (affectedRows === 0) {
                throw createError('Failed to delete image.', 400);
            }
            return true;
        } catch (error) {
            console.error('Error in deleteImageByImageId:', error);
            throw error;
        }
    },
    deleteImagesByAlbumId: async (albumId) => {
        try {
            const affectedRows = await AlbumImage.deleteByAlbumId(albumId);
            if (affectedRows === 0) {
                throw createError('Failed to delete images for this album.', 400);
            }
            return { message: 'All images deleted from album successfully.' };
        } catch (error) {
            console.error('Error in deleteImagesByAlbumId:', error);
            throw error;
        }
    }
};

export default AlbumImageService;
