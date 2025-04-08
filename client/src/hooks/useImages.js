// hooks/useImages.js
import { useState, useEffect } from 'react';
import * as ImageService from '../services/imageService';

function useImages() {
    const [img, setImg] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await ImageService.showAllImages();
                setImg(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchImages();
    }, []);

    return { img, setImg };
}

export default useImages;
