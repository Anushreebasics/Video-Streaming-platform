export type UserRole = 'admin' | 'editor' | 'viewer';
export const UserRole = {
    ADMIN: 'admin' as UserRole,
    EDITOR: 'editor' as UserRole,
    VIEWER: 'viewer' as UserRole,
};

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    organizationId: string;
}

export type VideoStatus = 'uploaded' | 'processing' | 'completed' | 'failed';
export const VideoStatus = {
    UPLOADED: 'uploaded' as VideoStatus,
    PROCESSING: 'processing' as VideoStatus,
    COMPLETED: 'completed' as VideoStatus,
    FAILED: 'failed' as VideoStatus,
};

export type SensitivityStatus = 'unknown' | 'safe' | 'flagged';
export const SensitivityStatus = {
    UNKNOWN: 'unknown' as SensitivityStatus,
    SAFE: 'safe' as SensitivityStatus,
    FLAGGED: 'flagged' as SensitivityStatus,
};

export interface Video {
    _id: string;
    title: string;
    filename: string;
    status: VideoStatus;
    sensitivity: SensitivityStatus;
    size: number;
    duration?: number;
    processingProgress?: number;
    createdAt: string;
    uploader?: {
        username: string;
    };
}
