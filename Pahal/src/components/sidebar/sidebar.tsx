import { cn } from "@/lib/utils";
import { Book, Calendar, Home, LogOut, Settings, User, Users } from "lucide-react";
import type { JSX } from "react";
import { NavLink } from "react-router-dom";


type SidebarItems = {
    label: string;
    icon: JSX.Element;
    href: string;
    sub?: {
        label: string;
        href: string;
    }[];
};



const sidebarItems: SidebarItems[] = [
  { label: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/dashboard" },
  {
    label: "Students",
    icon: <User className="w-5 h-5" />,
    href: "#",
    sub: [
      { label: "View All Students", href: "/students" },
      { label: "Add New Student", href: "/students/add" },
      { label: "Student Profiles", href: "/students/profiles" },
    ],
  },
  { label: "Attendance", icon: <Calendar className="w-5 h-5" />, href: "/attendance" },
  { label: "Teachers", icon: <User className="w-5 h-5" />, href: "/teachers" },
  { label: "Groups", icon: <Users className="w-5 h-5" />, href: "/groups" },
  { label: "Syllabus", icon: <Book className="w-5 h-5" />, href: "/syllabus" },
  { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/settings" },
  { label: "Logout", icon: <LogOut className="w-5 h-5 text-red-500" />, href: "/logout" },
]



const Sidebar: React.FC = () => {
    return(
        <div className="w-64 h-screen bg-primary-foreground shadow-md p-4 space-y-6">
            <div className="text-xl font-bold pl-2">Dashboard</div>
            <nav className="flex flex-col space-y-1">
        {sidebarItems.map((item, i) => (
          <div key={i}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition",
                  isActive ? "bg-gray-100 font-semibold" : ""
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>

            {item.sub && (
              <div className="ml-8 mt-1 space-y-1">
                {item.sub.map((s: { label: string; href: string; }, idx: number) => (
                  <NavLink
                    key={idx}
                    to={s.href}
                    className={({ isActive }) =>
                      cn(
                        "block text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-50",
                        isActive ? "bg-gray-50 font-medium" : ""
                      )
                    }
                  >
                    {s.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
        </div>
    )}


export default Sidebar;


