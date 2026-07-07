import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';
import { Button } from './ui';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/dashboard';
    return '/dashboard';
  };

  return (
    <header className="bg-white border-b sticky top-0 z-40 h-16 shrink-0 flex items-center shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full gap-4">
        
        {/* Left Side: Logo & Brand */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button 
              onClick={onMenuClick} 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          )}
          <Link to={getDashboardLink()} className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="bg-primary/10 p-2 rounded-lg text-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <span className="font-bold text-lg md:text-xl text-slate-800 hidden sm:inline-block tracking-tight">Exam Insight Portal</span>
          </Link>
        </div>

        {/* Right Side: User Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="flex items-center gap-3 mr-2">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-700 leading-tight">{user.fullName}</span>
                <span className="text-xs text-slate-500 leading-tight flex items-center gap-1">
                  {user.role === 'ADMIN' ? (
                    <span className="text-indigo-600 font-medium flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="text-blue-600 font-medium flex items-center gap-1">
                      <User className="w-3 h-3" /> User
                    </span>
                  )}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-2 sm:px-3"
            title="Logout"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
        
      </div>
    </header>
  );
}
