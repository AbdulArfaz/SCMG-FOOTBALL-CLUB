import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// User Pages
import HomeDashboard from './pages/HomeDashboard';
import AllPlayersView from './pages/AllPlayersView';
import StatsView from './pages/StatsView';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem('isAdminAuthenticated') === 'true'
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Navbar isAdminLoggedIn={isAdminLoggedIn} setIsAdminLoggedIn={setIsAdminLoggedIn} />
        
        <main className="py-8">
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<HomeDashboard />} />
            <Route path="/players" element={<AllPlayersView />} />
            <Route path="/stats" element={<StatsView />} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                isAdminLoggedIn ? (
                  <AdminDashboard setIsAdminLoggedIn={setIsAdminLoggedIn} />
                ) : (
                  <AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}