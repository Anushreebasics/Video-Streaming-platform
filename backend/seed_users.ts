
import mongoose from 'mongoose';
import User, { UserRole } from './src/models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/videostreaming';

const seedUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@demo.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const admin = new User({
                username: 'admin',
                email: 'admin@demo.com',
                password: hashedPassword,
                role: UserRole.ADMIN,
                organizationId: 'pulse-org'
            });
            await admin.save();
            console.log('Admin created');
        } else {
            console.log('Admin already exists');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

seedUsers();
