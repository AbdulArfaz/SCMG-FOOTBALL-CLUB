import React, { useState, useEffect } from "react";
import { Trophy, Shield, Award, Calendar, BarChart3 } from "lucide-react";
import { fetchLeaderboard } from "../services/api";

export default function StatsSummaries() {
  const currentDate = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentDate);
  const [leaderboard, setLeaderboard] = useState({
    topScorers: [],
    topDefenders: [],
    mostWins: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaderboardData();
  }, [month]);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      const res = await fetchLeaderboard(month);
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl shadow-xl border border-emerald-800/50 p-6 sm:p-8 space-y-8 text-white">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/40 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-wide text-emerald-400">
            Monthly Performance Leaderboard
          </h2>
          <p className="text-sm text-slate-300">
            Aggregated match statistics and rankings for the squad.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-inner">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent text-sm outline-none font-bold text-white cursor-pointer"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 animate-pulse font-medium">
          Loading leaderboards...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Scorers Card */}
          <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-800/50 backdrop-blur-md space-y-4 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 to-yellow-500" />

            <div className="flex items-center space-x-2 text-amber-400 font-extrabold border-b border-slate-700/60 pb-3">
              <Trophy className="h-5 w-5" />
              <span>Top Scorers (Goals)</span>
            </div>

            <div className="space-y-3">
              {leaderboard.topScorers.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-sm bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shadow-inner hover:border-amber-500/40 transition"
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
                    <span className="font-bold text-white truncate max-w-30">
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
                  No data recorded for this month.
                </p>
              )}
            </div>
          </div>

          {/* Top Defenders / Tackles Card */}
          <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-800/50 backdrop-blur-md space-y-4 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-400 to-blue-500" />

            <div className="flex items-center space-x-2 text-cyan-400 font-extrabold border-b border-slate-700/60 pb-3">
              <Shield className="h-5 w-5" />
              <span>Top Defenders (Tackles)</span>
            </div>

            <div className="space-y-3">
              {leaderboard.topDefenders.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-sm bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shadow-inner hover:border-cyan-500/40 transition"
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
                    <span className="font-bold text-white truncate max-w-[120px]">
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
                  No data recorded for this month.
                </p>
              )}
            </div>
          </div>

          {/* Most Wins Card */}
          <div className="border border-slate-700/70 rounded-2xl p-5 bg-slate-800/50 backdrop-blur-md space-y-4 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-teal-500" />

            <div className="flex items-center space-x-2 text-emerald-400 font-extrabold border-b border-slate-700/60 pb-3">
              <Award className="h-5 w-5" />
              <span>Most Wins</span>
            </div>

            <div className="space-y-3">
              {leaderboard.mostWins.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-sm bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shadow-inner hover:border-emerald-500/40 transition"
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
                    <span className="font-bold text-white truncate max-w-[120px]">
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
                  No data recorded for this month.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
