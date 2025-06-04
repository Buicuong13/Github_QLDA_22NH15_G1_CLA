import * as request from '../utils/request';
export const showAllAlbums = async () => {
    try {
        const res = await request.get('/album');
        return res
    } catch (error) {
        console.log(error);
        throw error;
    }
}
// export const showAlbumDetail = async (urlParams) => {
//     try {
//         const res = await request.get(`/album/${urlParams}`);
//         return res
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }

export const showAlbumDetail = async (urlParams) => {
    try {
        const res = await request.get(`/album/${urlParams}`);
        // Trả về cả status và data để xử lý trường hợp 403
        return { status: res.status, data: res.data };
    } catch (error) {
        // Nếu là lỗi từ server (vd: 403), trả về status và data lỗi
        if (error.response) {
            return { status: error.response.status, data: error.response.data };
        }
        throw error;
    }
}
export const createAlbum = async (value) => {
    try {
        const res = await request.post('/album', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const updateAlbum = async (idAlbum, value) => {
    try {
        const res = await request.put(`/album/${idAlbum}`, value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const deleteAlbum = async (imgId) => {
    try {
        const res = await request.deleteRequest(`/album/${imgId}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
