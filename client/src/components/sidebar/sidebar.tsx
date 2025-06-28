import { cn } from "@/lib/utils";
import {
  Book,
  Calendar,
  Home,
  LogOut,
  Settings,
  User,
  Image,
  Heart,
  BookOpen,
  Shield,
  Clock,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { type ReactNode } from "react";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";

type SidebarItems = {
  label: string;
  icon: ReactNode;
  href: string;
  requiresVerification?: boolean;
  requiresAdmin?: boolean;
  sub?: {
    label: string;
    href: string;
  }[];
};

const Sidebar = () => {
  const { teacher } = useTeacherAuth();

const sidebarItems: SidebarItems[] = [
    // Admin-specific items
    ...(teacher?.isAdmin ? [
      {
        label: "Admin Panel",
        icon: <Shield className="w-5 h-5" />,
        href: "/admin",
        requiresAdmin: true,
      },
    ] : []),
    
    // Regular teacher items (only for non-admin verified teachers)
    ...(!teacher?.isAdmin ? [
  {
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/dashboard",
        requiresVerification: true,
  },
  {
    label: "Students",
    icon: <User className="w-5 h-5" />,
    href: "/view-all-students",
        requiresVerification: true,
  },
  {
    label: "Attendance",
    icon: <Calendar className="w-5 h-5" />,
    href: "/attendance",
        requiresVerification: true,
  },
      { 
        label: "Teachers", 
        icon: <User className="w-5 h-5" />, 
        href: "/teachers",
        requiresVerification: true,
      },
  {
    label: "Homework",
    icon: <BookOpen className="w-5 h-5" />,
    href: "/homework",
        requiresVerification: true,
  },
      { 
        label: "Gallery", 
        icon: <Image className="w-5 h-5" />, 
        href: "/gallery",
        requiresVerification: true,
      },
  {
    label: "Contributors",
    icon: <Heart className="w-5 h-5" />,
    href: "/contributors",
        requiresVerification: true,
  },
      { 
        label: "Syllabus", 
        icon: <Book className="w-5 h-5" />, 
        href: "/syllabus",
        requiresVerification: true,
      },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
        requiresVerification: true,
  },
    ] : []),
    
    // Common items
  {
    label: "Logout",
    icon: <LogOut className="w-5 h-5 text-red-500" />,
    href: "/logout",
  },
];

  // Filter items based on verification status and admin role
  const filteredItems = sidebarItems.filter(item => {
    if (item.requiresAdmin && !teacher?.isAdmin) return false;
    if (item.requiresVerification && !teacher?.isVerified) return false;
    return true;
  });

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Menu
        </h2>
        {teacher && !teacher.isVerified && (
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            <Clock className="w-3 h-3" />
            <span>Pending Verification</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1 px-2 sm:px-3">
          {filteredItems.map((item, i) => {
            // Dim these features for teachers
            const dimmed = ["/gallery", "/contributors", "/syllabus", "/settings"].includes(item.href);
            return item.href === "/admin" || item.href === "/logout" ? (
              <Link
                key={i}
                to={item.href}
                className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="truncate">{item.label}</span>
              </Link>
            ) : (
            <NavLink
              key={i}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all hover:bg-gray-100",
                  isActive
                    ? "bg-gray-100 text-primary font-medium"
                    : "text-gray-700 hover:text-gray-900",
                  dimmed ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                )
              }
              tabIndex={dimmed ? -1 : 0}
              title={dimmed ? "Coming soon" : undefined}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="truncate">{item.label}</span>
              {dimmed && (
                <span className="ml-2 text-xs text-gray-400"></span>
              )}
            </NavLink>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-xs sm:text-sm">
              {teacher?.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {teacher?.name}
            </p>
            <div className="flex items-center gap-1">
            <p className="text-xs text-gray-500 truncate">
              {teacher?.isAdmin ? "Admin" : "Teacher"}
            </p>
              {teacher?.isVerified && (
                <Shield className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
