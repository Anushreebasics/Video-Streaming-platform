# PulseStream - Full Stack Video Streaming Platform

A modern, secure, and scalable video streaming application built with the MERN stack (MongoDB, Express, React, Node.js). Features real-time video processing, role-based access control, and a premium "Netflix-style" UI.

## 🚀 Key Features

- **Secure Authentication**: JWT-based auth with Role-Based Access Control (Admin, Editor, Viewer)
- **Video Management**: Drag-and-drop uploads with progress tracking & real-time status updates via Socket.io
- **Content Analysis**: Automated sensitivity detection workflow (Safe/Flagged content)
- **Adaptive Streaming**: HTTP Range Requests for smooth playback and seeking
- **Real-Time Progress**: Live processing updates (0-100%) with Socket.io
- **Advanced Filtering**: Filter videos by sensitivity status and processing status
- **Admin Panel**: User management, organization statistics, role assignment
- **Premium UI/UX**: Fully responsive, dark/light theme, animated interactions
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
cat > .env << EOF
PORT=5002
MONGO_URI=mongodb://localhost:27017/videostreaming
JWT_SECRET=your_super_secret_jwt_key_change_in_production
EOF

npm run dev
```

Backend runs on `http://localhost:5002`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📚 Documentation

- **[Complete Documentation](./DOCUMENTATION.md)** - Full architecture, API docs
- **[API Reference](./API.md)** - Detailed REST & WebSocket documentation  
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Heroku & Netlify

---

## 🎬 User Journey

1. **Register/Login** → Secure JWT authentication
2. **Upload Video** → Drag-and-drop with progress tracking
3. **Real-Time Processing** → Watch live 0-100% progress
4. **Content Review** → View sensitivity status
5. **Stream Videos** → HTTP range requests for smooth playback
6. **Filter & Manage** → Advanced filtering

---

## 👥 User Roles (RBAC)

| Role | View Videos | Upload Videos | Manage Users | System Settings |
|------|------------|---------------|--------------|-----------------|
| **Viewer** | ✅ | ❌ | ❌ | ❌ |
| **Editor** | ✅ | ✅ | ❌ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |

**Admin Capabilities:**
- Create, edit, and delete users
- Assign and modify user roles
- View organization statistics
- Full system access

---

## 📡 API Endpoints

**Authentication:**
```http
POST   /api/auth/register         # Register new user
POST   /api/auth/login            # Login user
```

**Videos:**
```http
POST   /api/videos                # Upload video
GET    /api/videos                # Get all videos with filters
GET    /api/videos/:id/stream     # Stream video
```

**User Management (Admin Only):**
```http
GET    /api/users                 # Get all users
GET    /api/users/stats           # Get organization statistics
GET    /api/users/:id             # Get single user
POST   /api/users                 # Create new user
PUT    /api/users/:id             # Update user
DELETE /api/users/:id             # Delete user
```

**Real-Time Events (Socket.io):**
```javascript
socket.on('video_progress', ...)          // Progress 0-100%
socket.on('video_processed', ...)         // Processing complete
```

---

## 🧪 Testing

1. **Register** with different roles
2. **Login** and verify token
3. **Upload a video** (as Editor/Admin)
4. **Watch real-time progress** (0-100%)
5. **Play video** with seek
6. **Test filters** (Status, Sensitivity)
7. **Test RBAC** (Viewer can't upload)
8. **Admin Panel** (as Admin):
   - View all users
   - Create/Edit/Delete users
   - View statistics

---

## 📂 Project Structure

```
pulse/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── videoController.ts
│   │   │   └── userController.ts      (Admin)
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rbac.ts
│   │   │   └── upload.ts
│   │   ├── models/
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── videoRoutes.ts
│   │   │   └── userRoutes.ts         (Admin)
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── UploadWidget.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── ...
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── AdminPanel.tsx        (Admin)
│   │   ├── types/
│   │   └── utils/
│
├── DOCUMENTATION.md
├── API.md
├── DEPLOYMENT.md
└── README.md
```

---

## ✅ Completed Features

✅ Video upload and storage  
✅ Real-time progress tracking (0-100%)  
✅ Video sensitivity analysis  
✅ Secure streaming with range requests  
✅ Multi-tenant user isolation  
✅ Role-based access control  
✅ Admin user management system  
✅ Organization statistics  
✅ Clean, maintainable code  
✅ Comprehensive documentation  
✅ Secure authentication  
✅ Responsive UI with theme switching  
✅ Error handling & user feedback  
✅ Advanced filtering  

---

## 🚀 Deployment

Check out the [Deployment Guide](./DEPLOYMENT.md) for:
- MongoDB Atlas setup
- Heroku backend deployment
- Netlify frontend deployment
- Environment configuration

---

## 🔐 Security Features

- JWT authentication (1-day expiration)
- BCrypt password hashing (10 rounds)
- Role-based access control
- Multi-tenant data isolation
- File upload validation
- CORS configuration
- Admin-only endpoint protection

---

## 🆘 Troubleshooting

**MongoDB Connection Failed:**
```bash
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

**Port Already in Use:**
```bash
lsof -ti:5002 | xargs kill -9   # Backend
lsof -ti:5173 | xargs kill -9   # Frontend
```

**API Connection Failed:**
- Hard refresh page (Cmd/Ctrl + Shift + R)
- Verify backend running on port 5002
- Check console errors (F12)

---

## 📞 Support

- 📖 [Documentation](./DOCUMENTATION.md)
- 📡 [API Reference](./API.md)
- 🚀 [Deployment](./DEPLOYMENT.md)

---

**Built with ❤️ for Video Streaming Application Assignment**

🎉 **Application Ready for Production!**
