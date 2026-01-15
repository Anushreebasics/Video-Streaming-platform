import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const normalizeRole = (req: AuthRequest, res: Response, next: NextFunction) => {
    // In a real app we might fetch user from DB if not fully in token, 
    // but we put role in token for simplicity.
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
        next();
    };
};
