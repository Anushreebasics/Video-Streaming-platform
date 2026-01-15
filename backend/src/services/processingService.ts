import Video, { VideoStatus, SensitivityStatus } from '../models/Video';

import { getIO } from '../utils/socket';

export const processVideo = async (videoId: string) => {
    console.log(`Starting processing for video ${videoId}`);

    try {
        const video = await Video.findById(videoId);
        if (!video) return;

        // Notify start
        try {
            getIO().to(video.organizationId).emit('video_processing_start', { videoId });
        } catch (e) { console.error('Socket emit error', e); }

        video.status = VideoStatus.PROCESSING;
        await video.save();

        // Simulate processing delay (5-10 seconds)
        setTimeout(async () => {
            console.log(`Processing complete for video ${videoId}`);

            // Random sensitivity result
            const isSafe = Math.random() > 0.3; // 70% safe

            video.status = VideoStatus.COMPLETED;
            video.sensitivity = isSafe ? SensitivityStatus.SAFE : SensitivityStatus.FLAGGED;
            await video.save();

            // Emit completion event
            try {
                getIO().to(video.organizationId).emit('video_processed', {
                    videoId,
                    status: video.status,
                    sensitivity: video.sensitivity
                });
            } catch (e) { console.error('Socket emit error', e); }

        }, 5000 + Math.random() * 5000);

    } catch (error) {
        console.error('Error processing video:', error);
        await Video.findByIdAndUpdate(videoId, { status: VideoStatus.FAILED });
    }
};
