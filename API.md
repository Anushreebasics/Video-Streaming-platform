# 📡 API Reference - PulseStream

Complete REST API documentation for the PulseStream video streaming platform.

---

## 🌐 Base URL

```
Development: http://localhost:5001/api
Production:  https://your-domain.com/api
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 24 hours and include:
- User ID
- User role
- Organization ID

---

## 📋 API Endpoints

### Authentication Endpoints

#### Register New User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account with specified role and organization.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "editor",
  "organizationId": "org-001"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Unique username (3-50 chars) |
| email | string | Yes | Valid email address |
| password | string | Yes | Password (min 6 chars) |
| role | enum | No | Role: 'viewer', 'editor', 'admin' (default: 'viewer') |
| organizationId | string | No | Organization identifier (default: 'default-org') |

**Success Response (201 Created):**
```json
{
  "message": "User registered successfully"
}
```

**Error Responses:**
```json
// 400 Bad Request - User exists
{
  "message": "User already exists"
}

// 500 Internal Server Error
{
  "message": "Server error",
  "error": {}
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "editor",
    "organizationId": "org-001"
  }'
```

---

#### Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN2Y...",
  "user": {
    "id": "617f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "editor",
    "organizationId": "org-001"
  }
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid credentials
{
  "message": "Invalid credentials"
}

// 500 Internal Server Error
{
  "message": "Server error",
  "error": {}
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

---

### Video Endpoints

#### Upload Video

**Endpoint:** `POST /videos`

**Description:** Upload a new video file for processing.

**Authorization:** Required (Editor or Admin role)

**Request Type:** `multipart/form-data`

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| video | file | Yes | Video file (MP4, WebM) - Max 50MB |
| title | string | No | Video title (defaults to filename) |

**Success Response (201 Created):**
```json
{
  "_id": "617f1f77bcf86cd799439011",
  "title": "My Awesome Video",
  "filename": "1640000000000-123456789-video.mp4",
  "path": "uploads/1640000000000-123456789-video.mp4",
  "mimetype": "video/mp4",
  "size": 15728640,
  "duration": 0,
  "uploader": "617f1f77bcf86cd799439010",
  "status": "uploaded",
  "sensitivity": "unknown",
  "processingProgress": 0,
  "organizationId": "org-001",
  "createdAt": "2024-01-19T10:30:00.000Z",
  "updatedAt": "2024-01-19T10:30:00.000Z"
}
```

**Error Responses:**
```json
// 400 Bad Request - No file
{
  "message": "No file uploaded"
}

// 403 Forbidden - Insufficient permissions
{
  "message": "Access denied: Insufficient permissions"
}

// 500 Internal Server Error
{
  "message": "Server error",
  "error": {}
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5001/api/videos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "video=@/path/to/video.mp4" \
  -F "title=My Awesome Video"
```

**Example JavaScript (with axios):**
```javascript
const formData = new FormData();
formData.append('video', fileInput.files[0]);
formData.append('title', 'My Awesome Video');

const response = await axios.post('/videos', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Upload Progress: ${percentCompleted}%`);
  }
});
```

---

#### Get All Videos

**Endpoint:** `GET /videos`

**Description:** Retrieve list of videos for user's organization with optional filtering.

**Authorization:** Required (All roles)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sensitivity | enum | No | Filter by: 'all', 'safe', 'flagged', 'unknown' (default: 'all') |
| status | enum | No | Filter by: 'all', 'uploaded', 'processing', 'completed', 'failed' (default: 'all') |

**Success Response (200 OK):**
```json
[
  {
    "_id": "617f1f77bcf86cd799439011",
    "title": "Video 1",
    "filename": "1640000000000-video1.mp4",
    "path": "uploads/1640000000000-video1.mp4",
    "mimetype": "video/mp4",
    "size": 15728640,
    "duration": 120,
    "uploader": {
      "_id": "617f1f77bcf86cd799439010",
      "username": "john_doe"
    },
    "status": "completed",
    "sensitivity": "safe",
    "processingProgress": 100,
    "organizationId": "org-001",
    "createdAt": "2024-01-19T10:30:00.000Z",
    "updatedAt": "2024-01-19T10:35:00.000Z"
  },
  {
    "_id": "617f1f77bcf86cd799439012",
    "title": "Video 2",
    "filename": "1640000100000-video2.mp4",
    "status": "processing",
    "sensitivity": "unknown",
    "processingProgress": 45,
    "organizationId": "org-001",
    "createdAt": "2024-01-19T10:40:00.000Z",
    "updatedAt": "2024-01-19T10:41:00.000Z"
  }
]
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "message": "Access denied"
}

// 500 Internal Server Error
{
  "message": "Server error",
  "error": {}
}
```

**Example cURL:**
```bash
# Get all videos
curl -X GET http://localhost:5001/api/videos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get only safe videos
curl -X GET "http://localhost:5001/api/videos?sensitivity=safe" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get completed videos only
curl -X GET "http://localhost:5001/api/videos?status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Combine filters
curl -X GET "http://localhost:5001/api/videos?sensitivity=safe&status=completed" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### Stream Video

**Endpoint:** `GET /videos/:id/stream`

**Description:** Stream video with HTTP range request support for seeking and partial content delivery.

**Authorization:** Required (All roles) - Token can be passed as query parameter for video element compatibility

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Video MongoDB ObjectId |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| token | string | No | JWT token (alternative to Authorization header) |

**Headers:**
| Header | Value | Description |
|--------|-------|-------------|
| Range | bytes=start-end | Request specific byte range (optional) |

**Success Response:**

**206 Partial Content** (with Range header):
```http
HTTP/1.1 206 Partial Content
Content-Type: video/mp4
Content-Length: 1024000
Content-Range: bytes 0-1023999/15728640
Accept-Ranges: bytes

<binary video data>
```

**200 OK** (without Range header):
```http
HTTP/1.1 200 OK
Content-Type: video/mp4
Content-Length: 15728640

<full video data>
```

**Error Responses:**
```json
// 404 Not Found
{
  "message": "Video not found"
}

// 401 Unauthorized
{
  "message": "Access denied"
}

// 500 Internal Server Error
{
  "message": "Error streaming video"
}
```

**Example cURL:**
```bash
# Stream full video
curl -X GET http://localhost:5001/api/videos/617f1f77bcf86cd799439011/stream?token=YOUR_JWT_TOKEN \
  --output video.mp4

# Request specific byte range
curl -X GET http://localhost:5001/api/videos/617f1f77bcf86cd799439011/stream \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Range: bytes=0-1023" \
  --output video-chunk.mp4
```

**Example HTML5 Video:**
```html
<video controls>
  <source 
    src="http://localhost:5001/api/videos/617f1f77bcf86cd799439011/stream?token=YOUR_JWT_TOKEN" 
    type="video/mp4"
  >
</video>
```

---

### System Endpoints

#### Health Check

**Endpoint:** `GET /health`

**Description:** Check server status and connectivity.

**Authorization:** Not required

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

**Example cURL:**
```bash
curl -X GET http://localhost:5001/health
```

---

## 🔌 WebSocket Events (Socket.io)

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');
```

### Client → Server Events

#### Join Organization Room

**Event:** `join_org`

**Description:** Subscribe to real-time updates for specific organization.

**Payload:**
```javascript
socket.emit('join_org', organizationId);
```

**Example:**
```javascript
socket.emit('join_org', 'org-001');
console.log('Joined organization room: org-001');
```

---

### Server → Client Events

#### Video Processing Started

**Event:** `video_processing_start`

**Description:** Emitted when video processing begins.

**Payload:**
```javascript
{
  videoId: "617f1f77bcf86cd799439011"
}
```

**Example:**
```javascript
socket.on('video_processing_start', (data) => {
  console.log(`Video ${data.videoId} processing started`);
  updateVideoStatus(data.videoId, 'processing');
});
```

---

#### Video Processing Progress

**Event:** `video_progress`

**Description:** Emitted periodically during processing (10 updates from 10% to 100%).

**Payload:**
```javascript
{
  videoId: "617f1f77bcf86cd799439011",
  progress: 45  // 0-100
}
```

**Example:**
```javascript
socket.on('video_progress', (data) => {
  console.log(`Video ${data.videoId}: ${data.progress}% complete`);
  updateProgressBar(data.videoId, data.progress);
});
```

---

#### Video Processing Completed

**Event:** `video_processed`

**Description:** Emitted when video processing finishes successfully.

**Payload:**
```javascript
{
  videoId: "617f1f77bcf86cd799439011",
  status: "completed",
  sensitivity: "safe"  // or "flagged"
}
```

**Example:**
```javascript
socket.on('video_processed', (data) => {
  console.log(`Video ${data.videoId} completed: ${data.sensitivity}`);
  updateVideoStatus(data.videoId, data.status);
  updateSensitivityBadge(data.videoId, data.sensitivity);
});
```

---

## 📊 Data Models

### User Model

```typescript
interface User {
  _id: ObjectId;
  username: string;        // Unique
  email: string;           // Unique
  password: string;        // Hashed with bcrypt
  role: 'admin' | 'editor' | 'viewer';
  organizationId: string;  // For multi-tenancy
  createdAt: Date;
  updatedAt: Date;
}
```

### Video Model

```typescript
interface Video {
  _id: ObjectId;
  title: string;
  filename: string;        // Generated unique filename
  path: string;            // File system path
  mimetype: string;        // e.g., 'video/mp4'
  size: number;            // Bytes
  duration: number;        // Seconds (optional)
  uploader: ObjectId;      // Reference to User
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  sensitivity: 'unknown' | 'safe' | 'flagged';
  processingProgress: number;  // 0-100
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔒 Role-Based Permissions

| Endpoint | Viewer | Editor | Admin |
|----------|--------|--------|-------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| POST /videos | ❌ | ✅ | ✅ |
| GET /videos | ✅ | ✅ | ✅ |
| GET /videos/:id/stream | ✅ | ✅ | ✅ |

---

## 🧪 Testing Examples

### Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "PulseStream API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"test_user\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!\",\n  \"role\": \"editor\",\n  \"organizationId\": \"org-001\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5001/api"
    }
  ]
}
```

---

## 📈 Rate Limiting

| Endpoint Pattern | Limit | Window |
|-----------------|-------|--------|
| /api/* | 100 requests | 15 minutes |
| /api/auth/login | 5 requests | 15 minutes |
| /api/videos (POST) | 10 uploads | 1 hour |

---

## ⚠️ Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 206 | Partial Content - Range request successful |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## 🔄 Versioning

Current API Version: **v1**

Future versions will be accessible at:
```
/api/v2/...
```

---

## 📞 Support

For API issues or questions:
- Check troubleshooting in main documentation
- Review error response messages
- Verify authentication tokens
- Check network connectivity

---

**Last Updated:** January 2026  
**API Version:** 1.0.0
