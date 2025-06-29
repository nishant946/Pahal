import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick?: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  // const [notifications] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Add your auth logic here
    };
    checkAuth();
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Add actual theme toggle logic here
  };

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
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-xl">P</span>
          </div>
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
          >
            {isDark ? (
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

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 sm:w-9 sm:h-9 px-0"
            onClick={() => navigate("/profile")}
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
