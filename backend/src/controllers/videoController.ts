import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Video from '../models/Video';
import { processVideo } from '../services/processingService';

export const uploadVideo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const video = new Video({
            title: req.body.title || req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploader: req.user.id,
            organizationId: req.user.organizationId,
        });

        await video.save();

        // Trigger async processing
        processVideo(video.id); // Uses the virtual 'id' getter which returns string

        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getVideos = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { role, organizationId } = req.user;
        let query = { organizationId }; // Multi-tenancy isolation

        // If implementing strict RBAC where only specific roles see certain videos, add here.
        // For now, users see all videos in their org.

        const videos = await Video.find(query).populate('uploader', 'username');
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

import fs from 'fs';

export const streamVideo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            res.status(404).json({ message: 'Video not found' });
            return;
        }

        const { range } = req.headers;
        const videoSize = video.size;
        // Note: Video.size is useful, but we should verify with fs.stat in robust apps.
        // video.path is relative to root usually? or absolute? 
        // Multer stores partial path usually or absolute. 
        // Let's assume relative to CWD or check. Multer's file.path is usually 'uploads/filename'.

        // We'll use fs.stat to be sure about current file size
        const stat = fs.statSync(video.path);
        const fileSize = stat.size;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(video.path, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': video.mimetype,
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': video.mimetype,
            };
            res.writeHead(200, head);
            fs.createReadStream(video.path).pipe(res);
        }
    } catch (error) {
        console.error('Streaming error:', error);
        res.status(500).json({ message: 'Error streaming video' });
    }
};
