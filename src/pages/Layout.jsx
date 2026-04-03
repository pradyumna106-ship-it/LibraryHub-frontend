import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { notifications as notificationsData } from "../data/mockData.js";
import NotificationPanel from "../components/NotificationPanel.jsx";
import img from "../assets/logo.webp";
import {
  getNotifications as fetchNotificationsApi,
  markAllNotificationsAsRead as markAllNotificationsAsReadApi,
  markNotificationAsRead as markNotificationAsReadApi,
} from "../api/notificationApi.js";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavigation = (path) => {
    navigate(path);
  };

const isActive = (path) => location.pathname === path;

  const toBackendRole = () => {
    const role = localStorage.getItem("role") || "admin";
    return role === "admin" ? "Admin" : "Member";
  };

  const loadNotifications = async () => {
    try {
      const role = toBackendRole();
      const userId = localStorage.getItem("id");
      const res = await fetchNotificationsApi(role, userId);
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsReadApi(id);
      setNotifications((prev) =>
        prev.map((n) =>
          (n._id || n.id) === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const role = toBackendRole();
      const userId = localStorage.getItem("id");
      await markAllNotificationsAsReadApi(role, userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
}

export default Layout;
