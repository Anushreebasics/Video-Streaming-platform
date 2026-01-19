import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileVideo } from 'lucide-react';
import api from '../utils/api';
import { cn } from '../utils/cn';

interface UploadWidgetProps {
    onUploadSuccess: () => void;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (selected.type.startsWith('video/')) {
                setFile(selected);
                setTitle(selected.name.split('.')[0]);
                setError('');
            } else {
                setError('Please select a valid video file.');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);

        try {
            await api.post('/videos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setProgress(percentCompleted);
                }
            });
            setSuccess(true);
            setFile(null);
            setTitle('');
            setProgress(0);
            onUploadSuccess();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Upload Complete!</h3>
                <p className="text-sm text-muted-foreground">Your video is being processed.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-sm text-primary hover:underline"
                >
                    Upload another
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center"
                >
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                    </div>
                    <p className="font-medium text-foreground">Click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">MP4 or WebM (Max 50MB)</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                    />
                    {error && <p className="text-xs text-destructive mt-3">{error}</p>}
                </div>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded bg-background flex items-center justify-center flex-shrink-0">
                                <FileVideo size={16} className="text-primary" />
                            </div>
                            <div className="truncate text-sm font-medium text-foreground max-w-[150px]">
                                {file.name}
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Video Title"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    {uploading ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleUpload}
                            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                        >
                            Start Upload
                        </button>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                            <AlertCircle size={14} /> {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadWidget;
