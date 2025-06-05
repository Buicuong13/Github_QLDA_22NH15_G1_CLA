import Album from '../models/Album.js';
import AlbumImage from '../models/AlbumImage.js';
import createError from '../../utils/errorUtils.js';

const AlbumService = {
    getAllAlbums: async (userId) => {
        try {
            const albums = await Album.getAllAlbums(userId);
            if (!albums.length) {
                throw createError('No albums found for this user.', 404);
            }
            return albums;
        } catch (error) {
            console.error('Error in getAllAlbums:', error);
            throw error;
        }
    },
    findAlbumByUrlParams: async (urlParams) => {
        try {
            const album = await Album.findAlbumByUrlParams(urlParams);
            if (!album) {
                throw createError('Album not found.', 404);
            }
            return album;
        } catch (error) {
            console.error('Error in findAlbumByUrlParams:', error);
            throw error;
        }
    },
    createAlbum: async (data, userId) => {
        try {
            if (await Album.isAlbumNameExists(data.albumName, userId)) {
                throw createError('Album name already exists.', 409);
            }
            await Album.create(data, userId);
            return true;
        } catch (error) {
            console.error('Error in createAlbum:', error);
            throw error;
        }
    },
    updateAlbum: async (id, data, userId) => {
        try {
            const existingAlbum = await Album.checkDuplicateAlbumName(id, data.albumName, userId);
            if (existingAlbum) {
                throw createError('Album name already exists.', 409);
            }
            const updatedRows = await Album.update(id, data);
            if (updatedRows === 0) {
                throw createError('Failed to update album. Album may not exist.', 404);
            }
            return true;
        } catch (error) {
            console.error('Error in updateAlbum:', error);
            throw error;
        }
    },
    deleteAlbum: async (id) => {
        try {
            console.log('[DEBUG] deleteAlbum id:', id);
            // Kiểm tra album có tồn tại không trước khi xóa
            const album = await Album.findAlbumById(id);
            console.log('[DEBUG] album from findAlbumById:', album);
            if (!album) {
                throw createError('Album not found.', 404);
            }
            // Bỏ kiểm tra isPrivate, cho phép xóa mọi album
            const idAlbumExists = await AlbumImage.findByIdAlbum(id);
            if (idAlbumExists) {
                await AlbumImage.deleteByAlbumId(id);
            }
            const deletedRows = await Album.delete(id);
            if (deletedRows === 0) {
                throw createError('Failed to delete album. Album may not exist.', 404);
            }
            return true;
        } catch (error) {
            console.error('Error in deleteAlbum:', error);
            throw error;
        }
    }
};

export default AlbumService;
