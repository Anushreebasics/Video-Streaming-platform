import React from 'react';
import { Play, CheckCircle, AlertTriangle, Loader, Clock } from 'lucide-react';
import type { Video } from '../types';
import { cn } from '../utils/cn';

interface VideoCardProps {
    video: Video;
    onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
    const getStatusBadge = (status: string, sensitivity: string) => {
        if (status === 'processing') {
            return (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium border border-blue-500/20 backdrop-blur-md">
                        <Loader size={12} className="animate-spin" />
                        <span>Processing</span>
                    </div>
                    {video.processingProgress !== undefined && (
                        <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="bg-blue-500 h-full transition-all duration-300"
                                style={{ width: `${video.processingProgress}%` }}
                            />
                        </div>
                    )}
                </div>
            );
        }
        if (status === 'failed') {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20 backdrop-blur-md">
                    <AlertTriangle size={12} />
                    <span>Failed</span>
                </div>
            );
        }

        if (sensitivity === 'safe') {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20 backdrop-blur-md">
                    <CheckCircle size={12} />
                    <span>Safe Content</span>
                </div>
            );
        }

        if (sensitivity === 'flagged') {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-medium border border-rose-500/20 backdrop-blur-md">
                    <AlertTriangle size={12} />
                    <span>Flagged</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            onClick={onClick}
            className="group relative bg-card hover:bg-muted/50 border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
        >
            {/* Thumbnail Area */}
            <div className="aspect-video bg-muted relative overflow-hidden">
                {/* Placeholder Gradient since we don't have real thumbnails */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-700" />

                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="fill-white text-white ml-1" size={20} />
                    </div>
                </div>

                {/* Status Badge (Absolute) */}
                <div className="absolute top-2 right-2">
                    {getStatusBadge(video.status, video.sensitivity)}
                </div>

                {/* Duration/Type (Mock) */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-medium flex items-center gap-1">
                    <Clock size={10} />
                    <span>00:00</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {video.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[10px] uppercase">
                            {video.uploader?.username?.[0] || 'U'}
                        </div>
                        <span>{video.uploader?.username || 'Unknown'}</span>
                    </div>
                    <span>{new Date(video.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
