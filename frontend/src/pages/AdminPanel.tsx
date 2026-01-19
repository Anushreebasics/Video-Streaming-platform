import React, { useEffect, useState } from 'react';
import { Users, UserPlus, Trash2, Edit, Shield, BarChart3, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    organizationId: string;
    createdAt: string;
}

interface OrgStats {
    totalUsers: number;
    usersByRole: {
        admin?: number;
        editor?: number;
        viewer?: number;
    };
}

const AdminPanel: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<OrgStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'viewer'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchUsers();
        fetchStats();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/users/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/users', formData);
            setShowCreateModal(false);
            setFormData({ username: '', email: '', password: '', role: 'viewer' });
            fetchUsers();
            fetchStats();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setError('');
        try {
            await api.put(`/users/${editingUser._id}`, formData);
            setEditingUser(null);
            setFormData({ username: '', email: '', password: '', role: 'viewer' });
            fetchUsers();
            fetchStats();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${userId}`);
            fetchUsers();
            fetchStats();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role
        });
        setError('');
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'editor': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'viewer': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-3">
                                    <Shield className="text-purple-500" />
                                    Admin Panel
                                </h1>
                                <p className="text-muted-foreground mt-1">Manage users and system settings</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setShowCreateModal(true); setError(''); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <UserPlus size={18} />
                            Add User
                        </button>
                    </div>

                    {/* Statistics */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Users</p>
                                        <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                                    </div>
                                    <Users className="text-muted-foreground" size={32} />
                                </div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Admins</p>
                                        <p className="text-3xl font-bold mt-2">{stats.usersByRole.admin || 0}</p>
                                    </div>
                                    <Shield className="text-purple-500" size={32} />
                                </div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Editors</p>
                                        <p className="text-3xl font-bold mt-2">{stats.usersByRole.editor || 0}</p>
                                    </div>
                                    <Edit className="text-blue-500" size={32} />
                                </div>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Viewers</p>
                                        <p className="text-3xl font-bold mt-2">{stats.usersByRole.viewer || 0}</p>
                                    </div>
                                    <BarChart3 className="text-gray-500" size={32} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Table */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Users size={20} />
                                Organization Users
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-12 text-center text-muted-foreground">Loading users...</div>
                            ) : users.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">No users found</div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-secondary/50">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Username</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Email</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Role</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Created</th>
                                            <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover:bg-secondary/30 transition-colors">
                                                <td className="px-6 py-4 font-medium">{u.username}</td>
                                                <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(u.role)}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(u)}
                                                            className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                                                            title="Edit user"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            disabled={u._id === user?.id}
                                                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title={u._id === user?.id ? "Cannot delete yourself" : "Delete user"}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Create/Edit User Modal */}
            {(showCreateModal || editingUser) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-card border border-border rounded-xl max-w-md w-full p-6 space-y-4">
                        <h3 className="text-xl font-bold">
                            {editingUser ? 'Edit User' : 'Create New User'}
                        </h3>
                        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                    placeholder="johndoe"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Password {editingUser && '(leave empty to keep current)'}</label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Role</label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    {['admin', 'editor', 'viewer'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r })}
                                            className={`px-3 py-2 rounded-md text-sm font-medium capitalize border transition-all ${formData.role === r
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-muted text-muted-foreground border-input'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {error && (
                                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingUser(null);
                                        setFormData({ username: '', email: '', password: '', role: 'viewer' });
                                        setError('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    {editingUser ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
