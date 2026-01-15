# PulseStream - Full Stack Video Streaming Platform

A modern, secure, and scalable video streaming application built with the MERN stack (MongoDB, Express, React, Node.js). Features real-time video processing, role-based access control, and a premium "Netflix-style" UI.

![PulseStream UI](https://via.placeholder.com/800x400.png?text=PulseStream+Dashboard+Preview)

## 🚀 Key Features

- **Secure Authentication**: JWT-based auth with Role-Based Access Control (Admin, Editor, Viewer).
- **Video Management**: Drag-and-drop uploads with progress tracking & real-time status updates via Socket.io.
- **Simulated Processing**: Async video analysis workflow (Safe/Flagged content detection).
- **Adaptive Streaming**: HTTP Range Requests for smooth playback and seeking.
- **Premium UI/UX**: 
  - Fully Responsive Glassmorphism Design
  - Dark/Light Theme Switching
  - Animated Interactions
- **Multi-Tenancy**: Organization-based data isolation.

## 🛠 Tech Stack

**Frontend:**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 (CSS Variables)
- **State/Auth**: Context API
- **Real-time**: Socket.io Client
- **Icons**: Lucide React

**Backend:**
- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io Server
- **File Handling**: Multer (Local Storage)
- **Security**: BCrypt, JWT, CORS

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Running locally on port 27017 or via Atlas URI)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Anushreebasics/Video-Streaming-platform.git
cd Video-Streaming-platform
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in `backend/.env`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/pulse_db
JWT_SECRET=your_super_secret_key_change_this
```

Start the backend server:
```bash
npm run dev
```
*Server runs on: `http://localhost:5001`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*Client runs on: `http://localhost:5173`*

---

## 🧪 Testing the App

1. **Register**: Go to `/register` and create an account (Role: `Editor` to upload videos).
2. **Login**: Sign in with your new credentials.
3. **Upload**: Use the Upload Widget in the Dashboard sidebar to upload an `.mp4` file.
4. **Watch**: Click on a video card to stream it using the secure player.
5. **Theme**: Toggle Light/Dark mode using the icon in the Navbar.

## 📂 Project Structure

```
├── backend/            # Express Server & API Types
│   ├── src/
│   │   ├── controllers/ # Route Logic
│   │   ├── models/      # Mongoose Schemas
│   │   ├── routes/      # Endpoints
│   │   └── services/    # Business Logic (Processing)
│   └── uploads/         # Video Storage
│
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── context/     # Auth & Theme State
│   │   ├── pages/       # Route Views (Dashboard, Login)
│   │   └── types/       # Shared TypeScript Interfaces
```

## 📜 License
This project is open-source and available under the MIT License.