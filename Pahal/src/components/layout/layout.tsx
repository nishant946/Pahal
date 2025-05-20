import React from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps): React.ReactNode {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full">
        <Navbar />
      </div>

      <div className="flex flex-row w-full">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <footer>
        <p>© 2023 My Application</p>
      </footer>
    </div>
  );
}

export default Layout;
