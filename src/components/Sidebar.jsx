export default function Sidebar({ menuItems, navigate, isActive }) {
  return (
    <div className="h-full w-[305px] shrink-0 relative bg-linear-to-r from-[#D9C88A] to-[#93A5CF] overflow-hidden">

      {/* ✅ Menu (above SVG) */}
      <nav className="mt-10 flex flex-col relative z-10">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              console.log("Clicked:", item.path); // 🔍 debug
              navigate(item.path);
            }}
            className={`text-left px-6 py-3 ${
              isActive(item.path)
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

    </div>
  );
}