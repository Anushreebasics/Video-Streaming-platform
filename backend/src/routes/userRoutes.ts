import { Router } from 'express';
import { 
    getUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser,
    getOrgStats 
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';
import { UserRole } from '../models/User';

const router = Router();

// All routes are Admin only
router.get('/', authenticateToken, authorizeRoles(UserRole.ADMIN), getUsers);
router.get('/stats', authenticateToken, authorizeRoles(UserRole.ADMIN), getOrgStats);
router.get('/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), getUser);
router.post('/', authenticateToken, authorizeRoles(UserRole.ADMIN), createUser);
router.put('/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles(UserRole.ADMIN), deleteUser);

export default router;
