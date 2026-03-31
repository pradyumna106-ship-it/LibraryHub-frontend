
import { Bell, User, Search } from "lucide-react";

export default function Header({
  unreadCount,
  setShowNotifications,
  handleNavigation,
  logo
}) {
  const handleNavByRole = () => {
    const role = localStorage.getItem('role') || "admin"
    if (role === "admin") {
      handleNavigation("/crud-book")
    } else {
      handleNavigation("/view-all-books")
    }
  }
  return (
    <div className="h-[94px] w-full flex items-center justify-between px-6 relative bg-linear-to-r from-[#93A5CF] via-[#B4ECE9] to-[#93A5CF]">
      <img src={logo} className="w-10" alt="logo" />
      <div onClick={() => handleNavByRole()} className="flex items-center bg-white border rounded-full px-4 py-2 w-[300px] cursor-pointer">
          <input className="flex-1 outline-none bg-transparent cursor-pointer" placeholder="Search books..."/>
          <Search size={16} />
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setShowNotifications(prev => !prev)} className="relative">
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button onClick={() => handleNavigation("/profile")}>
          <User size={22} />
        </button>
      </div>
    </div>
  );
}