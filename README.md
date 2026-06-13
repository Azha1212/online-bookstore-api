# Online Bookstore Management API

This project implements a RESTful Node.js and Express API for managing books in an online bookstore using MongoDB and Mongoose.

## Features
- Create, read, update, and delete books
- Search by author and genre
- Pagination support
- Request logging middleware
- Global error handling

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start MongoDB locally or update the MongoDB Atlas URI in the `.env` file.
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- GET /api/books
- GET /api/books/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id

## Example Request Body
```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "genre": "Fantasy",
  "price": 19.99,
  "publishedDate": "1937-09-21",
  "inStock": true
}
```
