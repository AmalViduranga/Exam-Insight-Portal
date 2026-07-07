import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, ConfirmDialog } from '../components/ui';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { UserPlus, Shield, User, Ban, CheckCircle, Key } from 'lucide-react';

export function UserManagement() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'USER'>('USER');
  
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, action: string, userId: string | null, title: string, desc: string }>({
    isOpen: false, action: '', userId: null, title: '', desc: ''
  });

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    setIsCreating(true);
    try {
      await api.post('/admin/users', {
        username: newUsername,
        fullName: newFullName,
        password: newPassword,
        role: newRole
      });
      addToast('User created successfully', 'success');
      setNewUsername('');
      setNewFullName('');
      setNewPassword('');
      setNewRole('USER');
      fetchUsers();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Failed to create user', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const executeAction = async () => {
    const { action, userId } = confirmDialog;
    if (!userId) return;
    
    try {
      if (action === 'disable') {
        await api.patch(`/admin/users/${userId}/disable`);
        addToast('User disabled', 'success');
      } else if (action === 'enable') {
        await api.patch(`/admin/users/${userId}/enable`);
        addToast('User enabled', 'success');
      } else if (action === 'reset') {
        const tempPassword = Math.random().toString(36).slice(-8);
        await api.patch(`/admin/users/${userId}/password`, { password: tempPassword });
        addToast(`Password reset successfully to: ${tempPassword}`, 'success');
      }
      fetchUsers();
    } catch (error: any) {
      addToast(error.response?.data?.message || 'Action failed', 'error');
    } finally {
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Manage system access and roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Create User Form */}
        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Create New User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Full Name</label>
                  <Input required value={newFullName} onChange={e => setNewFullName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Username</label>
                  <Input required value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="johndoe" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Password</label>
                  <Input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Role</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRole('USER')}
                      className={`flex-1 py-2 px-3 border rounded-md text-sm font-medium transition-colors ${newRole === 'USER' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      <User className="w-4 h-4 mx-auto mb-1" />
                      User
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole('ADMIN')}
                      className={`flex-1 py-2 px-3 border rounded-md text-sm font-medium transition-colors ${newRole === 'ADMIN' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      <Shield className="w-4 h-4 mx-auto mb-1" />
                      Admin
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isCreating} className="w-full mt-4">
                  {isCreating ? 'Creating...' : 'Create User'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="xl:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading users...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-500">No users found.</td></tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{u.fullName}</div>
                            <div className="text-slate-500 text-xs mt-0.5">@{u.username}</div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={u.role === 'ADMIN' ? 'outline' : 'default'} className={u.role === 'ADMIN' ? 'border-indigo-200 text-indigo-700 bg-indigo-50' : ''}>
                              {u.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {u.isActive ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="error">Disabled</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                title="Reset Password"
                                onClick={() => setConfirmDialog({
                                  isOpen: true, action: 'reset', userId: u.id, 
                                  title: 'Reset Password', desc: `Are you sure you want to reset the password for ${u.fullName}? A random password will be generated.`
                                })}
                              >
                                <Key className="w-4 h-4" />
                              </Button>
                              {u.isActive ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                  title="Disable User"
                                  disabled={u.id === user.id}
                                  onClick={() => setConfirmDialog({
                                    isOpen: true, action: 'disable', userId: u.id, 
                                    title: 'Disable User', desc: `Are you sure you want to disable access for ${u.fullName}?`
                                  })}
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                  title="Enable User"
                                  onClick={() => setConfirmDialog({
                                    isOpen: true, action: 'enable', userId: u.id, 
                                    title: 'Enable User', desc: `Are you sure you want to restore access for ${u.fullName}?`
                                  })}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={executeAction}
        title={confirmDialog.title}
        description={confirmDialog.desc}
        variant={confirmDialog.action === 'disable' ? 'destructive' : 'default'}
      />
    </div>
  );
}
