import mongoose, { Schema, Document } from 'mongoose';

export enum VideoStatus {
    UPLOADED = 'uploaded',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum SensitivityStatus {
    UNKNOWN = 'unknown',
    SAFE = 'safe',
    FLAGGED = 'flagged',
}

export interface IVideo extends Document {
    title: string;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    duration?: number;
    uploader: mongoose.Types.ObjectId;
    status: VideoStatus;
    sensitivity: SensitivityStatus;
    processingProgress: number;
    organizationId: string;
    createdAt: Date;
}

const VideoSchema: Schema = new Schema({
    title: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    duration: { type: Number, default: 0 },
    uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: Object.values(VideoStatus),
        default: VideoStatus.UPLOADED
    },
    sensitivity: {
        type: String,
        enum: Object.values(SensitivityStatus),
        default: SensitivityStatus.UNKNOWN
    },
    processingProgress: { type: Number, default: 0 },
    organizationId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IVideo>('Video', VideoSchema);
