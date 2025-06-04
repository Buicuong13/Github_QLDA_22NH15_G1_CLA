import jwt from "jsonwebtoken";
const auth = (req, res, next) => {
    const routes = ["/", "/login/"];
    const url = req.baseUrl + req.url;
    let checkRoute = routes.find(value => value === url);

    if (checkRoute) {
        next();
    } else {
        if (req.headers && req.headers.authorization) {
            const accessToken = req.headers.authorization.split(' ')[1];
            try {
                const decode = jwt.verify(accessToken, process.env.JWT_SECRET);
                req.user = {
                    id: decode.id,
                    name: decode.username,
                    email: decode.email,
                }
                next();
            } catch (error) {
                console.error('Invalid token:', error);
                return res.status(401).json({ error: 'Unauthorized' }); // Gửi lỗi nếu token không hợp lệ
            }
        } else {
            return res.status(401).json({ error: 'No token provided' }); // Gửi lỗi nếu không có token
        }
    }
};

export default auth;
