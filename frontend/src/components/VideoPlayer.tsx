import React from 'react';
import type { Video } from '../types';

interface VideoPlayerProps {
    video: Video;
    token?: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, token }) => {
    const streamUrl = `http://localhost:5002/api/videos/${video._id}/stream?token=${token}`;

    return (
        <div className="w-full bg-black rounded-xl overflow-hidden aspect-video relative group">
            <video
                controls
                className="w-full h-full object-contain"
                poster="https://via.placeholder.com/1280x720/000000/FFFFFF/?text=Video+Player"
            >
                <source src={streamUrl} type={video.filename.endsWith('mp4') ? 'video/mp4' : 'video/webm'} />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
