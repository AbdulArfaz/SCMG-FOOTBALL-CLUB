import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Trophy, LogIn, LogOut, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar({ isAdminLoggedIn, setIsAdminLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
      isActive
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAdminLoggedIn(false);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-linear-to-r from-slate-950 via-emerald-950 to-slate-950 text-white shadow-2xl border-b border-emerald-800/40 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-900/40 group-hover:scale-105 transition duration-300 border border-emerald-400/30">
              <Trophy className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-wider bg-linear-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
                SCMG
              </span>
              <span className="text-[10px] tracking-widest text-emerald-400 font-bold uppercase -mt-1">
                Football Club
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-2 items-center bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <NavLink to="/" className={navLinkClass} end>
              Home Page
            </NavLink>
            <NavLink to="/players" className={navLinkClass}>
              All Players
            </NavLink>
            <NavLink to="/stats" className={navLinkClass}>
              Stats
            </NavLink>
            <NavLink to="/pictures" className={navLinkClass}>
              Pictures
            </NavLink>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center">
            {!isAdminLoggedIn ? (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-amber-500/20"
                      : "bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 hover:shadow-amber-500/30 transform hover:-translate-y-0.5"
                  }`
                }
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-red-900/30 transform hover:-translate-y-0.5"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-emerald-900/40 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl animate-fadeIn">
          <div className="space-y-1">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkClass}
              end
            >
              Home Page
            </NavLink>
            <NavLink
              to="/players"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkClass}
            >
              All Players
            </NavLink>
            <NavLink
              to="/stats"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkClass}
            >
              Stats
            </NavLink>
            <NavLink
              to="/pictures"
              onClick={() => setIsOpen(false)}
              className={mobileNavLinkClass}
            >
              Pictures
            </NavLink>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            {!isAdminLoggedIn ? (
              <NavLink
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full bg-linear-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-md"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </NavLink>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full bg-linear-to-r from-rose-600 to-red-600 text-white font-bold px-4 py-3 rounded-xl shadow-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
