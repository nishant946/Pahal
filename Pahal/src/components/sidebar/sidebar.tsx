import { cn } from "@/lib/utils";
import { Book, Calendar, Home, LogOut, Settings, User, Image, Heart } from "lucide-react";
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
  { label: "Students", icon: <User className="w-5 h-5" />, href: "/view-all-students" },
  { label: "Attendance", icon: <Calendar className="w-5 h-5" />, href: "/attendance" },
  { label: "Teachers", icon: <User className="w-5 h-5" />, href: "/teachers" },
  { label: "Gallery", icon: <Image className="w-5 h-5" />, href: "/gallery" },
  { label: "Contributors", icon: <Heart className="w-5 h-5" />, href: "/contributors" },
  { label: "Syllabus", icon: <Book className="w-5 h-5" />, href: "/syllabus" },
  { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/settings" },
  { label: "Logout", icon: <LogOut className="w-5 h-5 text-red-500" />, href: "/logout" },
]



const Sidebar: React.FC = () => {
    return(
        <div className="w-64 h-screen bg-primary-foreground shadow-md p-4 space-y-6">
            <nav className="flex flex-col space-y-1">
                {sidebarItems.map((item, i) => (
                    <div key={i}>
                        <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition",
                                    isActive ? "bg-gray-100 font-semibold text-primary" : ""
                                )
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    </div>
                ))}
            </nav>
        </div>
    )}


export default Sidebar;


