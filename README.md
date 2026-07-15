# 🛕 Darshan Ease

**Darshan Ease** is a full-stack MERN web application designed to simplify temple management and enhance the devotee experience through digital services. The platform enables online darshan booking, special puja requests, accommodation booking, temple donations, QR-based entry tickets, and role-based administration.

---

## 📌 Features

### 👤 User Features
- User Registration & Secure Login (JWT Authentication)
- Browse and Search Temples
- Online Darshan Slot Booking
- Special Puja Booking Requests
- Dharamshala Accommodation Booking
- Online Temple Donations
- Anonymous Donation Option
- QR Code Entry Ticket Generation
- Booking History
- Donation History
- Cancel Pending Booking Requests

### 👨‍💼 Admin & Organizer Features
- Secure Admin Login
- Temple Management
- Slot Management
- Approve/Reject Special Puja Requests
- Approve/Reject Accommodation Requests
- Approve/Reject Donations
- Dashboard Analytics
- Booking & Donation Management

---

## 🛠 Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

### Other Libraries
- QRCode
- Morgan
- CORS
- dotenv

---

## 📂 Project Structure

```text
Darshan-Ease/
│
├── client/
|   ├── src/
│   │   └── components/
│   ├   └── context/
│   └── index.html
│
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── server.js
│   └── package.json
│
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Darshan-Ease.git
```

### Navigate to the project

```bash
cd Darshan-Ease
```

### Install all dependencies

```bash
npm install
```

This will install all required dependencies for both the frontend and backend.

## ▶️ Running the Project

Start both the frontend and backend simultaneously using a single command from the project root:

```bash
npm run dev
```

The application will automatically start:

- Frontend (React + Vite)
- Backend (Node.js + Express)

No need to start them separately.

## 🔐 Environment Variables

Create a `.env` file inside the **server** folder and add the following variables:

```env
APP_URL=your_application_url
MONGODB_URI=your_mongodb_connection_string
```

### Description

| Variable | Description |
|----------|-------------|
| `APP_URL` | Base URL of the application (used for frontend/backend communication). |
| `MONGODB_URI` | MongoDB connection string used by the backend to connect to the database. |

## 📸 Application Modules

- Home Page
- Temple Explorer
- Temple Details
- Darshan Booking
- Special Puja Booking
- Accommodation Booking
- Donation Module
- User Profile
- Booking History
- Donation History
- Admin Dashboard
- Organizer Dashboard

---

## 📊 Key Functionalities

- Role-Based Authentication
- Secure JWT Authorization
- Online Temple Booking
- QR Code Ticket Generation
- Donation Management
- Admin Approval Workflow
- Booking Cancellation
- Responsive User Interface

---

## ⭐ Highlights

- Full Stack MERN Application
- Single-command project execution (`npm run dev`)
- JWT Authentication & Role-Based Authorization
- QR Code Based Darshan Entry
- Online Temple Donations
- Admin Approval Workflow
- Responsive User Interface
- MongoDB Database Integration
- RESTful API Architecture

## 🎯 Future Enhancements

- Online Payment Gateway Integration
- Mobile Application
- AI-based Temple Recommendation
- Live Darshan Streaming
- E-Prasadam Booking
- Multi-language Support
- Email & SMS Notifications

---

## 👨‍💻 Developed By

**Poornesh Kumar**

Mini Project – MERN Stack Development

---

## 📜 License

This project is developed for educational and academic purposes.