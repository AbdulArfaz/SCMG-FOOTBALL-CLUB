import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Edit2,
  X,
  Check,
  User,
  Calendar,
} from "lucide-react";
import { fetchPlayers, deletePlayer } from "../services/api";
import axios from "axios";

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Player");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("Player");
  const [editAge, setEditAge] = useState("");

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
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      await axios.post(`${baseURL}/players`, {
        name,
        role,
        age: age ? Number(age) : undefined,
      });

      setName("");
      setRole("Player");
      setAge("");
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
    setEditAge(player.age || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditRole("Player");
    setEditAge("");
  };

  const handleUpdate = async (id) => {
    try {
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      await axios.put(`${baseURL}/players/${id}`, {
        name: editName,
        role: editRole,
        age: editAge ? Number(editAge) : undefined,
      });

      cancelEditing();
      loadPlayers();
    } catch (err) {
      console.error("Error updating player:", err);
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl shadow-xl border border-emerald-800/50 p-6 sm:p-8 space-y-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-emerald-800/40 pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-wide text-emerald-400">
            Manage Squad Roster
          </h2>
          <p className="text-sm text-slate-300">
            Add, edit, and organize club player profiles effortlessly.
          </p>
        </div>
        <span className="bg-emerald-900/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700">
          Total Players: {players.length}
        </span>
      </div>

      {/* Add Player Form */}
      <form
        onSubmit={handleAddPlayer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 shadow-inner backdrop-blur-md"
      >
        <div className="lg:col-span-1">
          <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
            Player Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lionel Messi"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="Player">Player</option>
            <option value="Striker">Striker</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Defender">Defender</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 24"
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center space-x-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition transform active:scale-95"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Player</span>
        </button>
      </form>

      {/* Players Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player) => (
          <div
            key={player._id}
            className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-emerald-500/50 transition group relative overflow-hidden"
          >
            {/* Top decorative linear bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-teal-500 opacity-80" />

            {editingId === player._id ? (
              // Editing Form inside Card
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      Role
                    </label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white"
                    >
                      <option value="Player">Player</option>
                      <option value="Striker">Striker</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Defender">Defender</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">
                      Age
                    </label>
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => handleUpdate(player._id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition"
                    title="Save"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-lg transition"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Normal Card View
              <>
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

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700/50">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-700/50">
                    Active Roster
                  </span>
                  <div className="space-x-1">
                    <button
                      onClick={() => startEditing(player)}
                      className="text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 p-2 rounded-xl transition border border-cyan-800/40"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(player._id)}
                      className="text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 p-2 rounded-xl transition border border-red-800/40"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {players.length === 0 && (
          <div className="col-span-full text-center py-12 bg-slate-800/40 rounded-2xl border border-slate-700/40">
            <User className="mx-auto h-12 w-12 text-slate-500 mb-3" />
            <p className="text-slate-400 font-medium">
              No players found in the squad.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Add your first player using the form above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
