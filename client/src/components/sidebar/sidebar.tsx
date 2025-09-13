import { cn } from "@/lib/utils";
import {
  Calendar,
  Home,
  LogOut,
  Settings,
  User,
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
            label: "Progress",
            icon: <BookOpen className="w-5 h-5" />,
            href: "/progress",
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

    // Common items (available to everyone)
    {
      label: "Contributors",
      icon: <Heart className="w-5 h-5" />,
      href: "/contributors",
    },
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
    if (item.label === "Settings") return false;
    return true;
  });

  return (
    <div className="w-full h-full bg-sidebar/80 backdrop-blur-md border-r border-sidebar-border shadow-2xl flex flex-col rounded-r-2xl overflow-hidden transition-all duration-300">
      {/* Sidebar Header */}
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-bold text-sidebar-foreground tracking-wide mb-2">
          Menu
        </h2>
        {teacher && !teacher.isVerified && (
          <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
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
            const dimmed = ["/settings"].includes(item.href);
            return item.href === "/admin" || item.href === "/logout" ? (
              <Link
                key={i}
                to={item.href}
                onClick={handleLinkClick}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring text-sidebar-foreground"
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
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring",
                    isActive
                      ? "bg-gradient-to-r from-sidebar-primary/20 to-sidebar-primary/5 text-sidebar-primary font-bold shadow-md"
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
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
                {dimmed && (
                  <span className="ml-2 text-xs text-muted-foreground"></span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-5 bg-sidebar/60 backdrop-blur-md">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sidebar-primary/80 to-sidebar-primary flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-sidebar-primary-foreground font-bold text-xl">
              {teacher?.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-sidebar-foreground truncate">
              {teacher?.name}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground truncate">
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
