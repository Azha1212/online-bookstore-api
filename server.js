const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/books');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online-bookstore';

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Online Bookstore API is running',
  });
});

app.use('/api/books', bookRoutes);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
});

mongoose.set('strictQuery', true);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} without a database connection`);
    });
  });
