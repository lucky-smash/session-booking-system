const express = require('express');
const Expert = require('../models/Expert.js');
const Booking = require('../models/Booking.js');
const routes = express.Router();

// Create a new booking
routes.post('/', async (req, res) => {
    console.log("✅ HIT POST /api/bookings", req.body);
    
    try {
        const { expertId, name, email, phone, date, timeSlot, notes } = req.body;
        // Check if expert exists
        const expert = await Expert.findById(expertId);
        if (!expert) return res.status(404).json({ message: 'Expert not found' });

        //  slot locked (findone and update)
        const updatedExpert = await Expert.findOneAndUpdate(
            {
                _id: expertId,
                "availability.date": date,
                "availability.slots.time": timeSlot,
                "availability.slots.isBooked": false
            },
            {
                $set: { "availability.$[day].slots.$[slot].isBooked": true }
            },
            {
                arrayFilters: [
                    { "day.date": date },
                    { "slot.time": timeSlot, "slot.isBooked": false }
                ],
                new: true
            }
        );

        if (!updatedExpert) {
            return res.status(409).json({ message: "Slot already booked or not available" });
        }



        // Create booking
        const newBooking = new Booking({ expertId, name, email, phone, date, timeSlot, notes });
        await newBooking.save();

        // Emit real-time update to client
        const io = req.app.get("io");

        io.emit("slotBooked", {
            expertId,
            date,
            time: timeSlot
        });

        console.log("[socket] emitting slotBooked:", {
            expertId: String(expertId),
            date,
            time: timeSlot,
            at: new Date().toISOString(),
        });

        res.status(201).json(newBooking);
    } catch (error) {
        console.error("BOOKING ERROR:", error);

        // Duplicate booking error
        if (error.code === 11000) {
            return res.status(409).json({ message: "Slot already booked" });
        }

        res.status(500).json({ message: "Server error" });
    }
});

routes.get('/', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const bookings = await Booking.find({ email })
            .sort({ createdAt: -1 })
            .populate('expertId', 'name category experience rating');

        res.json(bookings);
    }
    catch (error) {
        console.error("FETCH BOOKINGS ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
});

routes.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "confirmed", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("expertId", "name category experience rating");

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = routes;