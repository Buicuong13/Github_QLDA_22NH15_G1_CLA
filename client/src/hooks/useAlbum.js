// hooks/useImages.js
import { useState, useEffect } from 'react';
import * as AlbumService from '../services/albumService';

export const useAllAlbum = () => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const showAlbum = async () => {
            try {
                const res = await AlbumService.showAllAlbums();
                setAlbums(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        showAlbum();
    }, []);

    return { albums, setAlbums };
};
export const useAlbumDetail = (id) => {
    const [albumDetail, setAlbumDetail] = useState(null);

    useEffect(() => {
        if (id) {
            const showAlbumDetail = async () => {
                try {
                    const res = await AlbumService.showAlbumDetail(id);
                    setAlbumDetail(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
            showAlbumDetail();
        }
    }, [id]);

    return { albumDetail, setAlbumDetail };
};
