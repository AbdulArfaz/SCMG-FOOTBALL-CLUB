import React, { useState, useEffect } from "react";
import { Trophy, Shield, Award, Calendar, BarChart2 } from "lucide-react";
import { fetchLeaderboard } from "../services/api";

export default function StatsView() {
  const currentDate = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentDate);
  const [leaderboard, setLeaderboard] = useState({
    topScorers: [],
    topDefenders: [],
    mostWins: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [month]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetchLeaderboard(month);
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching public stats leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16 selection:bg-emerald-500 selection:text-slate-950">
      {/* Header Banner */}
      <header className="bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-800/40 py-8 px-6 shadow-2xl backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center space-x-3 bg-linear-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
              <BarChart2 className="h-7 w-7 text-emerald-400" />
              <span>Performance Leaderboard</span>
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Live match statistics aggregated directly from admin records.
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-inner">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-transparent text-sm outline-none font-bold text-white cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {loading ? (
          <div className="text-center py-24 text-slate-400 font-medium animate-pulse text-lg">
            Calculating live stats...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Scorers Card */}
            <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 to-yellow-500" />

              <div className="flex items-center space-x-2 text-amber-400 font-extrabold border-b border-slate-800 pb-3">
                <Trophy className="h-5 w-5" />
                <span>Top Scorers (Goals)</span>
              </div>

              <div className="space-y-3">
                {leaderboard.topScorers.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between text-sm bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 shadow-inner hover:border-amber-500/40 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-black text-xs w-6 h-6 flex items-center justify-center rounded-lg shadow ${
                          index === 0
                            ? "bg-linear-to-r from-amber-400 to-yellow-500 text-slate-950"
                            : index === 1
                              ? "bg-slate-300 text-slate-950"
                              : index === 2
                                ? "bg-amber-700 text-white"
                                : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-bold text-white truncate max-w-[130px]">
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
                    No goals recorded for this month.
                  </p>
                )}
              </div>
            </div>

            {/* Top Defenders Card */}
            <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-400 to-blue-500" />

              <div className="flex items-center space-x-2 text-cyan-400 font-extrabold border-b border-slate-800 pb-3">
                <Shield className="h-5 w-5" />
                <span>Top Defenders (Tackles)</span>
              </div>

              <div className="space-y-3">
                {leaderboard.topDefenders.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between text-sm bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 shadow-inner hover:border-cyan-500/40 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-black text-xs w-6 h-6 flex items-center justify-center rounded-lg shadow ${
                          index === 0
                            ? "bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-bold text-white truncate max-w-[130px]">
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
                    No tackles recorded for this month.
                  </p>
                )}
              </div>
            </div>

            {/* Most Wins Card */}
            <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-900/60 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-teal-500" />

              <div className="flex items-center space-x-2 text-emerald-400 font-extrabold border-b border-slate-800 pb-3">
                <Award className="h-5 w-5" />
                <span>Most Wins</span>
              </div>

              <div className="space-y-3">
                {leaderboard.mostWins.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between text-sm bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 shadow-inner hover:border-emerald-500/40 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-black text-xs w-6 h-6 flex items-center justify-center rounded-lg shadow ${
                          index === 0
                            ? "bg-linear-to-r from-emerald-400 to-teal-500 text-slate-950"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-bold text-white truncate max-w-[130px]">
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
                    No wins recorded for this month.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
