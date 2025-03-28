import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

    return hideSidebar ? (
        <main className="h-screen p-6">{children}</main>
    ) : (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
