import { useEffect, useState } from "react";
import * as deletedImgService from '../services/deletedImgService';

function useDeletedImages() {
    const [deletedImg, setDeleteImg] = useState([]);
    useEffect(() => {
        const getDeletedImg = async () => {
            try {
                const res = await deletedImgService.showDeletedImages();
                setDeleteImg(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        getDeletedImg();
    }, []);

    return { deletedImg, setDeleteImg };
}

export default useDeletedImages;