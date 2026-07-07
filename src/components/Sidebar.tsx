import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  BarChart3, 
  ListOrdered, 
  Users,
  LogOut,
  X
} from 'lucide-react';
import { Button } from './ui';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'USER'] },
    { label: 'Upload Excel', icon: UploadCloud, path: '/dashboard/upload', roles: ['ADMIN', 'USER'] },
    { label: 'Subject Rankings', icon: ListOrdered, path: '/dashboard/rankings', roles: ['ADMIN', 'USER'] },
    { label: 'All Reports', icon: BarChart3, path: '/dashboard/reports', roles: ['ADMIN', 'USER'] },
    { label: 'User Management', icon: Users, path: '/admin/users', roles: ['ADMIN'] },
  ];

  const visibleNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg lg:shadow-none lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b lg:hidden shrink-0">
          <span className="font-bold text-lg text-slate-800">Menu</span>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="px-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md font-medium transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-100 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t lg:hidden">
          <Button 
            variant="outline" 
            className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
