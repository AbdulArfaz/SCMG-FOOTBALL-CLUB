import React, { useState } from "react";
import { Lock, User, ShieldAlert } from "lucide-react";
import axios from "axios";
import api from "../services/api.js";

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/admin/login", {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("isAdminAuthenticated", "true");

        window.location.reload();
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-black text-gray-900">
            Admin Control Center
          </h1>
          <p className="text-xs text-gray-500">
            Enter your credentials to access management tools
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-emerald-600 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm bg-gray-50 outline-none focus:bg-white focus:border-emerald-600 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition shadow-sm text-sm"
          >
            {loading ? "Verifying..." : "Login to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
