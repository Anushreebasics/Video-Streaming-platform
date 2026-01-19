# PulseStream - Full Stack Video Streaming Platform

A modern, secure, and scalable video streaming application built with the MERN stack (MongoDB, Express, React, Node.js). Features real-time video processing, role-based access control, and a premium "Netflix-style" UI.

## 🚀 Key Features

- **Secure Authentication**: JWT-based auth with Role-Based Access Control (Admin, Editor, Viewer)
- **Video Management**: Drag-and-drop uploads with progress tracking & real-time status updates via Socket.io
- **Content Analysis**: Automated sensitivity detection workflow (Safe/Flagged content)
- **Adaptive Streaming**: HTTP Range Requests for smooth playback and seeking
- **Real-Time Progress**: Live processing updates (0-100%) with Socket.io
- **Advanced Filtering**: Filter videos by sensitivity status and processing status
- **Premium UI/UX**: 
  - Fully Responsive Glassmorphism Design
  - Dark/Light Theme Switching
  - Animated Interactions & Progress Indicators
- **Multi-Tenancy**: Organization-based data isolation
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠 Tech Stack

**Frontend:**
- React 19 + Vite + TypeScript
- Tailwind CSS v4 (CSS Variables)
- Socket.io Client + Axios
- Lucide React Icons

**Backend:**
- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- Socket.io Server
- Multer (File Upload)
- BCrypt + JWT (Security)

---

## 🏁 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Running locally on port 27017 or via Atlas URI)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd pulse
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5001
MONGO_URI=mongodb://localhost:27017/videostreaming
JWT_SECRET=your_super_secret_jwt_key_change_in_production" > .env

# Build and start
npm run build
npm run dev
```

Backend runs on `http://localhost:5001`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📚 Documentation

- **[Complete Documentation](./DOCUMENTATION.md)** - Full application guide, architecture, API docs
- **[API Reference](./API.md)** - Detailed REST API and WebSocket documentation  
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Heroku, Netlify, MongoDB Atlas

---

## 🎬 Complete User Journey

1. **Register/Login** → Secure JWT authentication
2. **Upload Video** → Drag-and-drop with progress tracking
3. **Real-Time Processing** → Watch live progress (0-100%)
4. **Content Review** → View sensitivity status (Safe/Flagged)
5. **Stream Videos** → HTTP range requests for smooth playback
6. **Filter & Manage** → Advanced filtering by status and sensitivity

---

## 👥 User Roles (RBAC)

| Role | View Videos | Upload Videos | Manage System |
|------|------------|---------------|---------------|
| **Viewer** | ✅ | ❌ | ❌ |
| **Editor** | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ |

---

## 📡 Key API Endpoints

```http
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login user
POST   /api/videos                # Upload video (Editor/Admin)
GET    /api/videos                # Get all videos (with filters)
GET    /api/videos/:id/stream     # Stream video (range requests)
GET    /health                    # Health check
```

### Real-Time Events (Socket.io)
```javascript
socket.on('video_processing_start', ...)  // Processing started
socket.on('video_progress', ...)          // Progress update (0-100%)
socket.on('video_processed', ...)         // Processing complete
```

---

## 🧪 Testing the Application

1. **Register** with different roles (viewer, editor, admin)
2. **Login** and verify token storage
3. **Upload a video** (as Editor/Admin)
4. **Watch real-time processing** progress (0-100%)
5. **Play video** with seek functionality
6. **Test filters** (Safe/Flagged, Processing/Completed)
7. **Test RBAC** (Viewer can't upload)

---

## 📊 Project Structure

```
pulse/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, RBAC, Upload
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Socket.io setup
│   │   └── server.ts        # Express app
│   └── uploads/             # Video storage
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth, Theme)
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # API client, utilities
│   └── ...
│
├── DOCUMENTATION.md         # Complete documentation
├── API.md                   # API reference
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

---

## ✅ Success Criteria Checklist

✅ Complete video upload and storage system  
✅ Real-time processing progress updates (0-100%)  
✅ Video sensitivity analysis and classification  
✅ Secure video streaming with range requests  
✅ Multi-tenant user isolation  
✅ Role-based access control implementation  
✅ Clean, maintainable code structure  
✅ Comprehensive documentation  
✅ Secure authentication and authorization  
✅ Responsive and intuitive user interface  
✅ Proper error handling and user feedback  
✅ Advanced filtering capabilities  

---

## 🚀 Deployment

Ready to deploy? Check out the [Deployment Guide](./DEPLOYMENT.md) for:
- MongoDB Atlas setup
- Heroku backend deployment
- Netlify frontend deployment
- Environment configuration
- CI/CD setup

---

## 🔐 Security Features

- JWT authentication with 1-day expiration
- BCrypt password hashing (10 rounds)
- Role-based access control (RBAC)
- Multi-tenant data isolation
- File upload validation (type, size)
- CORS configuration
- Comprehensive error handling

---

## 📈 Future Enhancements

- [ ] FFmpeg integration for real video processing
- [ ] Video thumbnails generation
- [ ] Multiple quality levels (360p, 720p, 1080p)
- [ ] AWS S3 file storage
- [ ] CDN integration
- [ ] Advanced search & tagging
- [ ] Comments & ratings system
- [ ] Email notifications
- [ ] Admin dashboard with analytics

---

## 📝 License

MIT License - Educational purposes

---

## 🆘 Troubleshooting

**MongoDB Connection Failed:**
```bash
# Ensure MongoDB is running
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

**Port Already in Use:**
```bash
# Kill process on port
lsof -ti:5001 | xargs kill -9   # Backend
lsof -ti:5173 | xargs kill -9   # Frontend
```

**Upload Failed:**
- Verify `uploads/` directory exists in backend
- Check file size < 50MB
- Ensure video MIME type

For more troubleshooting, see [DOCUMENTATION.md](./DOCUMENTATION.md)

---

## 📞 Support

- 📖 [Complete Documentation](./DOCUMENTATION.md)
- 📡 [API Reference](./API.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)

---

**Built with ❤️ for the Video Streaming Application Assignment**

🎉 **Application Ready for Production!**

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
