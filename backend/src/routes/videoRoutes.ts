import { Router } from 'express';
import { uploadVideo, getVideos, streamVideo } from '../controllers/videoController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { upload } from '../middleware/upload';
import { UserRole } from '../models/User';

const router = Router();

// Upload - Only Editor/Admin
router.post('/', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.EDITOR), upload.single('video'), uploadVideo);

// List - All authenticated users
router.get('/', authenticateToken, getVideos);

// Stream - All authenticated users (could be public if needed, but required secure)
router.get('/:id/stream', authenticateToken, streamVideo);

export default router;
