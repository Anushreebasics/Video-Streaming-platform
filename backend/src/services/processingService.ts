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
        video.processingProgress = 0;
        await video.save();

        // Simulate processing with progress updates (10 steps over 5-10 seconds)
        const totalSteps = 10;
        const totalTime = 5000 + Math.random() * 5000;
        const stepDelay = totalTime / totalSteps;

        for (let step = 1; step <= totalSteps; step++) {
            await new Promise(resolve => setTimeout(resolve, stepDelay));
            
            const progress = Math.round((step / totalSteps) * 100);
            
            try {
                await Video.findByIdAndUpdate(videoId, { processingProgress: progress });
                getIO().to(video.organizationId).emit('video_progress', {
                    videoId,
                    progress
                });
            } catch (e) { console.error('Progress update error', e); }
        }

        console.log(`Processing complete for video ${videoId}`);

        // Random sensitivity result
        const isSafe = Math.random() > 0.3; // 70% safe

        video.status = VideoStatus.COMPLETED;
        video.sensitivity = isSafe ? SensitivityStatus.SAFE : SensitivityStatus.FLAGGED;
        video.processingProgress = 100;
        await video.save();

        // Emit completion event
        try {
            getIO().to(video.organizationId).emit('video_processed', {
                videoId,
                status: video.status,
                sensitivity: video.sensitivity
            });
        } catch (e) { console.error('Socket emit error', e); }

    } catch (error) {
        console.error('Error processing video:', error);
        await Video.findByIdAndUpdate(videoId, { 
            status: VideoStatus.FAILED,
            processingProgress: 0
        });
    }
};
