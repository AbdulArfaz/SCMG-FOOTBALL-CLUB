import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Trophy,
  CalendarDays,
  MapPin,
  Users,
  Target,
  Shield,
  Star,
  Medal,
  Goal,
  ChevronDown,
  RefreshCw,
  Search,
  Flag,
  LoaderCircle,
  AlertCircle,
  Swords,
  Crown,
  ChartNoAxesCombined,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const api = axios.create({ baseURL: API_BASE });

const idOf = (value) => {
  if (value == null) return "";
  if (typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }
  return String(value);
};

const objectName = (value, fallback = "Unknown") => {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return (
    value.name ||
    value.fullName ||
    value.username ||
    value.playerName ||
    fallback
  );
};

const playerName = (value) => {
  if (value == null) return "Unknown player";
  if (typeof value === "object") {
    return (
      value.name ||
      value.fullName ||
      value.username ||
      value.playerName ||
      "Unknown player"
    );
  }
  return String(value);
};

const teamName = (value) => {
  if (value == null) return "TBD";
  if (typeof value === "object") {
    return value.name || value.teamName || "TBD";
  }
  return String(value);
};

const formatDate = (value) => {
  if (!value) return "Date not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getTournamentId = (tournament) => idOf(tournament?._id ?? tournament?.id);

const getWinnerName = (winner) => {
  if (!winner) return "";
  return objectName(winner, "");
};

const isCompleted = (match) =>
  String(match?.status || "").toLowerCase() === "completed";

const isValidNumber = (value) =>
  value !== "" && value !== null && value !== undefined &&
  Number.isFinite(Number(value));

function SectionTitle({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="text-xl font-black text-white sm:text-2xl">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = "emerald" }) {
  const accentStyles = {
    emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/15",
    amber: "bg-amber-400/10 text-amber-300 ring-amber-400/15",
    sky: "bg-sky-400/10 text-sky-300 ring-sky-400/15",
    violet: "bg-violet-400/10 text-violet-300 ring-violet-400/15",
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ${
            accentStyles[accent] || accentStyles.emerald
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function AwardCard({ icon: Icon, title, recipient, accent = "amber" }) {
  const accentStyles = {
    amber: "from-amber-400/15 to-orange-500/5 text-amber-300",
    emerald: "from-emerald-400/15 to-teal-500/5 text-emerald-300",
    sky: "from-sky-400/15 to-blue-500/5 text-sky-300",
    violet: "from-violet-400/15 to-purple-500/5 text-violet-300",
  };

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900 to-slate-950 p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
          accentStyles[accent] || accentStyles.amber
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {title}
        </p>
        <p className="mt-1 break-words text-sm font-bold text-white">
          {recipient || "Not announced"}
        </p>
      </div>
    </div>
  );
}

function MatchCard({ match, index }) {
  const [expanded, setExpanded] = useState(false);

  const home = teamName(match.teamA);
  const away = teamName(match.teamB);
  const scoreA = isValidNumber(match.teamAScore)
    ? Number(match.teamAScore)
    : null;
  const scoreB = isValidNumber(match.teamBScore)
    ? Number(match.teamBScore)
    : null;

  const completed = isCompleted(match);
  const scorers = Array.isArray(match.goalScorers) ? match.goalScorers : [];
  const totalGoals = scorers.reduce(
    (sum, scorer) => sum + (Number(scorer.goals) || 0),
    0
  );

  const defender = match.bestDefender;
  const winner = getWinnerName(match.winner);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/80 transition hover:border-emerald-400/25">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
            {match.stage || "Match"}
          </span>
          {match.matchNumber != null && (
            <span className="text-xs text-slate-500">
              Match #{match.matchNumber}
            </span>
          )}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            completed
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-amber-400/10 text-amber-300"
          }`}
        >
          {completed ? "Completed" : match.status || "Scheduled"}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(match.date)}
          </span>
          <span className="text-right">
            {completed ? "Full time" : "Match result"}
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
          <div className="min-w-0 text-center">
            {match.teamA?.logo && (
              <img
                src={match.teamA.logo}
                alt=""
                className="mx-auto mb-2 h-10 w-10 object-contain sm:h-12 sm:w-12"
                loading="lazy"
              />
            )}
            <p className="break-words text-sm font-bold text-white sm:text-base">
              {home}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
              Home
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-slate-950 px-3 py-2 sm:gap-3 sm:px-5 sm:py-3">
            <span className="text-2xl font-black tabular-nums text-white sm:text-3xl">
              {scoreA ?? "–"}
            </span>
            <span className="text-sm font-bold text-slate-600">:</span>
            <span className="text-2xl font-black tabular-nums text-white sm:text-3xl">
              {scoreB ?? "–"}
            </span>
          </div>

          <div className="min-w-0 text-center">
            {match.teamB?.logo && (
              <img
                src={match.teamB.logo}
                alt=""
                className="mx-auto mb-2 h-10 w-10 object-contain sm:h-12 sm:w-12"
                loading="lazy"
              />
            )}
            <p className="break-words text-sm font-bold text-white sm:text-base">
              {away}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">
              Away
            </p>
          </div>
        </div>

        {completed && (
          <div className="mt-4 rounded-xl bg-emerald-400/[0.06] px-3 py-2 text-center text-xs text-emerald-200">
            {winner
              ? `Winner: ${winner}`
              : scoreA === scoreB
                ? "Draw"
                : scoreA != null && scoreB != null
                  ? `Winner: ${scoreA > scoreB ? home : away}`
                  : "Result recorded"}
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((previous) => !previous)}
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/[0.07] px-3 py-3 text-sm font-semibold text-slate-300 transition hover:border-emerald-400/20 hover:bg-white/[0.03] hover:text-white"
          aria-expanded={expanded}
        >
          <span className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-emerald-400" />
            Match details
            {scorers.length > 0 && (
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                {totalGoals} goal{totalGoals === 1 ? "" : "s"}
              </span>
            )}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Goal className="h-4 w-4 text-emerald-400" />
                  Goal scorers
                </p>

                {scorers.length > 0 ? (
                  <div className="space-y-2">
                    {scorers.map((scorer, scorerIndex) => (
                      <div
                        key={scorer._id || scorer.id || scorerIndex}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-white">
                            {playerName(scorer.player)}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {teamName(scorer.team)}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-lg bg-emerald-400/10 px-2.5 py-1 font-bold text-emerald-300">
                          × {Number(scorer.goals) || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No goal-scorer details recorded.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Shield className="h-4 w-4 text-sky-400" />
                  Best defender
                </p>
                <p className="break-words text-sm font-bold text-white">
                  {defender ? playerName(defender) : "Not announced"}
                </p>
              </div>
            </div>

            {match.summary && (
              <div className="rounded-xl border border-white/[0.06] bg-slate-950/70 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Match summary
                </p>
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                  {match.summary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function TournamentsView() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  // Fetch every tournament.
  const fetchTournaments = async () => {
    setLoadingList(true);
    setError("");

    try {
      const response = await api.get("/tournaments");
      const list = Array.isArray(response.data)
        ? response.data
        : response.data?.tournaments || response.data?.data || [];

      setTournaments(list);

      if (list.length > 0) {
        setSelectedId((current) => {
          const stillExists = list.some(
            (item) => getTournamentId(item) === current
          );
          return stillExists ? current : getTournamentId(list[0]);
        });
      } else {
        setSelectedId("");
        setTournament(null);
        setTeams([]);
        setMatches([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load tournaments. Check your backend URL and server."
      );
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  // Fetch the selected tournament, participating teams and all matches.
  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;

    const fetchTournamentDetails = async () => {
      setLoadingDetails(true);
      setError("");

      try {
        const response = await api.get(`/tournaments/${selectedId}`);
        if (cancelled) return;

        const data = response.data?.tournament
          ? response.data
          : response.data?.data || response.data;

        setTournament(data.tournament || null);
        setTeams(Array.isArray(data.teams) ? data.teams : []);
        setMatches(Array.isArray(data.matches) ? data.matches : []);
      } catch (err) {
        if (cancelled) return;

        setTournament(null);
        setTeams([]);
        setMatches([]);
        setError(
          err.response?.data?.message ||
            "Unable to load this tournament's details."
        );
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    };

    fetchTournamentDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const visibleMatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...matches]
      .filter((match) => {
        if (stageFilter !== "All" && match.stage !== stageFilter) {
          return false;
        }

        if (!query) return true;

        const searchable = [
          teamName(match.teamA),
          teamName(match.teamB),
          match.stage,
          match.summary,
          playerName(match.bestDefender),
          ...(match.goalScorers || []).map((item) => playerName(item.player)),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      })
      .sort((a, b) => {
        const stageA = String(a.stage || "");
        const stageB = String(b.stage || "");

        if (stageA === stageB && a.matchNumber != null && b.matchNumber != null) {
          return Number(a.matchNumber) - Number(b.matchNumber);
        }

        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      });
  }, [matches, search, stageFilter]);

  const stats = useMemo(() => {
    const completed = matches.filter(isCompleted);
    const totalGoals = matches.reduce((sum, match) => {
      if (isValidNumber(match.teamAScore) && isValidNumber(match.teamBScore)) {
        return sum + Number(match.teamAScore) + Number(match.teamBScore);
      }

      return sum + (match.goalScorers || []).reduce(
        (goalSum, scorer) => goalSum + (Number(scorer.goals) || 0),
        0
      );
    }, 0);

    const scorers = new Map();

    matches.forEach((match) => {
      (match.goalScorers || []).forEach((item) => {
        const personId = idOf(item.player) || playerName(item.player);
        const personName = playerName(item.player);
        const count = Number(item.goals) || 0;

        if (!personId || personName === "Unknown player") return;

        const previous = scorers.get(personId) || {
          id: personId,
          name: personName,
          goals: 0,
        };

        previous.goals += count;
        scorers.set(personId, previous);
      });
    });

    const topScorers = [...scorers.values()].sort(
      (a, b) => b.goals - a.goals
    );

    return {
      matchCount: matches.length,
      completedCount: completed.length,
      teamCount: teams.length,
      totalGoals,
      topScorers,
    };
  }, [matches, teams]);

  const stages = useMemo(
    () => [
      "All",
      ...new Set(matches.map((match) => match.stage).filter(Boolean)),
    ],
    [matches]
  );

  const awards = tournament
    ? [
        {
          title: "Tournament Champion",
          recipient: objectName(tournament.winner, ""),
          icon: Trophy,
          accent: "amber",
        },
        {
          title: "Golden Boot · Best Scorer",
          recipient: objectName(tournament.bestScorer, ""),
          icon: Target,
          accent: "emerald",
        },
        {
          title: "Best Defender",
          recipient: objectName(tournament.bestDefender, ""),
          icon: Shield,
          accent: "sky",
        },
        {
          title: "Best Player / Finals MVP",
          recipient: objectName(tournament.bestPlayer, ""),
          icon: Star,
          accent: "violet",
        },
      ]
    : [];

  const tournamentName = tournament?.name || "Tournament Archive";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-emerald-400/10 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-950">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-teal-500/[0.08] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                <Trophy className="h-3.5 w-3.5" />
                SCMG Football Club
              </div>

              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Tournament{" "}
                <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  Archive
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Every match. Every goal. Every champion. Relive SCMG's
                tournaments, match results, player performances and awards.
              </p>
            </div>

            <div className="w-full md:max-w-sm">
              <label
                htmlFor="tournament-select"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Select tournament
              </label>
              <div className="relative">
                <Trophy className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                <select
                  id="tournament-select"
                  value={selectedId}
                  onChange={(event) => setSelectedId(event.target.value)}
                  disabled={loadingList || tournaments.length === 0}
                  className="w-full appearance-none rounded-xl border border-emerald-400/20 bg-slate-900 py-3.5 pl-10 pr-10 text-sm font-semibold text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 disabled:opacity-60"
                >
                  {tournaments.length === 0 && (
                    <option value="">No tournaments available</option>
                  )}
                  {tournaments.map((item, index) => (
                    <option
                      key={getTournamentId(item) || index}
                      value={getTournamentId(item)}
                    >
                      {item.name || `Tournament ${index + 1}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Loading state */}
        {(loadingList || loadingDetails) && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900/50 px-4 py-16 text-center">
            <LoaderCircle className="h-9 w-9 animate-spin text-emerald-400" />
            <p className="mt-4 font-semibold text-white">
              Loading tournament data...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Fetching matches, results and player statistics.
            </p>
          </div>
        )}

        {/* Error state */}
        {!loadingList && !loadingDetails && error && (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-white">Couldn't load tournament</h2>
                <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={fetchTournaments}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loadingList &&
          !loadingDetails &&
          !error &&
          tournaments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 px-5 py-16 text-center">
              <Trophy className="mx-auto h-12 w-12 text-slate-700" />
              <h2 className="mt-4 text-xl font-bold text-white">
                No tournaments yet
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Tournament records will appear here after they are created and
                saved in the admin panel.
              </p>
            </div>
          )}

        {!loadingList && !loadingDetails && !error && tournament && (
          <>
            {/* Tournament overview */}
            <section className="overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900">
              <div className="border-b border-white/[0.07] p-5 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                      Tournament Overview
                    </p>
                    <h2 className="mt-2 break-words text-2xl font-black sm:text-3xl">
                      {tournamentName}
                    </h2>
                    {tournament.description && (
                      <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-slate-400">
                        {tournament.description}
                      </p>
                    )}
                  </div>
                  <span className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
                    <Trophy className="mr-1.5 inline h-4 w-4" />
                    SCMG Tournament
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-emerald-400" />
                    {formatDate(tournament.startDate)}
                    {" — "}
                    {formatDate(tournament.endDate)}
                  </span>
                  {tournament.venue && (
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-400" />
                      {tournament.venue}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-px bg-white/[0.06] sm:grid-cols-4">
                <div className="bg-slate-950/30 p-4 sm:p-5">
                  <p className="text-xs text-slate-500">Matches</p>
                  <p className="mt-2 text-2xl font-black">{stats.matchCount}</p>
                </div>
                <div className="bg-slate-950/30 p-4 sm:p-5">
                  <p className="text-xs text-slate-500">Completed</p>
                  <p className="mt-2 text-2xl font-black text-emerald-300">
                    {stats.completedCount}
                  </p>
                </div>
                <div className="bg-slate-950/30 p-4 sm:p-5">
                  <p className="text-xs text-slate-500">Total Goals</p>
                  <p className="mt-2 text-2xl font-black">{stats.totalGoals}</p>
                </div>
                <div className="bg-slate-950/30 p-4 sm:p-5">
                  <p className="text-xs text-slate-500">Teams</p>
                  <p className="mt-2 text-2xl font-black">{stats.teamCount}</p>
                </div>
              </div>
            </section>

            {/* Awards */}
            <section>
              <SectionTitle
                icon={Medal}
                eyebrow="Honours & Recognition"
                title="Tournament Awards"
                description="The champions and standout players recognised in the admin records."
              />

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {awards.map((award) => (
                  <AwardCard
                    key={award.title}
                    icon={award.icon}
                    title={award.title}
                    recipient={award.recipient}
                    accent={award.accent}
                  />
                ))}
              </div>
            </section>

            {/* Top scorer stats */}
            <section>
              <SectionTitle
                icon={ChartNoAxesCombined}
                eyebrow="Player Performance"
                title="Top Goal Scorers"
                description="Goals are calculated from the match-level goal-scorer records."
              />

              {stats.topScorers.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/70">
                  {stats.topScorers.slice(0, 10).map((scorer, index) => (
                    <div
                      key={scorer.id}
                      className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-b-0 sm:px-5"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                          index === 0
                            ? "bg-amber-400/15 text-amber-300"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {index === 0 ? (
                          <Crown className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-white">
                          {scorer.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {index === 0 ? "Top scorer in recorded matches" : "Tournament scorer"}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-lg font-black text-emerald-300">
                          {scorer.goals}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Goals
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                  No individual goal records available yet.
                </div>
              )}
            </section>

            {/* Teams */}
            <section>
              <SectionTitle
                icon={Users}
                eyebrow="Participating Clubs"
                title="Teams & Players"
                description="The teams and player lists attached to this tournament."
              />

              {teams.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {teams.map((team, index) => {
                    const players = Array.isArray(team.players)
                      ? team.players
                      : [];

                    return (
                      <div
                        key={idOf(team) || index}
                        className="rounded-2xl border border-white/[0.08] bg-slate-900/70 p-4 sm:p-5"
                      >
                        <div className="flex items-center gap-3">
                          {team.logo ? (
                            <img
                              src={team.logo}
                              alt={`${team.name || "Team"} logo`}
                              className="h-12 w-12 rounded-xl bg-slate-950 object-contain p-1.5"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                              <Shield className="h-6 w-6" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3 className="break-words font-bold text-white">
                              {team.name || `Team ${index + 1}`}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {players.length} player{players.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>

                        {players.length > 0 && (
                          <div className="mt-4 border-t border-white/[0.07] pt-3">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Squad
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {players.map((player, playerIndex) => (
                                <span
                                  key={idOf(player) || playerIndex}
                                  className="max-w-full break-words rounded-lg border border-white/[0.06] bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300"
                                >
                                  {playerName(player)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-500">
                  No participating-team records are available.
                </p>
              )}
            </section>

            {/* Match archive */}
            <section>
              <SectionTitle
                icon={Flag}
                eyebrow="Complete Match History"
                title="Matches & Results"
                description="Open any match to see goal scorers, best defender and the match summary."
              />

              <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search teams, players or match summary..."
                    className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
                  />
                </div>

                <select
                  value={stageFilter}
                  onChange={(event) => setStageFilter(event.target.value)}
                  aria-label="Filter matches by stage"
                  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50 sm:min-w-44"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage === "All" ? "All stages" : stage}
                    </option>
                  ))}
                </select>
              </div>

              {visibleMatches.length > 0 ? (
                <div className="grid items-start gap-4 xl:grid-cols-2">
                  {visibleMatches.map((match, index) => (
                    <MatchCard
                      key={idOf(match) || index}
                      match={match}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                  <Swords className="mx-auto h-9 w-9 text-slate-700" />
                  <p className="mt-3 font-semibold text-white">
                    No matches found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another search or select a different stage.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        <footer className="border-t border-white/[0.07] py-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            SCMG Football Club · Tournament Archive
          </p>
        </footer>
      </div>
    </main>
  );
}