import * as request from '../utils/request'

export const register = async (value) => {
    try {
        const res = await request.post('/register', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}