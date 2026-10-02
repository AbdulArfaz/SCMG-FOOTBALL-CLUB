import React, { useState, useEffect } from "react";
import { Trophy, Shield, Award, Users, Calendar, Activity } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <header className="bg-emerald-900 text-white py-8 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center space-x-2">
              <span>⚽ Ground Football Tracker</span>
            </h1>
            <p className="text-emerald-200 text-sm mt-1">
              Live sync with admin database: rosters, match logs, and
              leaderboards
            </p>
          </div>

          <div className="flex bg-emerald-800/80 p-1.5 rounded-xl border border-emerald-700 space-x-1">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "leaderboard" ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-100 hover:bg-emerald-700"}`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "roster" ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-100 hover:bg-emerald-700"}`}
            >
              Player Roster ({players.length})
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "matches" ? "bg-white text-emerald-900 shadow-sm" : "text-emerald-100 hover:bg-emerald-700"}`}
            >
              Match History
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium">
            Syncing live data from database...
          </div>
        ) : (
          <>
            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-xs">
                  <h2 className="font-bold text-gray-800">
                    Monthly Standings (Live)
                  </h2>
                  <div className="flex items-center space-x-2 bg-gray-50 border px-3 py-1.5 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <input
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="bg-transparent text-sm outline-none font-medium text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Top Scorers */}
                  <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 text-amber-600 font-bold border-b pb-3">
                      <Trophy className="h-5 w-5" />
                      <span>Top Scorers</span>
                    </div>
                    <div className="space-y-3">
                      {leaderboard.topScorers.map((item, idx) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="font-semibold">
                            {item.playerDetails?.name || "Unknown"}
                          </span>
                          <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                            {item.totalGoals} ⚽
                          </span>
                        </div>
                      ))}
                      {leaderboard.topScorers.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-6">
                          No goals recorded this month.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 text-blue-600 font-bold border-b pb-3">
                      <Shield className="h-5 w-5" />
                      <span>Top Defenders</span>
                    </div>
                    <div className="space-y-3">
                      {leaderboard.topDefenders.map((item, idx) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="font-semibold">
                            {item.playerDetails?.name || "Unknown"}
                          </span>
                          <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                            {item.totalTackles} 🛡️
                          </span>
                        </div>
                      ))}
                      {leaderboard.topDefenders.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-6">
                          No tackles recorded this month.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 text-emerald-600 font-bold border-b pb-3">
                      <Award className="h-5 w-5" />
                      <span>Most Wins</span>
                    </div>
                    <div className="space-y-3">
                      {leaderboard.mostWins.map((item, idx) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="font-semibold">
                            {item.playerDetails?.name || "Unknown"}
                          </span>
                          <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            {item.totalWins} 🏆
                          </span>
                        </div>
                      ))}
                      {leaderboard.mostWins.length === 0 && (
                        <p className="text-center text-xs text-gray-400 py-6">
                          No wins recorded this month.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "roster" && (
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-emerald-700" />
                  <span>Registered Squad Roster ({players.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {players.map((player) => (
                    <div
                      key={player._id}
                      className="border p-4 rounded-xl flex items-center justify-between bg-gray-50/50"
                    >
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {player.name}
                        </h3>
                        <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          {player.role}
                        </span>
                      </div>
                    </div>
                  ))}
                  {players.length === 0 && (
                    <p className="text-gray-400 text-sm py-4">
                      No players added from the admin panel yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "matches" && (
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-emerald-700" />
                  <span>Recorded Match Results</span>
                </h2>
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match._id}
                      className="border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 gap-4"
                    >
                      <div className="text-xs font-semibold text-gray-500">
                        📅 {new Date(match.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="font-bold text-gray-800">Team A</span>
                        <span className="bg-emerald-900 text-white px-4 py-1.5 rounded-xl font-black text-lg">
                          {match.teamAScore} - {match.teamBScore}
                        </span>
                        <span className="font-bold text-gray-800">Team B</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {match.participations?.length || 0} players tracked
                      </div>
                    </div>
                  ))}
                  {matches.length === 0 && (
                    <p className="text-gray-400 text-sm py-4 text-center">
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
