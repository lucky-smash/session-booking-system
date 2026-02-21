const moongoose = require('mongoose');

const bookingSchema = new moongoose.Schema({
    expertId: { type: moongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });
const Booking = moongoose.model('Booking', bookingSchema);

module.exports = Booking;