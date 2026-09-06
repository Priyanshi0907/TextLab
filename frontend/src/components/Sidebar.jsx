import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Sparkles,
  Tag,
  ClipboardList,
  LineChart,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LogOut,
  ChevronUp,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/text-processor", label: "Text Processor", icon: Sparkles },
  { to: "/classify-text", label: "Classify Text", icon: Tag },
  { to: "/batch-analysis", label: "Batch Analysis", icon: ClipboardList },
  { to: "/model-performance", label: "Model Performance", icon: LineChart },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function TextLabLogo() {
  return (
    <div className="w-11 h-11 rounded-2xl bg-[#23281c] border border-[#37402c] flex items-center justify-center shrink-0 shadow-inner">
      <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
        <path
          d="M20 5C11.716 5 5 11.268 5 19c0 2.903.932 5.596 2.538 7.844L5.5 34.5l8.116-2.164A15.103 15.103 0 0020 33c8.284 0 15-6.268 15-14S28.284 5 20 5z"
          stroke="#98a87c"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M20 26V15" stroke="#98a87c" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 15c-1.8-2.8-.7-6 1.4-6.8 2 .8 3 4.2 1.4 6.8z" fill="#98a87c" />
        <path d="M20 19c-3-.8-5.5-3-5-5.2 2.2.3 4.5 2.7 5 5.2z" fill="#98a87c" />
        <path d="M20 21.5c3-.8 5.5-3 5-5.2-2.2.3-4.5 2.7-5 5.2z" fill="#98a87c" />
      </svg>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("textlab_user");
      return saved ? JSON.parse(saved) : { name: "Priyanshi", email: "priyanshi@example.com" };
    } catch {
      return { name: "Priyanshi", email: "priyanshi@example.com" };
    }
  });
  const menuRef = useRef();

  useEffect(() => {
    function loadUser() {
      try {
        const saved = localStorage.getItem("textlab_user");
        if (saved) setUser(JSON.parse(saved));
      } catch {}
    }
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSignOut() {
    setShowMenu(false);
    localStorage.removeItem("textlab_user");
    navigate("/login");
  }

  const initial = user?.name ? user.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <aside className="w-[272px] shrink-0 bg-sidebar border-r border-border h-screen sticky top-0 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 px-6 pt-8 pb-8">
          <TextLabLogo />
          <div>
            <div className="text-[19px] font-extrabold tracking-[0.12em] text-ink leading-none">
              TEXTLAB
            </div>
            <div className="text-[11px] text-ink-muted leading-snug mt-1">
              Text Processing &amp;
              <br />
              Classification Studio
            </div>
          </div>
        </div>

        <nav className="px-4 flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-[14.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-tan text-[#241d10]"
                    : "text-ink-soft hover:bg-surface hover:text-ink"
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-4 pb-6 relative" ref={menuRef}>
        {showMenu && (
          <div className="absolute bottom-[76px] left-4 right-4 bg-[#1f2219] border border-[#353d2c] rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 z-50">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13.5px] font-medium text-danger hover:bg-danger/10 rounded-xl transition-colors cursor-pointer text-left"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-surface-2/60 border border-border/80 hover:border-tan/40 hover:bg-surface-2 transition-all text-ink-soft hover:text-ink cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-tan flex items-center justify-center text-[#241d10] font-bold text-[12.5px] shrink-0">
              {initial}
            </div>
            <div className="text-left min-w-0 flex-1 truncate">
              <div className="text-[13px] font-semibold leading-tight text-ink truncate">
                {user?.name || "User"}
              </div>
              <div className="text-[11px] text-ink-muted truncate">
                {user?.email || "user@example.com"}
              </div>
            </div>
          </div>
          <ChevronUp
            size={16}
            className={`text-ink-faint group-hover:text-ink transition-transform duration-200 shrink-0 ml-1 ${
              showMenu ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
}
