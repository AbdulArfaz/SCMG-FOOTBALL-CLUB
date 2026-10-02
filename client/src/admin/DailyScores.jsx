import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Save } from "lucide-react";
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
  const [won, setWon] = useState(false);

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
        won: team === "A" ? teamAScore > teamBScore : teamBScore > teamAScore,
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
        participations: participations.map(({ playerName, ...rest }) => rest), // strip temporary playerName UI field
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h2 className="text-lg font-bold text-gray-900">
        Record / Edit Daily Match Scores
      </h2>

      <form onSubmit={handleSaveMatch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Match Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 bg-white outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Team A Score
            </label>
            <input
              type="number"
              value={teamAScore}
              onChange={(e) => setTeamAScore(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 bg-white outline-none"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Team B Score
            </label>
            <input
              type="number"
              value={teamBScore}
              onChange={(e) => setTeamBScore(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 bg-white outline-none"
              min="0"
              required
            />
          </div>
        </div>

        <div className="border rounded-xl p-4 space-y-4 bg-white">
          <h3 className="text-sm font-bold text-gray-800">
            Add Player Performances for this Match
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              >
                {players.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Team
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="A">Team A</option>
                <option value="B">Team B</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Goals
              </label>
              <input
                type="number"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Tackles
              </label>
              <input
                type="number"
                value={tackles}
                onChange={(e) => setTackles(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                min="0"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleAddParticipation}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition flex items-center justify-center space-x-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add Stat</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                  <th className="py-2 px-3">Player</th>
                  <th className="py-2 px-3">Team</th>
                  <th className="py-2 px-3">Goals</th>
                  <th className="py-2 px-3">Tackles</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participations.map((p, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-medium">{p.playerName}</td>
                    <td className="py-2 px-3">Team {p.team}</td>
                    <td className="py-2 px-3">{p.goals}</td>
                    <td className="py-2 px-3">{p.tackles}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeParticipation(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {participations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      No player performances added for this match yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition shadow-sm"
        >
          <Save className="h-5 w-5" />
          <span>Save Daily Match Update</span>
        </button>
      </form>
    </div>
  );
}
