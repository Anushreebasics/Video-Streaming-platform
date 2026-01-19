import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Video, User, Building2, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../utils/api';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organizationId, setOrganizationId] = useState('');
    const [role, setRole] = useState('viewer');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', { username, email, password, organizationId, role });
            navigate('/login');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">

            {/* Right Side - Visual (Swapped for variety or keep same?) - Let's keep visually consistent with Login but maybe switched or different gradient */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-black relative overflow-hidden order-last">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-900 to-black opacity-50"></div>
                <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-black to-transparent"></div>

                {/* Animated Shapes */}
                <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>

                <div className="relative z-10 w-full flex justify-end">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10">
                            <Video className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-wide">PulseStream</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8 max-w-lg ml-auto text-right">
                    <h1 className="text-5xl font-bold text-white leading-tight">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-indigo-400 to-purple-400">Revolution.</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Create an organization, invite your team, and start processing video content at scale today.
                    </p>

                    <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg max-w-xs">
                            <ShieldCheck className="text-green-400" size={24} />
                            <div className="text-left">
                                <p className="text-white text-sm font-medium">Enterprise Grade Security</p>
                                <p className="text-gray-500 text-xs">SOC2 Compliant Infrastructure</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-gray-500 text-sm text-right">
                    © 2024 PulseStream Inc. All rights reserved.
                </div>
            </div>

            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
                <div className="w-full max-w-md space-y-8 animate-in slide-in-from-left-8 duration-700">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h2>
                        <p className="text-muted-foreground">
                            Get started with PulseStream for free.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2 sm:col-span-1">
                                    <label className="text-sm font-medium text-foreground">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                            placeholder="johndoe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 col-span-2 sm:col-span-1">
                                    <label className="text-sm font-medium text-foreground">Organization ID</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={organizationId}
                                            onChange={(e) => setOrganizationId(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                            placeholder="acme-corp"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-2.5 text-muted-foreground" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Role</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['admin', 'editor', 'viewer'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`px-3 py-2 rounded-md text-sm font-medium capitalize border transition-all ${role === r
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-muted text-muted-foreground border-input'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full group"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                            Create Account
                            {!isLoading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                            Sign in here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
