
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BookOpen, 
  Package, 
  Users, 
  LogOut 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  
  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/admin/courses', icon: BookOpen, label: 'Khoá học' },
    { path: '/admin/templates', icon: Package, label: 'Templates' },
    { path: '/admin/users', icon: Users, label: 'Người dùng' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Haismartlife</span>
            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Admin</span>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    className={`w-full justify-start ${
                      location.pathname === item.path ? 'bg-primary text-white' : ''
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
            <li className="pt-4 border-t mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.label || 'Quản trị'}
          </h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
