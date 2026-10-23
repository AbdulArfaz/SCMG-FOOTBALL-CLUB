import React, { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Trophy,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Home,
  Users,
  BarChart3,
  Images,
  History,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

export default function Navbar({
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close the menu with the Escape key.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navItems = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/players", label: "Players", icon: Users },
    { to: "/stats", label: "Stats", icon: BarChart3 },
    { to: "/pictures", label: "Gallery", icon: Images },
    { to: "/old-media", label: "Vintage", icon: History },
    {
      to: "/tournaments",
      label: "Tournaments",
      icon: CalendarDays,
    },
  ];

  const desktopLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-emerald-400/10 text-emerald-300"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
        : "border border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAdminLoggedIn(false);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-emerald-400/15 bg-slate-950/95 text-white shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-3 sm:h-20">

            {/* Club branding */}
            <Link
              to="/"
              className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
              aria-label="SCMG Football Club home"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg shadow-emerald-950/60 transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
                <Trophy className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-amber-400" />
              </div>

              <div className="min-w-0">
                <div className="bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-lg font-black leading-tight tracking-[0.12em] text-transparent sm:text-xl">
                  SCMG
                </div>
                <div className="mt-0.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400 sm:text-[10px] sm:tracking-[0.2em]">
                  Football Club
                </div>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-1.5 lg:flex">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={desktopLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 ${
                          isActive
                            ? "text-emerald-300"
                            : "text-slate-400"
                        }`}
                      />
                      <span>{label}</span>
                      {isActive && (
                        <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-emerald-400" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Desktop admin action */}
            <div className="hidden shrink-0 items-center lg:flex">
              {!isAdminLoggedIn ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-amber-300 text-slate-950"
                        : "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-950/20 hover:-translate-y-0.5 hover:from-amber-300 hover:to-amber-400"
                    }`
                  }
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Login
                </NavLink>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>

            {/* Mobile / tablet menu toggle */}
            <button
              type="button"
              onClick={() => setIsOpen((previous) => !previous)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 lg:hidden"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile and tablet navigation panel */}
        <div
          id="mobile-navigation"
          className={`overflow-hidden border-t border-emerald-400/10 bg-slate-950 transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
            isOpen
              ? "visible max-h-[85vh] opacity-100"
              : "invisible max-h-0 opacity-0"
          }`}
          aria-hidden={!isOpen}
        >
          <div className="mx-auto max-w-7xl space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {/* Mobile menu heading */}
            <div className="flex items-center justify-between px-1 pb-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Club Navigation
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Explore SCMG Football Club
                </p>
              </div>
              <Trophy className="h-5 w-5 text-emerald-500/70" />
            </div>

            {/* Navigation links */}
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass}
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                            isActive
                              ? "bg-emerald-400/15 text-emerald-300"
                              : "bg-white/[0.04] text-slate-400 group-hover:text-emerald-300"
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        {label}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
                          isActive
                            ? "text-emerald-300"
                            : "text-slate-600"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile admin action */}
            <div className="border-t border-white/[0.08] pt-4">
              {!isAdminLoggedIn ? (
                <NavLink
                  to="/admin"
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-950/20 transition hover:from-amber-300 hover:to-amber-400"
                >
                  <LogIn className="h-4 w-4" />
                  Admin Login
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>

            <p className="pb-1 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
              Passion • Teamwork • Football
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        />
      )}
    </>
  );
}