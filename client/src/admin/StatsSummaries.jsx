import React, { useState, useEffect } from "react";
import { Trophy, Shield, Award, Calendar } from "lucide-react";
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Monthly Performance Leaderboard
          </h2>
          <p className="text-xs text-gray-500">
            Aggregated match statistics and rankings
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 border px-3 py-2 rounded-xl">
          <Calendar className="h-4 w-4 text-gray-500" />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent text-sm outline-none font-medium text-gray-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading leaderboards...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-5 bg-linear-to-b from-amber-50/50 to-white space-y-4">
            <div className="flex items-center space-x-2 text-amber-600 font-bold border-b pb-3">
              <Trophy className="h-5 w-5" />
              <span>Top Scorers (Goals)</span>
            </div>
            <div className="space-y-3">
              {leaderboard.topScorers.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full ${index === 0 ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.playerDetails?.name || "Unknown"}
                    </span>
                  </div>
                  <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    {item.totalGoals} ⚽
                  </span>
                </div>
              ))}
              {leaderboard.topScorers.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-6">
                  No data recorded for this month.
                </p>
              )}
            </div>
          </div>

          {/* Top Defenders / Tackles Card */}
          <div className="border rounded-2xl p-5 bg-linear-to-b from-blue-50/50 to-white space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 font-bold border-b pb-3">
              <Shield className="h-5 w-5" />
              <span>Top Defenders (Tackles)</span>
            </div>
            <div className="space-y-3">
              {leaderboard.topDefenders.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full ${index === 0 ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.playerDetails?.name || "Unknown"}
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {item.totalTackles} 🛡️
                  </span>
                </div>
              ))}
              {leaderboard.topDefenders.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-6">
                  No data recorded for this month.
                </p>
              )}
            </div>
          </div>

          {/* Most Wins Card */}
          <div className="border rounded-2xl p-5 bg-linear-to-b from-emerald-50/50 to-white space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold border-b pb-3">
              <Award className="h-5 w-5" />
              <span>Most Wins</span>
            </div>
            <div className="space-y-3">
              {leaderboard.mostWins.map((item, index) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-sm bg-white p-3 rounded-xl border shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full ${index === 0 ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.playerDetails?.name || "Unknown"}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {item.totalWins} 🏆
                  </span>
                </div>
              ))}
              {leaderboard.mostWins.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-6">
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
