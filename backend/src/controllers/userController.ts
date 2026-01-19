import { Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

// Get all users in organization (Admin only)
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { organizationId } = req.user;
        
        const users = await User.find({ organizationId })
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get single user (Admin only)
export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { organizationId } = req.user;
        const user = await User.findOne({ 
            _id: req.params.id,
            organizationId 
        }).select('-password');
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create user (Admin only)
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username, email, password, role } = req.body;
        const { organizationId } = req.user;

        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }],
            organizationId 
        });
        
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer',
            organizationId,
        });

        await newUser.save();

        const userResponse = newUser.toObject();
        delete (userResponse as any).password;

        res.status(201).json({ 
            message: 'User created successfully',
            user: userResponse 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update user (Admin only)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { username, email, role, password } = req.body;
        const { organizationId } = req.user;

        const user = await User.findOne({ 
            _id: req.params.id,
            organizationId 
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Check if username/email is taken by another user
        if (username || email) {
            const conditions: any[] = [];
            if (username) conditions.push({ username });
            if (email) conditions.push({ email });
            
            const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const existingUser = await User.findOne({
                organizationId,
                _id: { $ne: new mongoose.Types.ObjectId(userId) },
                $or: conditions
            });

            if (existingUser) {
                res.status(400).json({ message: 'Username or email already taken' });
                return;
            }
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        const userResponse = user.toObject();
        delete (userResponse as any).password;

        res.json({ 
            message: 'User updated successfully',
            user: userResponse 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { organizationId } = req.user;

        // Prevent admin from deleting themselves
        if (req.params.id === req.user.id) {
            res.status(400).json({ message: 'Cannot delete your own account' });
            return;
        }

        const user = await User.findOneAndDelete({ 
            _id: req.params.id,
            organizationId 
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get organization statistics (Admin only)
export const getOrgStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { organizationId } = req.user;

        const totalUsers = await User.countDocuments({ organizationId });
        const usersByRole = await User.aggregate([
            { $match: { organizationId } },
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        const stats = {
            totalUsers,
            usersByRole: usersByRole.reduce((acc, { _id, count }) => {
                acc[_id] = count;
                return acc;
            }, {} as Record<string, number>)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
