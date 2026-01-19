import React from 'react';
import { LogOut, Video as VideoIcon, Sun, Moon, User as UserIcon, Shield, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 transform group-hover:scale-105">
                            <VideoIcon className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
                            PulseStream
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        
                        {/* Navigation Links */}
                        {user && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                        location.pathname === '/dashboard'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted text-muted-foreground'
                                    }`}
                                >
                                    <LayoutDashboard size={18} />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </button>
                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                            location.pathname === '/admin'
                                                ? 'bg-purple-500 text-white'
                                                : 'hover:bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        <Shield size={18} />
                                        <span className="hidden sm:inline">Admin</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-primary"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user && (
                            <div className="flex items-center gap-3 pl-4 border-l border-border">
                                <div className="flex flex-col items-end hidden sm:flex">
                                    <span className="text-sm font-medium text-foreground">{user.username}</span>
                                    <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-0.5 rounded-full">{user.role}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-muted-foreground">
                                    <UserIcon size={16} />
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-muted-foreground hover:text-red-500 ml-2"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
