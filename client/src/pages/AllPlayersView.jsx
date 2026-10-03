import React, { useState, useEffect } from "react";
import { Users, Calendar, Shield } from "lucide-react";
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 text-white pb-16">
      <header className="bg-slate-900/80 border-b border-emerald-800/40 py-10 px-6 backdrop-blur-md sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center space-x-3 text-emerald-400">
              <Users className="h-8 w-8 text-emerald-500" />
              <span>Squad Roster</span>
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Live player directory synchronized directly with the admin control
              center.
            </p>
          </div>
          <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-4 py-2 rounded-2xl border border-emerald-700/60 shadow-inner">
            Total Squad: {players.length} Players
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {loading ? (
          <div className="text-center py-24 text-slate-400 font-medium text-lg">
            Loading squad roster...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {players.map((player) => (
              <div
                key={player._id}
                className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition group relative overflow-hidden backdrop-blur-sm"
              >
                {/* Top decorative linear accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-teal-500 opacity-80" />

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={
                        player.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={player.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md group-hover:scale-105 transition"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow">
                      {player.role ? player.role.charAt(0) : "P"}
                    </span>
                  </div>

                  <div className="overflow-hidden">
                    <h3 className="font-bold text-base text-white truncate">
                      {player.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium">
                      {player.role || "Player"}
                    </p>
                    {player.age && (
                      <p className="text-xs text-slate-400 flex items-center mt-0.5">
                        <Calendar className="h-3 w-3 mr-1 text-slate-500" />{" "}
                        {player.age} yrs old
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">
                    SCMG Club Member
                  </span>
                  <Shield className="h-4 w-4 text-emerald-500/70" />
                </div>
              </div>
            ))}

            {players.length === 0 && (
              <div className="col-span-full text-center py-20 bg-slate-800/40 rounded-2xl border border-slate-700/40">
                <Users className="h-12 w-12 mx-auto text-slate-500 mb-3" />
                <p className="text-slate-300 font-medium">
                  No players added from the admin panel yet.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Check back once your admin registers players to the roster!
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
