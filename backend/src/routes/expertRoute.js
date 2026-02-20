const express = require('express');
const routes = express.Router();
const Expert = require('../models/Expert.js');

// Get all experts (with pagination + search + category filter)
routes.get('/', async (req, res) => {
  try {
    // Query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const category = req.query.category || '';

    // Filter
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex : search, $options: 'i' };

    // Pagination
    const skip = (page - 1) * limit; // how many records to skip from start

    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter).skip(skip).limit(limit);

    res.json({
      experts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new expert
routes.post('/', async (req, res) => {
    const { name, category, experience, rating } = req.body;
    try {
        const newExpert = new Expert({ name, category, experience, rating });
        await newExpert.save();
        res.status(201).json(newExpert);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = routes;