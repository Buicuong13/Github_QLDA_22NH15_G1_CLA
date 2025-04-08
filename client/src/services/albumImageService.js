import * as request from '../utils/request';
export const showImgFromAlbum = async (urlParams) => {
    try {
        const res = await request.get(`/album/images/${urlParams}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const addImgToAlbum = async (value) => {
    try {
        const res = await request.post('/album/images', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const addMultipleImgToAlbum = async (value) => {
    try {
        const res = await request.post('/album/images/multiple', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const deleteMultipleImgFromAlbum = async (value) => {
    try {
        const res = await request.post('/album/images/delete/multiple', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const deleteImgFromAlbum = async (idAlbumImg) => {
    try {
        const res = await request.deleteRequest(`/album/images/${idAlbumImg}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


