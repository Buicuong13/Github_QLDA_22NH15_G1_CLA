import * as request from '../utils/request';
export const showAllHistoryUpgrades = async () => {
    try {
        const res = await request.get('/history');
        return res
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const showHistoryUpgradePanding = async () => {
    try {
        const res = await request.get('/history/pending');
        return res
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const showUpgradePending = async (userId) => {
    try {
        const res = await request.get(`/history/pending/${userId}`);
        return res
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const showUpgradeSucess = async () => {
    try {
        const res = await request.get(`/history/success`);
        return res
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const createHistoryUpgrade = async (value) => {
    try {
        const res = await request.post('/history', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// export const deleteImage = async (imgId) => {
//     try {
//         const res = await request.deleteRequest(`/images/${imgId}`);
//         return res;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }