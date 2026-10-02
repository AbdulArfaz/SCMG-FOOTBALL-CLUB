import React, { useState } from 'react';
import ManagePlayers from './ManagePlayers';
import DailyScores from './DailyScores';
import StatsSummaries from './StatsSummaries';

export default function AdminDashboard({ setIsAdminLoggedIn }) {
  const [adminTab, setAdminTab] = useState('players');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-emerald-900 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">⚙️ Admin Control Center</h1>
          <p className="text-emerald-200 text-sm">Manage players, daily match scores, and monthly summaries</p>
        </div>
        <div className="flex space-x-2 bg-emerald-950 p-1 rounded-xl">
          <button onClick={() => setAdminTab('players')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${adminTab === 'players' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'}`}>
            All Players
          </button>
          <button onClick={() => setAdminTab('scores')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${adminTab === 'scores' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'}`}>
            Daily Score Updates
          </button>
          <button onClick={() => setAdminTab('stats')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${adminTab === 'stats' ? 'bg-emerald-700 text-white' : 'text-emerald-300 hover:text-white'}`}>
            Stats Summaries
          </button>
        </div>
      </div>

      {adminTab === 'players' && <ManagePlayers />}
      {adminTab === 'scores' && <DailyScores />}
      {adminTab === 'stats' && <StatsSummaries />}
    </div>
  );
}