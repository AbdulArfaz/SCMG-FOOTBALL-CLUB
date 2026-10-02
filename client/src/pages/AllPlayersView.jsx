import React, { useState, useEffect } from "react";
import { Users, Shield, User } from "lucide-react";
import { fetchPlayers } from "../services/api";

export default function AllPlayersView() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetchPlayers();
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players for public view:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <header className="bg-emerald-900 text-white py-8 px-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black tracking-tight flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Squad Roster</span>
          </h1>
          <p className="text-emerald-200 text-sm mt-1">
            Live player directory synchronized with the admin control center
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            Loading squad roster...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Registered Players
              </h2>
              <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                Total Players: {players.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {players.map((player) => (
                <div
                  key={player._id}
                  className="border border-gray-100 p-4 rounded-xl flex items-center justify-between bg-gray-50/60 shadow-xs hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {player.name}
                      </h3>
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {player.role || "Player"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {players.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">
                  No players added from the admin panel yet.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
