import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  User,
  Menu,
  LogOut,
  UserCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeacherAuth } from "@/contexts/teacherAuthContext";
import { useTheme } from "@/contexts/themeContext";
import pahalLogo from "../../assets/pahalLogo.png";

interface NavbarProps {
  onMenuClick?: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  // const [notifications] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();
  const { teacher } = useTeacherAuth();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      // Add your auth logic here
    };
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-14 sm:h-16 items-center px-2 sm:px-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden h-8 w-8 sm:h-9 sm:w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Pahal Logo & Title */}
        <div className="flex items-center gap-1 sm:gap-2">
          <img
            src={pahalLogo}
            alt="Pahal Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-contain bg-white dark:bg-gray-800 shadow"
          />
          <span className="text-lg sm:text-xl font-bold">Pahal</span>
        </div>

        {/* Right side items */}
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 px-0"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>

          {/* Notifications */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 sm:w-9 sm:h-9 px-0 relative"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {notifications > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-3 w-3 sm:h-4 sm:w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button> */}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 sm:w-9 sm:h-9 px-0"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              {teacher?.avatar ? (
                <img
                  src={teacher.avatar}
                  alt="Profile"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover"
                />
              ) : (
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border py-1 z-50 animate-in slide-in-from-top-2 duration-200 bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark]">
                {teacher && (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        {teacher.avatar ? (
                          <img
                            src={teacher.avatar}
                            alt="Profile"
                            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {teacher.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {teacher.email}
                          </div>
                          {teacher.isAdmin && (
                            <div className="flex items-center gap-1 mt-1">
                              <Shield className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">
                                Administrator
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate(
                            teacher.isAdmin
                              ? "/admin/profile"
                              : "/teacher/profile"
                          );
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors duration-150"
                      >
                        <UserCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>Edit Profile</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          navigate("/logout");
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors duration-150"
                      >
                        <LogOut className="h-4 w-4 text-red-500 dark:text-red-400" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
