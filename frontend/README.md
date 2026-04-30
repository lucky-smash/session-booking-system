# Session Booking System — Frontend

React-based SPA for the Session Booking System, built with **React 19**, **React Router v7**, **Vite**, and **Socket.IO** for real-time updates.

---

## 📁 Project Structure

```
frontend/
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration
├── eslint.config.js              # ESLint configuration
├── public/
│   └── vite.svg                  # Favicon / public asset
└── src/
    ├── main.jsx                  # React DOM root — mounts <App />
    ├── App.jsx                   # Root component — Router setup & Socket.IO connection
    ├── api.js                    # API base URL config (http://localhost:5000)
    ├── socket.js                 # Socket.IO client instance
    ├── index.css                 # Global styles
    ├── App.css                   # App-level styles
    ├── layout.css                # Layout-specific styles
    ├── assets/
    │   └── react.svg             # React logo asset
    ├── components/
    │   └── Layout.jsx            # Shared layout wrapper (navbar, footer, etc.)
    └── pages/
        ├── Experts.jsx           # Home page — lists all available experts
        ├── ExpertDetails.jsx     # Expert profile — details & available slots
        ├── BookSlot.jsx          # Booking form — select slot & submit booking
        └── MyBookings.jsx        # User's bookings — view & manage bookings
```

---

## ⚙️ Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Framework      | React 19                |
| Bundler        | Vite 7                  |
| Routing        | React Router DOM v7     |
| Real-time      | Socket.IO Client        |
| Styling        | Tailwind CSS v4         |
| Linting        | ESLint 9                |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🗺️ Routes

| Path                | Page             | Description                          |
| ------------------- | ---------------- | ------------------------------------ |
| `/`                 | Experts          | Browse all available experts         |
| `/experts/:id`      | ExpertDetails    | View expert profile & availability   |
| `/book/:expertId`   | BookSlot         | Book a session with selected expert  |
| `/my-bookings`      | MyBookings       | View & manage your bookings          |

---

## 🔌 Real-time Updates

The app connects to the backend via **Socket.IO** (`socket.js`) to receive live updates — e.g. when a slot gets booked, the UI reflects changes instantly without a page refresh.
