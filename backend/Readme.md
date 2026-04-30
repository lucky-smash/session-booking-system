# Session Booking System — Backend

REST API server for the Session Booking System, built with **Express.js**, **MongoDB (Mongoose)**, and **Socket.IO** for real-time updates.

---

## 📁 Project Structure

```
backend/
├── .env                          # Environment variables (PORT, MONGO_URI)
├── package.json                  # Dependencies & scripts
├── Readme.md
└── src/
    ├── server.js                 # Entry point — Express app, Socket.IO setup, route mounting
    ├── config/
    │   └── db.js                 # MongoDB connection logic
    ├── controllers/
    │   ├── bookingRoutes.js      # Booking controller logic
    │   └── expertController.js   # Expert controller logic
    ├── middlewares/               # (Reserved for future middleware)
    ├── models/
    │   ├── Booking.js            # Booking schema — expertId, name, email, phone, date, timeSlot, status
    │   └── Expert.js             # Expert schema — name, category, experience, rating, availability
    └── routes/
        ├── bookingRoute.js       # /api/bookings — CRUD & slot management
        └── expertRoute.js        # /api/experts  — Expert listing & details
```

---

## ⚙️ Tech Stack

| Layer          | Technology       |
| -------------- | ---------------- |
| Runtime        | Node.js          |
| Framework      | Express.js v5    |
| Database       | MongoDB + Mongoose |
| Real-time      | Socket.IO        |
| Dev Tooling    | Nodemon          |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server (with hot-reload)
npm run dev

# Start production server
npm start
```

---

## 🔗 API Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/experts`      | List all experts         |
| GET    | `/api/experts/:id`  | Get expert details       |
| GET    | `/api/bookings`     | List all bookings        |
| POST   | `/api/bookings`     | Create a new booking     |

---

## 📦 Environment Variables

| Variable     | Description              |
| ------------ | ------------------------ |
| `PORT`       | Server port (default 5000) |
| `MONGO_URI`  | MongoDB connection string |
