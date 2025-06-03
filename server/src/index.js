import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
// import db from './config/database.js';
import db from './config/database.js';

const app = express();
const port = 8080;
app.use(cors());
// middleware use Parse data from body request (Form html)
app.use(express.urlencoded({ extended: false }));
// middleware use Parse data from javascript (fetch)
app.use(express.json());

db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('success to connect mysql');
    }
})

routes(app);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

// app.listen(8080, '192.168.100.7', () => {
//     console.log('Backend is running on http://192.168.100.7:8080');
// });

// app.listen(8080, '0.0.0.0', () => {
//     console.log('Backend is running on http://0.0.0.0:8080');
// });




// import https from 'https';
// import fs from 'fs';
// import express from 'express';
// import cors from 'cors';
// import routes from './routes/index.js';
// import db from './config/database.js';

// const app = express();
// const port = 8080; // Cổng HTTPS

// app.use(cors());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Kết nối MySQL
// db.connect((err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('Successfully connected to MySQL');
//     }
// });

// routes(app);

// // Đọc file chứng chỉ
// const options = {
//     key: fs.readFileSync('cert/key.pem'),  // Đường dẫn đến file private key
//     cert: fs.readFileSync('cert/cert.pem') // Đường dẫn đến file chứng chỉ
// };

// // Tạo server HTTPS
// https.createServer(options, app).listen(port, '192.168.100.7', () => {
//     console.log(`Server is running on https://192.168.100.7:${port}`);
// });
