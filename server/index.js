require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import all models to establish associations
require('./models/index');

// Import routes
const authRoutes = require('./routes/auth');
const albumRoutes = require('./routes/album');
const imageRoutes = require('./routes/image');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/album', albumRoutes); 
app.use('/api/image', imageRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
