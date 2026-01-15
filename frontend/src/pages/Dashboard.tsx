import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ArrowLeft, Loader2, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import type { Video } from '../types';
import UploadWidget from '../components/UploadWidget';
import VideoPlayer from '../components/VideoPlayer';
import Navbar from '../components/Navbar';
import VideoCard from '../components/VideoCard';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVideos();
        const newSocket = io('http://localhost:5001');
        setSocket(newSocket);

        if (user?.organizationId) {
            newSocket.emit('join_org', user.organizationId);
        }

        newSocket.on('video_processing_start', ({ videoId }) => {
            setVideos(prev => prev.map(v => v._id === videoId ? { ...v, status: 'processing' } : v));
        });

        newSocket.on('video_processed', ({ videoId, status, sensitivity }) => {
            setVideos(prev => prev.map(v =>
                v._id === videoId ? { ...v, status, sensitivity } : v
            ));
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const res = await api.get('/videos');
            setVideos(res.data);
        } catch (err) {
            console.error('Failed to fetch videos', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-6">

                        {selectedVideo ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                                >
                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    Back to Library
                                </button>

                                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                                    <VideoPlayer video={selectedVideo} token={localStorage.getItem('token')} />
                                </div>

                                <div className="bg-card border border-border rounded-xl p-6">
                                    <h1 className="text-2xl font-bold mb-2">{selectedVideo.title}</h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            Uploaded {new Date(selectedVideo.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span className="capitalize">{selectedVideo.sensitivity} Content</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h1 className="text-3xl font-bold tracking-tight">Video Library</h1>
                                        <p className="text-muted-foreground mt-1">Manage and watch your organization's content</p>
                                    </div>
                                    <div className="hidden sm:block text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                                        {videos.length} Videos
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
                                        <Loader2 className="animate-spin mb-4" size={32} />
                                        <p>Loading library...</p>
                                    </div>
                                ) : videos.length === 0 ? (
                                    <div className="text-center py-32 bg-secondary/30 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
                                            <UploadCloud className="text-muted-foreground" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold">No videos yet</h3>
                                        <p className="text-muted-foreground max-w-sm mt-2">
                                            Upload your first video to get started with analysis and streaming.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {videos.map((video) => (
                                            <VideoCard
                                                key={video._id}
                                                video={video}
                                                onClick={() => setSelectedVideo(video)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar / Upload Area */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            {user?.role !== 'viewer' ? (
                                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-border bg-secondary/30">
                                        <h2 className="font-semibold flex items-center gap-2">
                                            <UploadCloud size={18} />
                                            Quick Upload
                                        </h2>
                                    </div>
                                    <div className="p-4">
                                        <UploadWidget onUploadSuccess={fetchVideos} />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-secondary/50 rounded-2xl border border-border text-center text-muted-foreground text-sm">
                                    You have viewer access only.
                                </div>
                            )}

                            {/* Additional Sidebar Widgets could go here */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10">
                                <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">System Status</h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Processing Engine Online
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
