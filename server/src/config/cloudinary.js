import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: 'djfgf1byn',
    api_key: '446786349671613',
    api_secret: 'cUkGqL7sCNo-H0u1JRN92jP2zj8',
    secure: true,
});

export default cloudinary.v2;