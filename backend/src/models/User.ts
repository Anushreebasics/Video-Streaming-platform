import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer',
}

export interface IUser extends Document {
    username: string;
    password?: string;
    email: string; // Adding email for completeness
    role: UserRole;
    organizationId: string; // For multi-tenancy
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.VIEWER
    },
    organizationId: { type: String, required: true }, // Simple string for now, could be ref later
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
