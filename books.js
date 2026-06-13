const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

const validateBookPayload = (payload) => {
  const errors = [];

  if (!payload.title || String(payload.title).trim() === '') {
    errors.push('Title is required');
  }

  if (!payload.author || String(payload.author).trim() === '') {
    errors.push('Author is required');
  }

  if (payload.price === undefined || payload.price === null || Number.isNaN(Number(payload.price))) {
    errors.push('Price is required and must be a number');
  }

  return errors;
};

router.get('/', async (req, res, next) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const books = await Book.find(filter).skip(skip).limit(limitNumber).sort({ createdAt: -1 });
    const totalBooks = await Book.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalBooks,
        pages: Math.ceil(totalBooks / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const errors = validateBookPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const book = new Book({
      ...req.body,
      price: Number(req.body.price),
    });

    const savedBook = await book.save();
    res.status(201).json({ success: true, message: 'Book created successfully', data: savedBook });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const errors = validateBookPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: Number(req.body.price),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
