import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { notifications as notificationsData } from "../data/mockData.js";
import NotificationPanel from "../components/NotificationPanel.jsx";
import img from "../assets/logo.webp";
function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavigation = (path) => {
    navigate(path);
  };

const isActive = (path) => location.pathname === path;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const menuItems = [
      { label: "DASHBOARD", path: "/dashboard" },
      { label: "VIEW ALL BOOKS", path: "/view-all-books" },
      { label: "MY BOOKS", path: "/my-books" },
      { label: "BORROWED BOOKS", path: "/borrowed-books" },
      { label: "HISTORY", path: "/history" },
    ];
  const menu = [
      {label: "DASHBOARD", path: "/admin-dashboard"},
      {label: "UPADATE CATALOGUE", path: "/crud-book"},
      {label: "MANAGE USER ACCOUNT", path: "/crud-member"},
      {label: "ISSUE BOOKS", path: "/issue-book"},
      {label: "TRANSACTIONS", path: "/transaction"},
      {label: "HISTORY", path: "/admin-history"},
    ]
  const role = localStorage.getItem('role') || "admin"; // dynamic later

    const currentMenu = role === "admin" ? menu : menuItems;
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">

      {/* 🔥 HEADER FULL WIDTH */}
      <Header
        unreadCount={unreadCount}
        setShowNotifications={setShowNotifications}
        handleNavigation={handleNavigation}
        logo={img}
      />

      {/* 🔥 BELOW HEADER */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          menuItems={currentMenu}
          navigate={handleNavigation}
          isActive={isActive}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-white relative">

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
