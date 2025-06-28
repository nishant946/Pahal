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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { type ReactNode } from "react";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";

type SidebarItems = {
  label: string;
  icon: ReactNode;
  href: string;
  sub?: {
    label: string;
    href: string;
  }[];
};

const sidebarItems: SidebarItems[] = [
  {
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    label: "Students",
    icon: <User className="w-5 h-5" />,
    href: "/view-all-students",
  },
  {
    label: "Attendance",
    icon: <Calendar className="w-5 h-5" />,
    href: "/attendance",
  },
  { label: "Teachers", icon: <User className="w-5 h-5" />, href: "/teachers" },
  {
    label: "Homework",
    icon: <BookOpen className="w-5 h-5" />,
    href: "/homework",
  },
  { label: "Gallery", icon: <Image className="w-5 h-5" />, href: "/gallery" },
  {
    label: "Contributors",
    icon: <Heart className="w-5 h-5" />,
    href: "/contributors",
  },
  { label: "Syllabus", icon: <Book className="w-5 h-5" />, href: "/syllabus" },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
  {
    label: "Logout",
    icon: <LogOut className="w-5 h-5 text-red-500" />,
    href: "/logout",
  },
];

const Sidebar = () => {
  const { teacher } = useTeacherAuth();
  // console.log(teacher);

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Menu
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1 px-2 sm:px-3">
          {sidebarItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all hover:bg-gray-100",
                  isActive
                    ? "bg-gray-100 text-primary font-medium"
                    : "text-gray-700 hover:text-gray-900"
                )
              }
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-medium text-xs sm:text-sm">
              {teacher?.username.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {teacher?.username}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {teacher?.isAdmin ? "Admin" : "Teacher"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
