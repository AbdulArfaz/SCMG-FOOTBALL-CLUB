import React, { useState } from "react";
import ManagePlayers from "./ManagePlayers";
import DailyScores from "./DailyScores";
import StatsSummaries from "./StatsSummaries";
import ManageMedia from "./ManageMedia";
import ManageVintage from "./ManageVintage";
import ManageTournaments from "./ManageTournaments";

const navigation = [
  { id: "players", label: "All Players", short: "Players", icon: "♙" },
  { id: "scores", label: "Daily Score Updates", short: "Daily Scores", icon: "⚽" },
  { id: "stats", label: "Stats Summaries", short: "Statistics", icon: "▥" },
  { id: "media", label: "Manage Media", short: "Media", icon: "▧" },
  { id: "vintage", label: "Manage Vintage", short: "Vintage", icon: "◷" },
  { id: "tournaments", label: "Special Tournaments", short: "Tournaments", icon: "🏆" },
];

export default function AdminDashboard({ setIsAdminLoggedIn }) {
  const [adminTab, setAdminTab] = useState("players");
  const [menuOpen, setMenuOpen] = useState(false);

  const activeItem =
    navigation.find((item) => item.id === adminTab) || navigation[0];

  const handleTabChange = (tab) => {
    setAdminTab(tab);
    setMenuOpen(false);
  };

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:space-y-6 sm:px-5 sm:py-6 lg:px-8">
      {/* Dashboard header */}
      <header className="relative overflow-hidden rounded-2xl border border-emerald-800/70 bg-[#071a14] text-white shadow-xl shadow-black/10">
        {/* Subtle decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="relative flex items-center justify-between gap-3 p-4 sm:p-6 lg:p-7">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-2xl sm:h-14 sm:w-14">
              ⚙️
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 sm:text-xs">
                  SCMG Workspace
                </span>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-300">
                  ADMIN
                </span>
              </div>

              <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                Admin Control Center
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-emerald-100/65 sm:text-sm">
                Manage your club, match results, player statistics and tournaments.
              </p>
            </div>
          </div>

          {/* Mobile navigation toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 sm:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Active section + navigation */}
        <div className="relative border-t border-white/10 bg-black/10 p-3 sm:px-5 sm:py-4 lg:px-7">
          <div className="mb-3 flex items-center justify-between sm:hidden">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Current section
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-emerald-300">
                {activeItem.icon} {activeItem.label}
              </p>
            </div>
            <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1.5 text-xs text-emerald-300">
              {navigation.findIndex((item) => item.id === adminTab) + 1} /{" "}
              {navigation.length}
            </span>
          </div>

          {/* Desktop / tablet navigation */}
          <nav
            aria-label="Admin sections"
            className="hidden flex-wrap gap-2 sm:flex"
          >
            {navigation.map((item) => {
              const active = adminTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition duration-200 lg:px-4 ${
                    active
                      ? "border-emerald-400/30 bg-emerald-400 text-[#062016] shadow-lg shadow-emerald-950/20"
                      : "border-transparent text-gray-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span aria-hidden="true" className="text-base">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile navigation dropdown */}
          {menuOpen && (
            <nav
              aria-label="Mobile admin sections"
              className="grid grid-cols-1 gap-2 border-t border-white/10 pt-3 sm:hidden"
            >
              {navigation.map((item) => {
                const active = adminTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabChange(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "border-emerald-400/30 bg-emerald-400 text-[#062016]"
                        : "border-white/5 bg-white/[0.03] text-gray-300 hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/10 text-lg">
                      {item.icon}
                    </span>

                    <span className="flex-1">{item.label}</span>

                    {active && (
                      <span className="text-xs font-bold" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Current page heading */}
      <section className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            Management
          </p>
          <h2 className="mt-1 break-words text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {activeItem.label}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {adminTab === "players" &&
              "View and manage your football club's players."}
            {adminTab === "scores" &&
              "Update daily match scores and results."}
            {adminTab === "stats" &&
              "Review player statistics and monthly summaries."}
            {adminTab === "media" &&
              "Manage club images and media content."}
            {adminTab === "vintage" &&
              "Manage vintage club content and memories."}
            {adminTab === "tournaments" &&
              "Manage competitions, teams, fixtures and awards."}
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Admin workspace
        </div>
      </section>

      {/* Main content */}
      <section
        key={adminTab}
        className="min-w-0 animate-[fadeIn_200ms_ease-out]"
      >
        <div className="min-w-0 overflow-x-clip rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm shadow-gray-950/[0.03] sm:p-5 lg:p-6 dark:border-white/10 dark:bg-[#0b0d0c]">
          {adminTab === "players" && <ManagePlayers />}
          {adminTab === "scores" && <DailyScores />}
          {adminTab === "stats" && <StatsSummaries />}
          {adminTab === "media" && <ManageMedia />}
          {adminTab === "vintage" && <ManageVintage />}
          {adminTab === "tournaments" && <ManageTournaments />}
        </div>
      </section>
    </main>
  );
}