import React, { useEffect, useState } from "react";
import api from "../services/api";

const emptyScorer = () => ({
  player: "",
  team: "",
  goals: 1,
});

const ManageTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);

  const [tournamentName, setTournamentName] = useState("");
  const [tournamentDescription, setTournamentDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [venue, setVenue] = useState("");

  const [teamName, setTeamName] = useState("");
  const [teamLogo, setTeamLogo] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const [stage, setStage] = useState("group");
  const [matchNumber, setMatchNumber] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [matchDate, setMatchDate] = useState("");

  // Match score, goal scorer and defender drafts
  const [scoreDrafts, setScoreDrafts] = useState({});

  // Tournament awards
  const [awardDraft, setAwardDraft] = useState({
    winner: "",
    bestScorer: "",
    bestDefender: "",
    bestPlayer: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const getErrorMessage = (err, fallback) =>
    err.response?.data?.error ||
    err.response?.data?.message ||
    fallback;

  const idOf = (value) =>
    value && typeof value === "object" ? String(value._id) : String(value || "");

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournaments");
      setTournaments(
        Array.isArray(res.data) ? res.data : res.data.tournaments || []
      );
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch tournaments."));
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await api.get("/players");
      setPlayers(
        Array.isArray(res.data) ? res.data : res.data.players || []
      );
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch players."));
    }
  };

  const fetchTournamentDetails = async (tournamentId) => {
    try {
      const res = await api.get(`/tournaments/${tournamentId}`);
      const tournament = res.data.tournament;
      const fetchedTeams = res.data.teams || [];
      const fetchedMatches = res.data.matches || [];

      setSelectedTournament(tournament);
      setTeams(fetchedTeams);
      setMatches(fetchedMatches);

      setAwardDraft({
        winner: idOf(tournament.winner),
        bestScorer: idOf(tournament.bestScorer),
        bestDefender: idOf(tournament.bestDefender),
        bestPlayer: idOf(tournament.bestPlayer),
      });

      const drafts = {};

      fetchedMatches.forEach((match) => {
        drafts[match._id] = {
          teamAScore: match.teamAScore ?? 0,
          teamBScore: match.teamBScore ?? 0,
          goalScorers: (match.goalScorers || []).map((scorer) => ({
            player: idOf(scorer.player),
            team: idOf(scorer.team),
            goals: scorer.goals ?? 1,
          })),
          bestDefender: idOf(match.bestDefender),
          summary: match.summary || "",
        };
      });

      setScoreDrafts(drafts);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch tournament details."));
    }
  };

  useEffect(() => {
    fetchTournaments();
    fetchPlayers();
  }, []);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!tournamentName.trim() || !startDate) {
      setError("Tournament name and start date are required.");
      return;
    }

    if (endDate && endDate < startDate) {
      setError("End date cannot be before the start date.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/tournaments", {
        name: tournamentName.trim(),
        description: tournamentDescription.trim(),
        startDate,
        ...(endDate && { endDate }),
        ...(venue.trim() && { venue: venue.trim() }),
      });

      setSuccess("Tournament created successfully!");
      setTournamentName("");
      setTournamentDescription("");
      setStartDate("");
      setEndDate("");
      setVenue("");
      await fetchTournaments();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create tournament."));
    } finally {
      setLoading(false);
    }
  };

  const resetTeamForm = () => {
    setTeamName("");
    setTeamLogo("");
    setSelectedPlayers([]);
    setEditingTeamId(null);
  };

  const resetMatchForm = () => {
    setStage("group");
    setMatchNumber("");
    setTeamA("");
    setTeamB("");
    setMatchDate("");
  };

  const handleSelectTournament = async (tournament) => {
    clearMessages();
    resetTeamForm();
    resetMatchForm();
    await fetchTournamentDetails(tournament._id);
  };

  const assignedPlayerIds = new Set(
    teams.flatMap((team) =>
      (team.players || []).map((player) => idOf(player))
    )
  );

  const handlePlayerToggle = (playerId) => {
    setSelectedPlayers((previous) =>
      previous.includes(playerId)
        ? previous.filter((id) => id !== playerId)
        : [...previous, playerId]
    );
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!selectedTournament) {
      setError("Please select a tournament first.");
      return;
    }

    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    if (selectedPlayers.length === 0) {
      setError("Please select at least one player.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: teamName.trim(),
        logo: teamLogo.trim(),
        players: selectedPlayers,
      };

      if (editingTeamId) {
        await api.put(
          `/tournaments/${selectedTournament._id}/teams/${editingTeamId}`,
          payload
        );
        setSuccess("Team updated successfully!");
      } else {
        await api.post(
          `/tournaments/${selectedTournament._id}/teams`,
          payload
        );
        setSuccess("Team created successfully!");
      }

      resetTeamForm();
      await fetchTournamentDetails(selectedTournament._id);
      await fetchTournaments();
    } catch (err) {
      const data = err.response?.data;

      setError(
        data?.players?.length
          ? `These players are already assigned to another team: ${data.players.join(", ")}`
          : getErrorMessage(err, "Failed to save team.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeam = (team) => {
    clearMessages();
    setEditingTeamId(team._id);
    setTeamName(team.name || "");
    setTeamLogo(team.logo || "");
    setSelectedPlayers((team.players || []).map((player) => idOf(player)));
  };

  const handleDeleteTeam = async (teamId) => {
    if (!selectedTournament) return;
    if (!window.confirm("Are you sure you want to delete this team?")) return;

    clearMessages();

    try {
      setLoading(true);
      await api.delete(
        `/tournaments/${selectedTournament._id}/teams/${teamId}`
      );

      setSuccess("Team deleted successfully!");
      if (editingTeamId === teamId) resetTeamForm();

      await fetchTournamentDetails(selectedTournament._id);
      await fetchTournaments();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete team."));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    if (
      !window.confirm(
        "Delete this tournament and all its teams and matches?"
      )
    ) {
      return;
    }

    clearMessages();

    try {
      setLoading(true);
      await api.delete(`/tournaments/${tournamentId}`);

      if (selectedTournament?._id === tournamentId) {
        setSelectedTournament(null);
        setTeams([]);
        setMatches([]);
        setScoreDrafts({});
        resetTeamForm();
        resetMatchForm();
      }

      setSuccess("Tournament deleted successfully!");
      await fetchTournaments();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete tournament."));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!selectedTournament) {
      setError("Please select a tournament first.");
      return;
    }

    if (!matchNumber || !Number.isInteger(Number(matchNumber)) || Number(matchNumber) < 1) {
      setError("Enter a valid match number.");
      return;
    }

    if (!teamA || !teamB) {
      setError("Please select both teams.");
      return;
    }

    if (teamA === teamB) {
      setError("Both teams cannot be the same.");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/tournaments/${selectedTournament._id}/matches`, {
        stage,
        matchNumber: Number(matchNumber),
        teamA,
        teamB,
        ...(matchDate && { date: new Date(matchDate).toISOString() }),
      });

      setSuccess("Match created successfully!");
      resetMatchForm();
      await fetchTournamentDetails(selectedTournament._id);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create match."));
    } finally {
      setLoading(false);
    }
  };

  const updateMatchDraft = (matchId, updates) => {
    setScoreDrafts((previous) => ({
      ...previous,
      [matchId]: {
        ...previous[matchId],
        ...updates,
      },
    }));
  };

  const updateScorer = (matchId, index, field, value) => {
    const current = scoreDrafts[matchId] || {};
    const scorers = [...(current.goalScorers || [])];

    scorers[index] = {
      ...emptyScorer(),
      ...scorers[index],
      [field]: value,
    };

    // Reset player selection when changing the scorer's team.
    if (field === "team") scorers[index].player = "";

    updateMatchDraft(matchId, { goalScorers: scorers });
  };

  const addScorer = (matchId) => {
    const current = scoreDrafts[matchId] || {};
    updateMatchDraft(matchId, {
      goalScorers: [...(current.goalScorers || []), emptyScorer()],
    });
  };

  const removeScorer = (matchId, index) => {
    const current = scoreDrafts[matchId] || {};
    updateMatchDraft(matchId, {
      goalScorers: (current.goalScorers || []).filter(
        (_, scorerIndex) => scorerIndex !== index
      ),
    });
  };

  const handleSaveScore = async (match, newStatus) => {
    clearMessages();

    const draft = scoreDrafts[match._id] || {};
    const scoreA = Number(draft.teamAScore);
    const scoreB = Number(draft.teamBScore);

    if (
      !Number.isInteger(scoreA) ||
      !Number.isInteger(scoreB) ||
      scoreA < 0 ||
      scoreB < 0
    ) {
      setError("Scores must be non-negative whole numbers.");
      return;
    }

    if (newStatus === "completed" && scoreA === scoreB) {
      setError(
        "This match is tied. The current backend does not support a separate tie-break winner."
      );
      return;
    }

    const scorers = draft.goalScorers || [];

    for (const scorer of scorers) {
      if (!scorer.player || !scorer.team) {
        setError("Complete the team and player fields for every goal scorer, or remove the empty row.");
        return;
      }

      if (!Number.isInteger(Number(scorer.goals)) || Number(scorer.goals) < 1) {
        setError("Each scorer must have at least one goal.");
        return;
      }
    }

    try {
      setLoading(true);

      await api.put(
        `/tournaments/${selectedTournament._id}/matches/${match._id}`,
        {
          teamAScore: scoreA,
          teamBScore: scoreB,
          goalScorers: scorers.map((scorer) => ({
            player: scorer.player,
            team: scorer.team,
            goals: Number(scorer.goals),
          })),
          bestDefender: draft.bestDefender || null,
          summary: draft.summary || "",
          status: newStatus || match.status,
        }
      );

      setSuccess(
        newStatus === "completed"
          ? "Match result, scorers and defender saved!"
          : "Match details saved successfully!"
      );

      await fetchTournamentDetails(selectedTournament._id);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update match."));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (
      !window.confirm("Are you sure you want to delete this tournament match?")
    ) {
      return;
    }

    clearMessages();

    try {
      setLoading(true);
      await api.delete(
        `/tournaments/${selectedTournament._id}/matches/${matchId}`
      );

      setSuccess("Match deleted successfully!");
      await fetchTournamentDetails(selectedTournament._id);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete match."));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAwards = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!selectedTournament) return;

    try {
      setLoading(true);

      await api.put(`/tournaments/${selectedTournament._id}`, {
        winner: awardDraft.winner || null,
        bestScorer: awardDraft.bestScorer || null,
        bestDefender: awardDraft.bestDefender || null,
        bestPlayer: awardDraft.bestPlayer || null,
      });

      setSuccess("Tournament awards saved successfully!");
      await fetchTournamentDetails(selectedTournament._id);
      await fetchTournaments();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save tournament awards."));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "Not set";

  const formatMatchDate = (date) =>
    date ? new Date(date).toLocaleString() : "Date not set";

  const getTeamName = (team) =>
    team && typeof team === "object" ? team.name : "Unknown team";

  // Get players belonging to a particular tournament team.
  const getTeamPlayers = (teamId) => {
    const team = teams.find((item) => String(item._id) === String(teamId));
    return (team?.players || []).filter(
      (player) => player && typeof player === "object" && player._id
    );
  };

  const getPlayerName = (playerId) => {
    const player = players.find((item) => String(item._id) === String(playerId));
    return player?.name || "Select player";
  };

  const renderPlayerOptions = (teamId) => {
    const teamPlayers = getTeamPlayers(teamId);

    if (teamPlayers.length === 0) {
      return <option value="">No players assigned to this team</option>;
    }

    return (
      <>
        <option value="">Select player</option>
        {teamPlayers.map((player) => (
          <option key={player._id} value={player._id}>
            {player.name}
          </option>
        ))}
      </>
    );
  };

 return (
  <div className="min-h-screen bg-[#0b0b0d] px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-375 space-y-8">

      {/* HEADER */}
      <header className="flex flex-col justify-between gap-5 border-b border-white/8 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-2xl">
            ⚽
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-violet-300">
                SCMG Workspace
              </span>
              <span className="rounded-full border border-white/10 bg-white/4 px-2 py-0.5 text-[10px] text-zinc-400">
                ADMIN
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Tournaments
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage competitions, teams, fixtures and awards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-2.5">
            <p className="text-xs text-zinc-500">Total tournaments</p>
            <p className="mt-0.5 text-xl font-semibold">{tournaments.length}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-2.5">
            <p className="text-xs text-zinc-500">Scheduled matches</p>
            <p className="mt-0.5 text-xl font-semibold">{matches.length}</p>
          </div>
        </div>
      </header>

      {/* NOTIFICATIONS */}
      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-4 text-sm text-red-300"
        >
          <div className="flex gap-3">
            <span>⚠</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-300/70 hover:text-white"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] p-4 text-sm text-emerald-300"
        >
          <div className="flex gap-3">
            <span>✓</span>
            <span>{success}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-emerald-300/70 hover:text-white"
            aria-label="Dismiss success message"
          >
            ✕
          </button>
        </div>
      )}

      {/* CREATE TOURNAMENT */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111114]">
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-lg text-violet-300">
            +
          </div>
          <div>
            <h2 className="font-semibold">Create tournament</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Set up your next competition.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateTournament} className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Tournament name <span className="text-violet-300">*</span>
              </label>
              <input
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                placeholder="e.g. SCMG Champions Cup"
                required
                className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Venue
              </label>
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="SCMG Football Ground"
                className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Description
            </label>
            <textarea
              value={tournamentDescription}
              onChange={(e) => setTournamentDescription(e.target.value)}
              rows={3}
              placeholder="What is this tournament about?"
              className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Start date <span className="text-violet-300">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-400/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                End date
              </label>
              <input
                type="date"
                min={startDate || undefined}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm text-zinc-300 outline-none focus:border-violet-400/60"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
            <p className="text-xs text-zinc-500">
              Fields marked * are required.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "+ Create tournament"}
            </button>
          </div>
        </form>
      </section>

      {/* TOURNAMENT LIST */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
              Your workspace
            </p>
            <h2 className="text-xl font-semibold tracking-tight">
              All tournaments
              <span className="ml-2 text-sm font-normal text-zinc-500">
                {tournaments.length}
              </span>
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            Select a tournament to manage it
          </span>
        </div>

        {tournaments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-14 text-center">
            <div className="mb-3 text-3xl">🏆</div>
            <h3 className="font-medium text-zinc-200">No tournaments yet</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Create your first tournament using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tournaments.map((tournament) => {
              const isActive =
                selectedTournament?._id === tournament._id;

              return (
                <article
                  key={tournament._id}
                  className={`group rounded-2xl border p-5 transition duration-200 ${
                    isActive
                      ? "border-violet-400/40 bg-violet-500/[0.07] ring-1 ring-violet-400/10"
                      : "border-white/[0.08] bg-[#111114] hover:border-white/20 hover:bg-[#151519]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
                      ⚽
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                        isActive
                          ? "border-violet-400/20 bg-violet-500/10 text-violet-300"
                          : "border-white/10 bg-white/[0.03] text-zinc-400"
                      }`}
                    >
                      {isActive ? "Currently managing" : "Tournament"}
                    </span>
                  </div>

                  <h3 className="mt-5 truncate text-lg font-semibold tracking-tight text-white">
                    {tournament.name}
                  </h3>
                  <p className="mt-2 min-h-10 text-sm leading-6 text-zinc-500">
                    {tournament.description || "No description provided."}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Start date</span>
                      <span className="text-right text-zinc-300">
                        {formatDate(tournament.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-500">End date</span>
                      <span className="text-right text-zinc-300">
                        {formatDate(tournament.endDate)}
                      </span>
                    </div>
                    {tournament.venue && (
                      <div className="flex items-start justify-between gap-3">
                        <span className="shrink-0 text-zinc-500">Venue</span>
                        <span className="text-right text-zinc-300">
                          {tournament.venue}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectTournament(tournament)}
                      className="flex-1 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
                    >
                      Manage tournament →
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTournament(tournament._id)}
                      disabled={loading}
                      aria-label={`Delete ${tournament.name}`}
                      className="rounded-xl border border-red-500/20 px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* SELECTED TOURNAMENT WORKSPACE */}
      {selectedTournament && (
        <section className="space-y-8 border-t border-white/[0.08] pt-8">
          {/* WORKSPACE HEADER */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span>Workspace</span>
                <span>/</span>
                <span className="text-violet-300">Tournament management</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {selectedTournament.name}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Configure teams, fixtures, results and tournament awards.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedTournament(null);
                setTeams([]);
                setMatches([]);
                setScoreDrafts({});
                resetTeamForm();
                resetMatchForm();
                clearMessages();
              }}
              className="self-start rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] sm:self-auto"
            >
              Close workspace ✕
            </button>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "Teams", value: teams.length, icon: "🛡️" },
              { label: "Matches", value: matches.length, icon: "⚽" },
              {
                label: "Completed",
                value: matches.filter((match) => match.status === "completed").length,
                icon: "✓",
              },
              {
                label: "Players assigned",
                value: teams.reduce(
                  (total, team) => total + (team.players || []).length,
                  0
                ),
                icon: "👥",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.08] bg-[#111114] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* TEAMS */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111114]">
            <div className="border-b border-white/[0.07] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-lg">
                  🛡️
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Teams & players</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Build your squads and assign players.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[0.85fr_1.15fr]">
              {/* TEAM FORM */}
              <form
                onSubmit={handleSaveTeam}
                className="h-fit space-y-5 rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold">
                    {editingTeamId ? "Edit team" : "Create a team"}
                  </h4>
                  {editingTeamId && (
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                      Editing
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Team name *
                  </label>
                  <input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Blue Tigers"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#111114] px-3.5 py-3 text-sm outline-none focus:border-violet-400/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Team logo URL
                  </label>
                  <input
                    type="url"
                    value={teamLogo}
                    onChange={(e) => setTeamLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-xl border border-white/10 bg-[#111114] px-3.5 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-400/60"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label className="text-sm text-zinc-300">Select players *</label>
                    <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300">
                      {selectedPlayers.length} selected
                    </span>
                  </div>

                  {players.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-zinc-500">
                      No players found. Check your players API.
                    </p>
                  ) : (
                    <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                      {players.map((player) => {
                        const playerId = String(player._id);
                        const isSelected = selectedPlayers.includes(playerId);
                        const isAssigned = assignedPlayerIds.has(playerId);
                        const isDisabled = isAssigned && !isSelected;

                        return (
                          <label
                            key={playerId}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                              isDisabled
                                ? "cursor-not-allowed border-white/[0.04] bg-white/[0.02] opacity-40"
                                : isSelected
                                  ? "border-violet-400/30 bg-violet-500/[0.08]"
                                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={() => handlePlayerToggle(playerId)}
                              className="mt-1 accent-violet-500"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium text-zinc-200">
                                {player.name || "Unnamed player"}
                              </span>
                              {player.role && (
                                <span className="mt-1 block text-xs text-zinc-500">
                                  {player.role}
                                </span>
                              )}
                              {isDisabled && (
                                <span className="mt-1 block text-xs text-amber-300">
                                  Already assigned
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingTeamId
                        ? "Update team"
                        : "Create team"}
                  </button>
                  {editingTeamId && (
                    <button
                      type="button"
                      onClick={resetTeamForm}
                      className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:bg-white/[0.05]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* TEAM LIST */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold">Registered teams</h4>
                  <span className="text-sm text-zinc-500">{teams.length} total</span>
                </div>

                {teams.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center">
                    <p className="text-sm text-zinc-400">No teams in this tournament.</p>
                    <p className="mt-1 text-xs text-zinc-600">
                      Create your first squad using the form.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {teams.map((team) => (
                      <article
                        key={team._id}
                        className="rounded-2xl border border-white/[0.08] bg-[#0c0c0f] p-4 transition hover:border-white/15"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            {team.logo ? (
                              <img
                                src={team.logo}
                                alt={`${team.name} logo`}
                                className="h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg">
                                🛡️
                              </div>
                            )}
                            <div className="min-w-0">
                              <h5 className="truncate font-semibold">{team.name}</h5>
                              <p className="mt-1 text-xs text-zinc-500">
                                {(team.players || []).length} player(s)
                              </p>
                            </div>
                          </div>
                          <span className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-400">
                            Squad
                          </span>
                        </div>

                        <div className="my-4 flex flex-wrap gap-1.5">
                          {(team.players || []).length ? (
                            (team.players || []).map((player, index) => (
                              <span
                                key={idOf(player) || index}
                                className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-xs text-zinc-300"
                              >
                                {typeof player === "object"
                                  ? player.name
                                  : getPlayerName(player)}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-zinc-600">No players assigned</span>
                          )}
                        </div>

                        <div className="flex gap-2 border-t border-white/[0.07] pt-3">
                          <button
                            type="button"
                            onClick={() => handleEditTeam(team)}
                            className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.05]"
                          >
                            Edit team
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeam(team._id)}
                            disabled={loading}
                            className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CREATE MATCH */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111114]">
            <div className="border-b border-white/[0.07] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-lg">
                  📅
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Schedule a match</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Add a fixture between two tournament teams.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {teams.length < 2 ? (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-200">
                  Add at least two teams before scheduling a match.
                </div>
              ) : (
                <form onSubmit={handleCreateMatch} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-sm text-zinc-300">Stage *</label>
                      <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                      >
                        <option value="group">Group stage</option>
                        <option value="quarter-final">Quarter-final</option>
                        <option value="semi-final">Semi-final</option>
                        <option value="final">Final</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-zinc-300">Match number *</label>
                      <input
                        type="number"
                        min="1"
                        value={matchNumber}
                        onChange={(e) => setMatchNumber(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-zinc-300">Team A *</label>
                      <select
                        value={teamA}
                        onChange={(e) => setTeamA(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                      >
                        <option value="">Select team</option>
                        {teams.map((team) => (
                          <option key={team._id} value={team._id}>{team.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-zinc-300">Team B *</label>
                      <select
                        value={teamB}
                        onChange={(e) => setTeamB(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                      >
                        <option value="">Select team</option>
                        {teams.map((team) => (
                          <option key={team._id} value={team._id}>{team.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="mb-2 block text-sm text-zinc-300">Date and time</label>
                      <input
                        type="datetime-local"
                        value={matchDate}
                        onChange={(e) => setMatchDate(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-white/[0.07] pt-5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50 sm:w-auto"
                    >
                      {loading ? "Scheduling..." : "+ Schedule match"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* MATCHES */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                  Fixtures & results
                </p>
                <h3 className="text-xl font-semibold">Manage matches</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Record scores, goal scorers, defenders and match reports.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400">
                {matches.length} matches
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-5 py-14 text-center">
                <div className="mb-3 text-3xl">📅</div>
                <h4 className="font-medium text-zinc-200">No fixtures scheduled</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  Your tournament matches will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 2xl:grid-cols-2">
                {matches.map((match) => {
                  const draft = scoreDrafts[match._id] || {
                    teamAScore: match.teamAScore ?? 0,
                    teamBScore: match.teamBScore ?? 0,
                    goalScorers: [],
                    bestDefender: "",
                    summary: "",
                  };

                  const completed = match.status === "completed";
                  const teamAPlayers = getTeamPlayers(idOf(match.teamA));
                  const teamBPlayers = getTeamPlayers(idOf(match.teamB));

                  return (
                    <article
                      key={match._id}
                      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111114]"
                    >
                      {/* MATCH HEADER */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                              {String(match.stage || "other").replaceAll("-", " ")}
                            </span>
                            <span className="text-xs text-zinc-500">
                              Match #{match.matchNumber}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-zinc-500">
                            {formatMatchDate(match.date)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                            completed
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                              : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                          }`}
                        >
                          {match.status || "scheduled"}
                        </span>
                      </div>

                      {/* SCOREBOARD */}
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 bg-white/[0.015] px-4 py-6 sm:px-5">
                        <div className="min-w-0 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg">
                            🛡️
                          </div>
                          <p className="truncate text-sm font-semibold sm:text-base">
                            {getTeamName(match.teamA)}
                          </p>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            aria-label={`${getTeamName(match.teamA)} score`}
                            value={draft.teamAScore}
                            disabled={completed}
                            onChange={(e) =>
                              updateMatchDraft(match._id, {
                                teamAScore: e.target.value,
                              })
                            }
                            className="mx-auto mt-3 block w-20 rounded-xl border border-white/10 bg-[#0b0b0d] px-2 py-3 text-center text-2xl font-bold tabular-nums outline-none focus:border-violet-400/60 disabled:opacity-70"
                          />
                        </div>

                        <div className="pt-10 text-xs font-semibold tracking-[0.2em] text-zinc-600">
                          VS
                        </div>

                        <div className="min-w-0 text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg">
                            🛡️
                          </div>
                          <p className="truncate text-sm font-semibold sm:text-base">
                            {getTeamName(match.teamB)}
                          </p>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            aria-label={`${getTeamName(match.teamB)} score`}
                            value={draft.teamBScore}
                            disabled={completed}
                            onChange={(e) =>
                              updateMatchDraft(match._id, {
                                teamBScore: e.target.value,
                              })
                            }
                            className="mx-auto mt-3 block w-20 rounded-xl border border-white/10 bg-[#0b0b0d] px-2 py-3 text-center text-2xl font-bold tabular-nums outline-none focus:border-violet-400/60 disabled:opacity-70"
                          />
                        </div>
                      </div>

                      <div className="space-y-5 p-4 sm:p-5">
                        {/* GOAL SCORERS */}
                        <div className="rounded-xl border border-white/[0.07] bg-[#0c0c0f] p-4">
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h5 className="text-sm font-semibold">Goal scorers</h5>
                              <p className="mt-1 text-xs text-zinc-500">
                                Assign goals to players.
                              </p>
                            </div>
                            {!completed && (
                              <button
                                type="button"
                                onClick={() => addScorer(match._id)}
                                className="rounded-lg border border-violet-400/20 bg-violet-500/[0.08] px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/15"
                              >
                                + Add scorer
                              </button>
                            )}
                          </div>

                          {(draft.goalScorers || []).length === 0 ? (
                            <p className="rounded-lg border border-dashed border-white/[0.08] px-3 py-4 text-center text-xs text-zinc-600">
                              No goal scorers recorded.
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {draft.goalScorers.map((scorer, index) => {
                                const allowedPlayers = getTeamPlayers(scorer.team);

                                return (
                                  <div
                                    key={`${match._id}-scorer-${index}`}
                                    className="grid gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 sm:grid-cols-2"
                                  >
                                    <div>
                                      <label className="mb-1.5 block text-xs text-zinc-400">
                                        Scoring team
                                      </label>
                                      <select
                                        value={scorer.team || ""}
                                        disabled={completed}
                                        onChange={(e) =>
                                          updateScorer(match._id, index, "team", e.target.value)
                                        }
                                        className="w-full rounded-lg border border-white/10 bg-[#111114] px-3 py-2.5 text-sm outline-none focus:border-violet-400/60 disabled:opacity-60"
                                      >
                                        <option value="">Select team</option>
                                        <option value={idOf(match.teamA)}>
                                          {getTeamName(match.teamA)}
                                        </option>
                                        <option value={idOf(match.teamB)}>
                                          {getTeamName(match.teamB)}
                                        </option>
                                      </select>
                                    </div>

                                    <div>
                                      <label className="mb-1.5 block text-xs text-zinc-400">
                                        Player
                                      </label>
                                      <select
                                        value={scorer.player || ""}
                                        disabled={completed || !scorer.team}
                                        onChange={(e) =>
                                          updateScorer(match._id, index, "player", e.target.value)
                                        }
                                        className="w-full rounded-lg border border-white/10 bg-[#111114] px-3 py-2.5 text-sm outline-none focus:border-violet-400/60 disabled:opacity-60"
                                      >
                                        {renderPlayerOptions(scorer.team)}
                                      </select>
                                      {scorer.player &&
                                        !allowedPlayers.some(
                                          (player) => idOf(player) === idOf(scorer.player)
                                        ) && (
                                          <p className="mt-1 text-xs text-red-300">
                                            Choose a player from this team.
                                          </p>
                                        )}
                                    </div>

                                    <div>
                                      <label className="mb-1.5 block text-xs text-zinc-400">
                                        Goals
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={scorer.goals}
                                        disabled={completed}
                                        onChange={(e) =>
                                          updateScorer(
                                            match._id,
                                            index,
                                            "goals",
                                            e.target.value === "" ? "" : Number(e.target.value)
                                          )
                                        }
                                        className="w-full rounded-lg border border-white/10 bg-[#111114] px-3 py-2.5 text-sm outline-none focus:border-violet-400/60 disabled:opacity-60"
                                      />
                                    </div>

                                    {!completed && (
                                      <div className="flex items-end">
                                        <button
                                          type="button"
                                          onClick={() => removeScorer(match._id, index)}
                                          className="w-full rounded-lg border border-red-500/20 px-3 py-2.5 text-xs text-red-300 transition hover:bg-red-500/10"
                                        >
                                          Remove scorer
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* BEST DEFENDER */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Best defender
                          </label>
                          <select
                            value={draft.bestDefender || ""}
                            disabled={completed}
                            onChange={(e) =>
                              updateMatchDraft(match._id, {
                                bestDefender: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60 disabled:opacity-60"
                          >
                            <option value="">Not selected</option>
                            <optgroup label={getTeamName(match.teamA)}>
                              {teamAPlayers.map((player) => (
                                <option key={player._id} value={player._id}>
                                  {player.name}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label={getTeamName(match.teamB)}>
                              {teamBPlayers.map((player) => (
                                <option key={player._id} value={player._id}>
                                  {player.name}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          {match.bestDefender && (
                            <p className="mt-2 text-xs text-zinc-500">
                              Saved defender:{" "}
                              {typeof match.bestDefender === "object"
                                ? match.bestDefender.name
                                : getPlayerName(match.bestDefender)}
                            </p>
                          )}
                        </div>

                        {/* SUMMARY */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-zinc-300">
                            Match summary
                          </label>
                          <textarea
                            rows={3}
                            value={draft.summary || ""}
                            disabled={completed}
                            onChange={(e) =>
                              updateMatchDraft(match._id, {
                                summary: e.target.value,
                              })
                            }
                            placeholder="Write a short match report..."
                            className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm leading-6 outline-none placeholder:text-zinc-600 focus:border-violet-400/60 disabled:opacity-60"
                          />
                        </div>

                        {completed && (
                          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-3 text-sm text-emerald-300">
                            ✓{" "}
                            {match.winner
                              ? `Winner: ${getTeamName(match.winner)}`
                              : "No winner recorded."}
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div className="flex flex-col gap-2 border-t border-white/[0.07] pt-4 sm:flex-row sm:flex-wrap">
                          {!completed && (
                            <>
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleSaveScore(match, "scheduled")}
                                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.05] disabled:opacity-50"
                              >
                                Save match details
                              </button>
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleSaveScore(match, "completed")}
                                className="flex-1 rounded-xl bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
                              >
                                Complete match ✓
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleDeleteMatch(match._id)}
                            className="rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                          >
                            Delete match
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* AWARDS */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111114]">
            <div className="border-b border-white/[0.07] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-lg">
                  🏆
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tournament awards</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Recognize the standout teams and players.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAwards} className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    🥇 Tournament winner
                  </label>
                  <select
                    value={awardDraft.winner}
                    onChange={(e) =>
                      setAwardDraft((prev) => ({
                        ...prev,
                        winner: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                  >
                    <option value="">Not selected</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    ⚽ Golden Boot — Best scorer
                  </label>
                  <select
                    value={awardDraft.bestScorer}
                    onChange={(e) =>
                      setAwardDraft((prev) => ({
                        ...prev,
                        bestScorer: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                  >
                    <option value="">Not selected</option>
                    {players.map((player) => (
                      <option key={player._id} value={player._id}>{player.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    🛡️ Overall best defender
                  </label>
                  <select
                    value={awardDraft.bestDefender}
                    onChange={(e) =>
                      setAwardDraft((prev) => ({
                        ...prev,
                        bestDefender: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                  >
                    <option value="">Not selected</option>
                    {players.map((player) => (
                      <option key={player._id} value={player._id}>{player.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    🌟 Finals MVP
                  </label>
                  <select
                    value={awardDraft.bestPlayer}
                    onChange={(e) =>
                      setAwardDraft((prev) => ({
                        ...prev,
                        bestPlayer: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] px-3 py-3 text-sm outline-none focus:border-violet-400/60"
                  >
                    <option value="">Not selected</option>
                    {players.map((player) => (
                      <option key={player._id} value={player._id}>{player.name}</option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-zinc-600">
                    Uses your existing Tournament.bestPlayer field.
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center">
                <p className="text-xs text-zinc-500">
                  Changes apply to this tournament.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:opacity-50"
                >
                  {loading ? "Saving awards..." : "Save tournament awards"}
                </button>
              </div>
            </form>
          </section>
        </section>
      )}

      <footer className="border-t border-white/[0.07] pt-5 text-center text-xs text-zinc-600">
        SCMG Tournament Workspace · Manage your competition in one place
      </footer>
    </div>
  </div>
);
};

export default ManageTournaments;