import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const desktopHoverTimeout = useRef(null);
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
    const fetchData = async () => {
      await loadNotifications();
    };
    fetchData();
  }, []);

    useEffect(() => {
    return () => {
      if (desktopHoverTimeout.current) clearTimeout(desktopHoverTimeout.current);
    };
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

      const handleDesktopMouseEnter = () => {
        if (desktopHoverTimeout.current) clearTimeout(desktopHoverTimeout.current);
        setDesktopSidebarOpen(true);
      };
 
      const handleDesktopMouseLeave = () => {
        desktopHoverTimeout.current = setTimeout(() => {
          setDesktopSidebarOpen(false);
        }, 200);
      };

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
        onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)}
      />

      {/* 🔥 BELOW HEADER */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── MOBILE OVERLAY ── */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
 
        {/* ── MOBILE SIDEBAR (slide left→right) ── */}
        <div
          className={`
            fixed top-0 left-0 h-full z-40 md:hidden
            transition-transform duration-300 ease-in-out
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar
            menuItems={currentMenu}
            navigate={handleNavigation}
            isActive={isActive}
          />
        </div>
 
        {/* ── DESKTOP SIDEBAR (hover reveal) ── */}
        <div
          className="hidden md:block relative z-20 h-full"
          onMouseEnter={handleDesktopMouseEnter}
          onMouseLeave={handleDesktopMouseLeave}
        >
           {/* Thin trigger strip always visible so user knows sidebar is there */}
            <div
              className={`
                h-full transition-all duration-300 ease-in-out overflow-hidden
                ${desktopSidebarOpen ? "w-64" : "w-2"}
              `}
              style={{ minWidth: desktopSidebarOpen ? undefined : "8px" }}
            >
              <div className="h-full" style={{ width: "256px" }}>
                <Sidebar
                  menuItems={currentMenu}
                  navigate={handleNavigation}
                  isActive={isActive}
                />
              </div>
            </div>
          </div>

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

      {/* ── MOBILE FLOATING HAMBURGER (fallback if Header doesn't have one) ── */}
      <button
        className="
          fixed bottom-6 left-4 z-50 md:hidden
          bg-gray-800 text-white rounded-full w-12 h-12
          flex items-center justify-center shadow-lg
          active:scale-95 transition-transform
        "
        onClick={() => setMobileSidebarOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        {mobileSidebarOpen ? (
          // X icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Hamburger icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default Layout;
