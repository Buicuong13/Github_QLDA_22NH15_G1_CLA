# Digital Content Management on Cloud Platform

This project is a fullstack application for managing digital content (images, documents, videos) on a cloud platform.

## Features
- User authentication (login/register) with JWT
- Secure password hashing (bcrypt)
- Upload, view, edit, and delete digital content
- Cloud storage integration (Cloudinary)
- RESTful API (Express + MongoDB)
- React frontend (Vite)
- Role-based access (admin, user)
- File preview in dashboard

## Folder Structure
- `/client` - React frontend
- `/server` - Express backend

## Getting Started

### Backend
1. `cd server`
2. Create a `.env` file with your MongoDB URI, JWT secret, and Cloudinary credentials:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. `npm install`
4. `node index.js`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

---

## API Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/content`
- `POST /api/content` (upload)
- `PUT /api/content/:id` (edit metadata)
- `DELETE /api/content/:id`

---

## License
MIT
