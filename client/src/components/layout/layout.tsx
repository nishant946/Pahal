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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex">
        {!isAdminRoute && <Sidebar />}
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden pointer-events-none`}>
        {/* Overlay with fade and blur animation */}
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm transition-all duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        {/* Sidebar panel with slide animation and persistent shadow */}
        <div className={`fixed inset-y-0 left-0 flex w-full max-w-xs transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}> 
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white/80 backdrop-blur-md pt-5 pb-4 shadow-2xl rounded-r-2xl">
            {isSidebarOpen && (
              <div className="absolute top-0 right-0 -mr-12 pt-2 z-50">
                <Button
                  variant="ghost"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            )}
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50 px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
