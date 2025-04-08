import * as request from '../utils/request';

export const requestCodeByEmail = async (value) => {
    try {
        const res = await request.post('/identify', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const vertifyCode = async (idCode) => {
    try {
        const res = await request.get(`/identify/${idCode}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updatePasswordAfterVerify = async (value) => {
    try {
        const res = await request.put(`/identify`, value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}