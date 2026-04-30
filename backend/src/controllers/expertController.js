const Expert = require('../models/Expert.js');


exports.getAllExperts = async (req, res) => {
    try {
        // Query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const search = req.query.search || '';
        const category = req.query.category || '';

        // Filter
        const filter = {};
        if (category) filter.category = category;
        if (search) filter.name = { $regex: search, $options: 'i' };

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
};

exports.getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) return res.status(404).json({ message: "Expert not found" });
        res.json(expert);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addNewExpert = async (req, res) => {
    try {
        const data = req.body;

        if (Array.isArray(data)) {
            const experts = await Expert.insertMany(data);
            return res.status(201).json(experts);
        }

        const expert = await Expert.create(data);
        res.status(201).json(expert);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};