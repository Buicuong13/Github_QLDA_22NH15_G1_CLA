import * as request from '../utils/request';

export const login = async (value) => {
    try {
        const res = await request.post('/login', value);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

