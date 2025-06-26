import React from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Settings,
  UserCheck,
  Calendar,
  Image,
  Heart,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Teacher Management', path: '/admin/teachers' },
    { icon: Heart, label: 'Contributors', path: '/admin/contributors' },
    { icon: UserCheck, label: 'Teacher Verification', path: '/admin/verify-teachers' },
    { icon: Calendar, label: 'Attendance Overview', path: '/admin/attendance' },
    { icon: Image, label: 'Gallery Management', path: '/admin/gallary' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: LogOut, label: 'LogOut', path: '/admin/logout' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">Pahal Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.path)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
