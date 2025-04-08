import * as request from '../utils/request';
export const showAllCapacityPackages = async () => {
    try {
        const res = await request.get('/package/capacity');
        return res
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createCapacityPackage = async (value) => {
    try {
        const res = await request.post('/package/capacity', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const updateCapacityPackage = async (idPackage, value) => {
    try {
        console.log(idPackage);
        console.log(value);
        const res = await request.put(`/package/capacity/${idPackage}`, value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export const deleteCapacityPackage = async (idPackage) => {
    try {
        const res = await request.deleteRequest(`/package/capacity/${idPackage}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}