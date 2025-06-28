import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';
import { LogOut, Shield, Users, Calendar, Settings, Heart, Image } from "lucide-react";

const AdminLayout = () => {
  const { teacher, logout } = useTeacherAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminNavItems = [
    { label: "Dashboard", href: "/admin", icon: <Shield className="w-4 h-4" /> },
    { label: "Teacher Management", href: "/admin/teachers", icon: <Users className="w-4 h-4" /> },
    { label: "Teacher Verification", href: "/admin/verification", icon: <Users className="w-4 h-4" /> },
    { label: "Attendance Overview", href: "/admin/attendance", icon: <Calendar className="w-4 h-4" /> },
    { label: "Contributors", href: "/admin/contributors", icon: <Heart className="w-4 h-4" /> },
    { label: "Gallery Management", href: "/admin/gallery", icon: <Image className="w-4 h-4" /> },
    { label: "Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {teacher?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{teacher?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
        </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
        </nav>
        </aside>

      {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
