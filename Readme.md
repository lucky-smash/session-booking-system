# Session Booking System

A full-stack web application that allows users to browse experts, search by category, and book sessions seamlessly. The system is designed with scalability in mind and includes pagination, filtering, and modern UI practices.

## 🚀 Live Features

### 👨‍💼 Expert Management
- View a list of experts
- Search experts by name
- Filter experts by category
- Pagination for efficient data loading

### 📅 Session Booking (Core Flow)
- Browse available experts
- View expert details
- Book sessions easily

### 🔍 Smart Data Handling
- Server-side pagination
- Search & filter APIs
- Optimized database queries

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- CSS / Modern UI Components

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

---

## 📂 Project Structure
session-booking-system/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── server.js
│
├── frontend/
│ ├── src/
│ ├── components/
│ └── pages/


---

## ⚙️ Installation & Setup

###
1️⃣ Clone the repository
```bash
git clone https://github.com/lucky-smash/session-booking-system.git
cd session-booking-system


2️⃣ Backend Setup
cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_connection_string


Run backend:npm start



3️⃣ Frontend Setup

cd frontend
npm install
npm run dev


📊 API Features
Get Experts (with pagination)
GET /api/experts?page=1&limit=5&search=design&category=UI


Response includes:

experts list

total count

current page

total pages


🎯 Key Highlights

Clean MVC backend architecture

RESTful API design

Efficient pagination logic

Scalable folder structure

Real-world full-stack implementation