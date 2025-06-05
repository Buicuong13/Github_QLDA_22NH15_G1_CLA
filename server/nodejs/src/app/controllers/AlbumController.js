import AlbumService from '../services/AlbumService.js';

class AlbumController {
    async showAllAlbums(req, res) {
        try {
            const { id } = req.user;
            const albums = await AlbumService.getAllAlbums(id);
            return res.status(200).json({ data: albums });
        } catch (error) {
            console.error("Error fetching albums:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async showAlbumDetail(req, res) {
        try {
            const urlParams = req.params.id;
            const albumDetail = await AlbumService.findAlbumByUrlParams(urlParams);
            return res.status(200).json({ data: albumDetail });
        } catch (error) {
            console.error("Error fetching album detail:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createNewAlbum(req, res) {
        try {
            const data = req.body;
            const albumName = data.albumName;
            if (!albumName) {
                return res.status(400).json({ message: 'Album name is required' });
            }
            const { id } = req.user;
            console.log('isPrivate:', data.isPrivate); // Log ra trạng thái bảo mật

            const album = await AlbumService.createAlbum(data, id);
            return res.status(201).json({ message: 'Album created successfully', album });
        } catch (error) {
            console.error('Error creating album:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateAlbum(req, res) {
        try {
            const { id } = req.user;
            const albumId = req.params.id;
            const { albumName, description, isPrivate } = req.body;
            const updatedAlbum = await AlbumService.updateAlbum(albumId, { albumName, description, isPrivate }, id);
            return res.status(200).json({ message: 'Album updated successfully.', album: updatedAlbum });
        } catch (error) {
            console.error('Error updating album:', error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async deleteAlbum(req, res) {
        try {
            const id = req.params.id;
            const result = await AlbumService.deleteAlbum(id);
            if (result) {
                return res.status(200).json({ message: `Album with ID ${id} has been deleted` });
            }
        } catch (error) {
            console.error("Error deleting album:", error);
            if (error.statusCode) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getAlbumDetailRaw(id) {
        try {
            const albumDetail = await AlbumService.findAlbumByUrlParams(id);
            // console.log("Raw album detail:", albumDetail);
            console.log("IsPrivate of album", albumDetail.isPrivate);
            return albumDetail;
        } catch (error) {
            console.error("Error fetching raw album detail:", error);
            throw error; // Rethrow to be handled by the calling function
        }
    }
}

export default new AlbumController();
