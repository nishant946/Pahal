import { Outlet, useNavigate, Link } from "react-router-dom";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";
import { LogOut, Shield, Users, Calendar, Settings, Heart } from "lucide-react";

const AdminLayout = () => {
  const { teacher, logout } = useTeacherAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminNavItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      label: "Teacher Management",
      href: "/admin/teachers",
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Attendance Overview",
      href: "/admin/attendance",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      label: "Contributors",
      href: "/admin/contributors",
      icon: <Heart className="w-4 h-4" />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">
                Admin Panel
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {teacher?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {teacher?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
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
        <aside className="w-64 bg-card shadow-sm border-r border-border min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors"
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
