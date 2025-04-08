import axios from 'axios';
// config request
// const request = axios.create({
//     baseURL: 'https://192.168.100.7:8080',
//     headers: {
//         'Content-Type': 'application/json',
//     }
// })

const request = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    }
})

// Sử dụng interceptor để thêm token vào những request cần thiết
request.interceptors.request.use(
    (config) => {
        // Các route không cần token
        const nonAuthRoutes = ['/', '/login'];
        // Kiểm tra nếu route không nằm trong danh sách không yêu cầu token
        if (!nonAuthRoutes.includes(config.url)) {
            const token = localStorage.getItem('authToken'); // Lấy token từ localStorage hoặc bất cứ nơi nào bạn lưu
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`; // Thêm token vào header
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const post = async (path, value = {}) => {
    const res = await request.post(path, value);
    return res.data;
}

export const put = async (path, value = {}) => {
    const res = await request.put(path, value);
    return res.data;
}

export const get = async (path, value = {}) => {
    const res = await request.get(path, value);
    return res.data;
};

export const deleteRequest = async (path) => {
    const res = await request.delete(path);
    return res.data;
}
export default request;