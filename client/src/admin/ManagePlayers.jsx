import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Edit2, X, Check } from "lucide-react";
import { fetchPlayers, addPlayer, deletePlayer } from "../services/api";
import axios from "axios"; // We can use axios directly for updates if needed, or add an update endpoint

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Player");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("Player");

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await fetchPlayers();
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addPlayer({ name, role });
      setName("");
      setRole("Player");
      loadPlayers();
    } catch (err) {
      console.error("Error adding player:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    try {
      await deletePlayer(id);
      loadPlayers();
    } catch (err) {
      console.error("Error deleting player:", err);
    }
  };

  const startEditing = (player) => {
    setEditingId(player._id);
    setEditName(player.name);
    setEditRole(player.role || "Player");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditRole("Player");
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/players/${id}`, {
        name: editName,
        role: editRole,
      });
      cancelEditing();
      loadPlayers();
    } catch (err) {
      console.error("Error updating player:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Manage Players</h2>

      <form
        onSubmit={handleAddPlayer}
        className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border"
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Player Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lionel Messi"
            className="w-full border rounded-lg px-4 py-2 bg-white outline-none"
            required
          />
        </div>
        <div className="w-48">
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 bg-white outline-none"
          >
            <option value="Player">Player</option>
            <option value="Striker">Striker</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Defender">Defender</option>
          </select>
        </div>
        <button
          type="submit"
          className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add</span>
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <th className="py-3 px-4">Player Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {players.map((player) => (
              <tr key={player._id} className="hover:bg-gray-50">
                {editingId === player._id ? (
                  <>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="Player">Player</option>
                        <option value="Striker">Striker</option>
                        <option value="Midfielder">Midfielder</option>
                        <option value="Defender">Defender</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleUpdate(player._id)}
                        className="text-emerald-600 hover:text-emerald-800 p-1"
                        title="Save"
                      >
                        <Check className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Cancel"
                      >
                        <X className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {player.name}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{player.role}</td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button
                        onClick={() => startEditing(player)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(player._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {players.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-400">
                  No players found. Add your first player above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
