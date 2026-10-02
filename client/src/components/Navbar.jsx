import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Trophy, LogIn, LogOut } from 'lucide-react';

export default function Navbar({ isAdminLoggedIn, setIsAdminLoggedIn }) {
  const navigate = useNavigate();


  const navLinkClass = ({ isActive }) => 
    isActive 
      ? "text-amber-400 font-bold transition" 
      : "text-white hover:text-amber-300 transition font-medium";

  return (
    <nav className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Trophy className="h-7 w-7 text-amber-400" />
            <span className="font-bold text-xl tracking-wide">SCMG FOOTBALL CLUB</span>
          </Link>
          
          <div className="flex flex-wrap md:flex-nowrap space-x-4 md:space-x-6 items-center">
            <NavLink to="/" className={navLinkClass} end>Home Page</NavLink>
            <NavLink to="/players" className={navLinkClass}>All Players</NavLink>
            <NavLink to="/stats" className={navLinkClass}>Stats</NavLink>
          </div>

          <div>
            {!isAdminLoggedIn ? (
              <NavLink 
                to="/admin"
                className={({ isActive }) => `flex items-center space-x-1 font-semibold px-4 py-2 rounded-lg transition shadow-xs ${isActive ? 'bg-amber-600 text-gray-900' : 'bg-amber-500 hover:bg-amber-600 text-gray-900'}`}
              >
                <LogIn className="h-4 w-4" />
                <span>Admin Login</span>
              </NavLink>
            ) : (
              <button 
                onClick={() => { 
                  localStorage.removeItem('isAdminAuthenticated');
                  setIsAdminLoggedIn(false); 
                  navigate('/'); 
                }}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-xs"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}