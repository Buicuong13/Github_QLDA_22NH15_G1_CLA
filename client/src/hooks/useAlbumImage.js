// hooks/useImages.js
import { useState, useEffect } from 'react';
import * as AlbumImageService from '../services/albumImageService';
export const useImagesByAlbumId = (id) => {
    const [img, setImg] = useState([]);

    useEffect(() => {
        if (id) {
            const getImgFromAlbum = async () => {
                try {
                    const res = await AlbumImageService.showImgFromAlbum(id);
                    setImg(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
            getImgFromAlbum();
        }
    }, [id]);

    return { img, setImg };
};
