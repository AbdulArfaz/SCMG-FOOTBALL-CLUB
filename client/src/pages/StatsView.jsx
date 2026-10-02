import React, { useState, useEffect } from 'react';
import { Trophy, Shield, Award, Calendar, BarChart2 } from 'lucide-react';
import { fetchLeaderboard } from '../services/api';

export default function StatsView() {
  const currentDate = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentDate);
  const [leaderboard, setLeaderboard] = useState({
    topScorers: [],
    topDefenders: [],
    mostWins: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [month]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetchLeaderboard(month);
      setLeaderboard(res.data);
    } catch (err) {
      console.error('Error fetching public stats leaderboard:', err);
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
              <BarChart2 className="h-6 w-6" />
              <span>Performance Leaderboard</span>
            </h1>
            <p className="text-emerald-200 text-sm mt-1">Live match statistics aggregated directly from admin records</p>
          </div>
          
        
          <div className="flex items-center space-x-2 bg-emerald-800/80 border border-emerald-700 px-3 py-2 rounded-xl">
            <Calendar className="h-4 w-4 text-emerald-200" />
            <input 
              type="month" 
              value={month} 
              onChange={(e) => setMonth(e.target.value)} 
              className="bg-transparent text-sm outline-none font-medium text-white" 
            />
          </div>
        </div>
      </header>

  
      <main className="max-w-5xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium">Calculating live stats...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
          
            <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-amber-600 font-bold border-b pb-3">
                <Trophy className="h-5 w-5" />
                <span>Top Scorers (Goals)</span>
              </div>
              <div className="space-y-3">
                {leaderboard.topScorers.map((item, index) => (
                  <div key={item._id} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full ${index === 0 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {index + 1}
                      </span>
                      <span className="font-semibold text-gray-900">{item.playerDetails?.name || 'Unknown'}</span>
                    </div>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                      {item.totalGoals} ⚽
                    </span>
                  </div>
                ))}
                {leaderboard.topScorers.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-6">No goals recorded for this month.</p>
                )}
              </div>
            </div>

         
            <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-blue-600 font-bold border-b pb-3">
                <Shield className="h-5 w-5" />
                <span>Top Defenders (Tackles)</span>
              </div>
              <div className="space-y-3">
                {leaderboard.topDefenders.map((item, index) => (
                  <div key={item._id} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full ${index === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {index + 1}
                      </span>
                      <span className="font-semibold text-gray-900">{item.playerDetails?.name || 'Unknown'}</span>
                    </div>
                    <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {item.totalTackles} 🛡️
                    </span>
                  </div>
                ))}
                {leaderboard.topDefenders.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-6">No tackles recorded for this month.</p>
                )}
              </div>
            </div>

          
            <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold border-b pb-3">
                <Award className="h-5 w-5" />
                <span>Most Wins</span>
              </div>
              <div className="space-y-3">
                {leaderboard.mostWins.map((item, index) => (
                  <div key={item._id} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full ${index === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {index + 1}
                      </span>
                      <span className="font-semibold text-gray-900">{item.playerDetails?.name || 'Unknown'}</span>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {item.totalWins} 🏆
                    </span>
                  </div>
                ))}
                {leaderboard.mostWins.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-6">No wins recorded for this month.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}