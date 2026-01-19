import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/videostreaming';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB error:', err);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
};

export default connectDatabase;
