import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";
import { Button } from "../ui/button";

interface LayoutProps {
  children: React.ReactNode;
  onMenuClick?: () => void;
}

function Layout({ children }: LayoutProps): React.ReactNode {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const closeSidebar = () => {
    // console.log("Closing sidebar");
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    // console.log("Opening sidebar");
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:w-64">
        {!isAdminRoute && <Sidebar />}
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeSidebar}
        />

        {/* Sidebar panel */}
        <div
          className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative h-full">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-50">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-background/90 shadow-lg hover:bg-background"
                onClick={closeSidebar}
              >
                <svg
                  className="h-4 w-4 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            {/* Sidebar content */}
            <Sidebar onClose={closeSidebar} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10">
          <Navbar onMenuClick={openSidebar} />
        </div>
        <main className="flex-1 overflow-y-auto bg-background px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
