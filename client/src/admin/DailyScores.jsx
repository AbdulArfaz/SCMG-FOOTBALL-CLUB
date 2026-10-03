import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Save,
  Calendar,
  Award,
  Shield,
  Target,
  Activity,
} from "lucide-react";
import { fetchPlayers, recordMatch } from "../services/api";

export default function DailyScoreUpdates() {
  const [players, setPlayers] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

  const [participations, setParticipations] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [team, setTeam] = useState("A");
  const [goals, setGoals] = useState(0);
  const [tackles, setTackles] = useState(0);
  const [assists, setAssists] = useState(0);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await fetchPlayers();
      setPlayers(res.data);
      if (res.data.length > 0) setSelectedPlayer(res.data[0]._id);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  const handleAddParticipation = (e) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    const playerObj = players.find((p) => p._id === selectedPlayer);

    if (participations.some((p) => p.player === selectedPlayer)) {
      alert("This player's stats are already added for this match.");
      return;
    }

    setParticipations([
      ...participations,
      {
        player: selectedPlayer,
        playerName: playerObj ? playerObj.name : "Unknown",
        team,
        goals: Number(goals),
        tackles: Number(tackles),
        assists: Number(assists),
        won:
          team === "A"
            ? Number(teamAScore) > Number(teamBScore)
            : Number(teamBScore) > Number(teamAScore),
      },
    ]);

    setGoals(0);
    setTackles(0);
    setAssists(0);
  };

  const removeParticipation = (index) => {
    setParticipations(participations.filter((_, i) => i !== index));
  };

  const handleSaveMatch = async (e) => {
    e.preventDefault();
    if (participations.length === 0) {
      alert(
        "Please add at least one player's performance stats before saving the match.",
      );
      return;
    }

    try {
      const matchData = {
        date,
        teamAScore: Number(teamAScore),
        teamBScore: Number(teamBScore),
        participations: participations.map(({ playerName, ...rest }) => rest),
      };

      await recordMatch(matchData);
      alert("Match and player stats saved successfully!");

      setParticipations([]);
      setTeamAScore(0);
      setTeamBScore(0);
    } catch (err) {
      console.error("Error saving match:", err);
      alert("Failed to save match. Check console for details.");
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl shadow-xl border border-emerald-800/50 p-6 sm:p-8 space-y-8 text-white">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-emerald-800/40 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-wide text-emerald-400">
            Record Match Scores
          </h2>
          <p className="text-sm text-slate-300">
            Input daily match results and track player individual performances.
          </p>
        </div>
        <span className="bg-emerald-900/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700 flex items-center space-x-1">
          <Activity className="h-3.5 w-3.5 mr-1" />
          <span>Live Session Stats</span>
        </span>
      </div>

      <form onSubmit={handleSaveMatch} className="space-y-6">
        {/* Match Overview Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 shadow-inner backdrop-blur-md">
          <div>
            <label className="flex text-xs font-bold text-emerald-400 uppercase mb-1 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" /> Match Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>
          <div>
            <label className="flex text-xs font-bold text-emerald-400 uppercase mb-1 flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1 text-cyan-400" /> Team A Score
            </label>
            <input
              type="number"
              value={teamAScore}
              onChange={(e) => setTeamAScore(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-400 uppercase mb-1 flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1 text-amber-400" /> Team B
              Score
            </label>
            <input
              type="number"
              value={teamBScore}
              onChange={(e) => setTeamBScore(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
              min="0"
              required
            />
          </div>
        </div>

        {/* Player Performances Container */}
        <div className="border border-slate-700/70 rounded-2xl p-5 space-y-4 bg-slate-800/40 backdrop-blur-md">
          <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wide">
            Add Player Performances for this Match
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {players.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Team
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="A">Team A</option>
                <option value="B">Team B</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 flex items-center">
                <Target className="h-3 w-3 mr-1 text-emerald-400" /> Goals
              </label>
              <input
                type="number"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                Tackles
              </label>
              <input
                type="number"
                value={tackles}
                onChange={(e) => setTackles(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                min="0"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={handleAddParticipation}
                className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-1 shadow-md active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Stat</span>
              </button>
            </div>
          </div>

          {/* Table List of Added Stats */}
          <div className="overflow-x-auto mt-4 rounded-xl border border-slate-700/50 bg-slate-900/50">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-900 text-[10px] uppercase text-emerald-400 font-extrabold tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Goals</th>
                  <th className="py-3 px-4">Tackles</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {participations.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white">
                      {p.playerName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-bold ${p.team === "A" ? "bg-cyan-950 text-cyan-300 border border-cyan-800/50" : "bg-amber-950 text-amber-300 border border-amber-800/50"}`}
                      >
                        Team {p.team}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      {p.goals}
                    </td>
                    <td className="py-3 px-4">{p.tackles}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeParticipation(idx)}
                        className="text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 p-2 rounded-lg transition border border-rose-800/40"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {participations.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-slate-500 italic"
                    >
                      No player performances added for this match yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Match Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg transform active:scale-95"
        >
          <Save className="h-5 w-5" />
          <span>Save Daily Match Update</span>
        </button>
      </form>
    </div>
  );
}
