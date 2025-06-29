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

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { teacher } = useTeacherAuth();

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  const sidebarItems: SidebarItems[] = [
    // Admin-specific items
    ...(teacher?.isAdmin
      ? [
          {
            label: "Admin Panel",
            icon: <Shield className="w-5 h-5" />,
            href: "/admin",
            requiresAdmin: true,
          },
        ]
      : []),

    // Regular teacher items (only for non-admin verified teachers)
    ...(!teacher?.isAdmin
      ? [
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
        ]
      : []),

    // Common items
    {
      label: "Logout",
      icon: <LogOut className="w-5 h-5 text-red-500" />,
      href: "/logout",
    },
  ];

  // Filter items based on verification status and admin role
  const filteredItems = sidebarItems.filter((item) => {
    if (item.requiresAdmin && !teacher?.isAdmin) return false;
    if (item.requiresVerification && !teacher?.isVerified) return false;
    if (item.label === 'Settings') return false;
    return true;
  });

  return (
    <div className="w-full h-full bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-2xl flex flex-col rounded-r-2xl overflow-hidden transition-all duration-300">
      {/* Sidebar Header */}
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-bold text-gray-900 tracking-wide mb-2">
          Menu
        </h2>
        {teacher && !teacher.isVerified && (
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3" />
            <span>Pending Verification</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1 px-2 md:px-4">
          {filteredItems.map((item, i) => {
            // Dim these features for teachers
            const dimmed = [
              "/gallery",
              "/contributors",
              "/syllabus",
              "/settings",
            ].includes(item.href);
            return item.href === "/admin" || item.href === "/logout" ? (
              <Link
                key={i}
                to={item.href}
                onClick={handleLinkClick}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700"
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="truncate">{item.label}</span>
              </Link>
            ) : (
              <NavLink
                key={i}
                to={item.href}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary font-bold shadow-md"
                      : "text-gray-700 hover:text-primary",
                    dimmed
                      ? "opacity-50 pointer-events-none cursor-not-allowed"
                      : ""
                  )
                }
                tabIndex={dimmed ? -1 : 0}
                title={dimmed ? "Coming soon" : undefined}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="truncate">{item.label}</span>
                {dimmed && <span className="ml-2 text-xs text-gray-400"></span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-5 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-bold text-xl">
              {teacher?.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-gray-900 truncate">
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
