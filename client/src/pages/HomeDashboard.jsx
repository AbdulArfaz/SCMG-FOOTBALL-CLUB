import React, { useState, useEffect } from "react";
import {
  Trophy,
  Shield,
  Award,
  Users,
  Calendar,
  Activity,
  UserCheck,
} from "lucide-react";
import { fetchPlayers, fetchLeaderboard, fetchMatches } from "../services/api";

export default function HomeDashboard() {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const currentDate = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentDate);

  const [leaderboard, setLeaderboard] = useState({
    topScorers: [],
    topDefenders: [],
    mostWins: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLiveBackendData();
  }, [month]);

  const loadLiveBackendData = async () => {
    try {
      setLoading(true);
      const [playersRes, matchesRes, leaderboardRes] = await Promise.all([
        fetchPlayers(),
        fetchMatches(),
        fetchLeaderboard(month),
      ]);

      setPlayers(playersRes.data);
      setMatches(matchesRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (err) {
      console.error("Error syncing with backend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16 selection:bg-emerald-500 selection:text-slate-950">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-800/40 py-8 px-6 shadow-2xl backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center space-x-3 bg-linear-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
              <span>⚽ SCMG Football Club Tracker</span>
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Live sync with admin database: rosters, match logs, and
              leaderboards.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner space-x-1">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "leaderboard"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "roster"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              Player Roster ({players.length})
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "matches"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              Match History
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="text-center py-24 text-slate-400 font-medium animate-pulse text-lg">
            Syncing live data from database...
          </div>
        ) : (
          <>
            {/* LEADERBOARD TAB */}
            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md gap-4">
                  <h2 className="font-extrabold text-lg text-emerald-400 flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Monthly Standings (Live)</span>
                  </h2>
                  <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl shadow-inner">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <input
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="bg-transparent text-sm outline-none font-bold text-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Top Scorers */}
                  <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 to-yellow-500" />
                    <div className="flex items-center space-x-2 text-amber-400 font-extrabold border-b border-slate-800 pb-3">
                      <Trophy className="h-5 w-5" />
                      <span>Top Scorers</span>
                    </div>
                    <div className="space-y-3">
                      {leaderboard.topScorers.map((item, idx) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center text-sm p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-inner"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-black text-xs w-6 h-6 flex items-center justify-center rounded-lg bg-amber-400 text-slate-950">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white">
                              {item.playerDetails?.name || "Unknown"}
                            </span>
                          </div>
                          <span className="font-extrabold text-amber-400 bg-amber-950/50 border border-amber-800/40 px-3 py-1 rounded-lg text-xs">
                            {item.totalGoals} ⚽
                          </span>
                        </div>
                      ))}
                      {leaderboard.topScorers.length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-8 italic">
                          No goals recorded this month.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Top Defenders */}
                  <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-400 to-blue-500" />
                    <div className="flex items-center space-x-2 text-cyan-400 font-extrabold border-b border-slate-800 pb-3">
                      <Shield className="h-5 w-5" />
                      <span>Top Defenders</span>
                    </div>
                    <div className="space-y-3">
                      {leaderboard.topDefenders.map((item, idx) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center text-sm p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-inner"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-black text-xs w-6 h-6 flex items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white">
                              {item.playerDetails?.name || "Unknown"}
                            </span>
                          </div>
                          <span className="font-extrabold text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-3 py-1 rounded-lg text-xs">
                            {item.totalTackles} 🛡️
                          </span>
                        </div>
                      ))}
                      {leaderboard.topDefenders.length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-8 italic">
                          No tackles recorded this month.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Most Wins */}
                  <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-teal-500" />
                    <div className="flex items-center space-x-2 text-emerald-400 font-extrabold border-b border-slate-800 pb-3">
                      <Award className="h-5 w-5" />
                      <span>Most Wins</span>
                    </div>
                    <div className="space-y-3">
                      {leaderboard.mostWins.map((item, idx) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center text-sm p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-inner"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-black text-xs w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white">
                              {item.playerDetails?.name || "Unknown"}
                            </span>
                          </div>
                          <span className="font-extrabold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-3 py-1 rounded-lg text-xs">
                            {item.totalWins} 🏆
                          </span>
                        </div>
                      ))}
                      {leaderboard.mostWins.length === 0 && (
                        <p className="text-center text-xs text-slate-400 py-8 italic">
                          No wins recorded this month.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAYER ROSTER TAB */}
            {activeTab === "roster" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-emerald-400 flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Registered Squad Roster ({players.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {players.map((player) => (
                    <div
                      key={player._id}
                      className="border border-slate-700/70 p-4 rounded-2xl flex items-center space-x-4 bg-slate-800/50 shadow-md hover:border-emerald-500/50 transition group"
                    >
                      {/* Player Avatar */}
                      <img
                        src={
                          player.avatar ||
                          "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=150&q=80"
                        }
                        alt={player.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md group-hover:scale-105 transition"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=150&q=80";
                        }}
                      />

                      {/* Player Info */}
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-white text-base tracking-wide">
                          {player.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-md">
                            {player.role || "Player"}
                          </span>
                        </div>
                        {player.age && (
                          <p className="text-xs text-slate-400 font-medium pt-0.5">
                            📅 {player.age} yrs old
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {players.length === 0 && (
                    <div
                      colSpan="3"
                      className="text-slate-400 text-sm py-12 text-center col-span-full italic"
                    >
                      No players added from the admin panel yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MATCH HISTORY TAB */}
            {activeTab === "matches" && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-black text-emerald-400 flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recorded Match Results</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match._id}
                      className="border border-slate-700/70 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center bg-slate-800/50 gap-4 shadow-inner"
                    >
                      <div className="text-xs font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                        📅 {new Date(match.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="font-black text-cyan-400 tracking-wide">
                          Team A
                        </span>
                        <span className="bg-linear-to-r from-emerald-500 to-teal-600 text-slate-950 px-5 py-2 rounded-xl font-black text-xl shadow-lg">
                          {match.teamAScore} - {match.teamBScore}
                        </span>
                        <span className="font-black text-amber-400 tracking-wide">
                          Team B
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
                        {match.participations?.length || 0} players tracked
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <p className="text-slate-400 text-sm py-12 text-center italic">
                      No matches recorded from the admin panel yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
