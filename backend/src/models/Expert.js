const mongoose = require('mongoose');   

const expertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: Number, required: true },
    rating: { type: Number, required: true },
    availability: [
        {
            date: { type: String, required: true }, // "YYYY-MM-DD"
            slots: [
                {
                    time: { type: String, required: true }, // "10:00"
                    isBooked: { type: Boolean, default: false }
                }
            ]
        }
    ]
}, { timestamps: true });

const Expert = mongoose.model('Expert', expertSchema);

module.exports = Expert;