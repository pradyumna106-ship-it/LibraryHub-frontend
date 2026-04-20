import { Bell, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header({
  unreadCount,
  setShowNotifications,
  handleNavigation,
  logo,
  searchQuery,
  setSearchQuery,
  onMenuToggle,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const handleNavByRole = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      handleNavigation("/crud-book");
    } else {
      handleNavigation("/view-all-books");
    }
  };
  return (
    <div className="w-full bg-gradient-to-r from-[#93A5CF] via-[#B4ECE9] to-[#93A5CF] shadow-sm">
      {/* Main header row */}
      <div className="h-[64px] md:h-[94px] flex items-center justify-between px-3 md:px-6 gap-2">
 
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-white/30 transition-colors"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
 
          {/* Logo */}
          <img
            src={logo}
            className="w-8 h-8 md:w-10 md:h-10 cursor-pointer object-contain"
            alt="logo"
            onClick={handleNavByRole}
          />
        </div>
 
        {/* Center: Search bar — hidden on mobile when collapsed */}
        <div
          className={`
            hidden md:flex items-center bg-white border rounded-full px-4 py-2 w-[300px]
          `}
        >
          <input
            data-testid="search-input"
            value={searchQuery}
            onFocus={handleNavByRole}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm"
            placeholder="Search books (title/author/publisher)..."
          />
          <Search size={16} className="text-gray-400 shrink-0" />
        </div>
 
        {/* Right: Actions */}
        <div className="flex items-center gap-1 md:gap-4 shrink-0">
          {/* Search icon — mobile only */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-white/30 transition-colors"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              handleNavByRole();
            }}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
 
          {/* Bell */}
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-1.5 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] min-w-[16px] h-4 flex items-center justify-center px-0.5 rounded-full font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
 
          {/* Profile */}
          <button
            onClick={() => handleNavigation("/profile")}
            className="p-1.5 rounded-lg hover:bg-white/30 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </div>
 
      {/* Mobile expandable search bar */}
      {searchOpen && (
        <div className="md:hidden px-3 pb-3">
          <div className="flex items-center bg-white border rounded-full px-4 py-2 w-full shadow-sm">
            <input
              data-testid="search-input-mobile"
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm"
              placeholder="Search books (title/author/publisher)..."
            />
            <button onClick={() => setSearchOpen(false)}>
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}