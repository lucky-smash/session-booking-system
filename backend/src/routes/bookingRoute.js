const express = require('express');
const Expert = require('../models/Expert.js');
const Booking = require('../models/Booking.js');
const { getBookingsByEmail } = require('../controllers/bookingController.js');
const { createBooking } = require('../controllers/bookingController.js');
const { patchBookingStatusUpdate } = require('../controllers/bookingController.js');
const routes = express.Router();

// Create a new booking
routes.post('/', createBooking);
// routes.get('/', async (req, res) => {c
//     try {
//         const { email } = req.query;

//         if (!email) {
//             return res.status(400).json({ message: "Email is required" });
//         }

//         const bookings = await Booking.find({ email })
//             .sort({ createdAt: -1 })
//             .populate('expertId', 'name category experience rating');

//         res.json(bookings);
//     }
//     catch (error) {
//         console.error("FETCH BOOKINGS ERROR:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

routes.get("/", getBookingsByEmail);

// routes.patch("/:id/status", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         const allowed = ["pending", "confirmed", "completed"];
//         if (!allowed.includes(status)) {
//             return res.status(400).json({ message: "Invalid status" });
//         }

//         const updated = await Booking.findByIdAndUpdate(
//             id,
//             { status },
//             { new: true }
//         ).populate("expertId", "name category experience rating");

//         if (!updated) {
//             return res.status(404).json({ message: "Booking not found" });
//         }

//         res.json(updated);
//     } catch (error) {
//         console.error("UPDATE STATUS ERROR:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

routes.patch("/:id/status", patchBookingStatusUpdate);

module.exports = routes;