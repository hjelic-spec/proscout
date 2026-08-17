import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Star, Calendar, Plus } from 'lucide-react';
import { store } from '../store';
import { getAge } from '../types';
import { PlayerCard } from '../components/PlayerCard';

export function Dashboard() {
  const players = store.getPlayers();
  const gameLogs = store.getGameLogs();

  const stats = useMemo(() => {
    const ncaa = players.filter(p => p.league === 'NCAA').length;
    const hs = players.filter(p => p.league === 'High School').length;
    const aau = players.filter(p => p.league === 'AAU').length;
    const u16 = players.filter(p => p.ageGroup === 'U16').length;
    const u18 = players.filter(p => p.ageGroup === 'U18').length;
    const topProspects = [...players]
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 6);

    const recentlyUpdated = [...players]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 4);

    const thisWeekLogs = gameLogs.filter(g => {
      const d = new Date(g.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    });

    return { ncaa, hs, aau, u16, u18, topProspects, recentlyUpdated, thisWeekLogs };
  }, [players, gameLogs]);

  const statCards = [
    { label: 'Total Prospects', value: players.length, icon: Users, color: 'text-accent' },
    { label: 'NCAA', value: stats.ncaa, icon: Star, color: 'text-green-400' },
    { label: 'High School', value: stats.hs, icon: TrendingUp, color: 'text-cyan-400' },
    { label: 'AAU', value: stats.aau, icon: Calendar, color: 'text-purple-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-bright">Scout Dashboard</h1>
          <p className="text-sm text-text-dim mt-1">NCAA, High School & AAU Prospect Tracker</p>
        </div>
        <Link
          to="/players/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Player
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-court-light border border-court-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon size={20} className={color} />
            </div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-text-dim">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-court-light border border-court-border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-text-bright mb-1">Age Group Breakdown</h2>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-court-lighter rounded p-3 text-center">
              <div className="text-xl font-bold text-accent">{stats.u16}</div>
              <div className="text-xs text-text-dim">Under 16</div>
            </div>
            <div className="bg-court-lighter rounded p-3 text-center">
              <div className="text-xl font-bold text-accent">{stats.u18}</div>
              <div className="text-xs text-text-dim">Under 18</div>
            </div>
            <div className="bg-court-lighter rounded p-3 text-center">
              <div className="text-xl font-bold text-accent">
                {players.filter(p => p.ageGroup === 'U20').length}
              </div>
              <div className="text-xs text-text-dim">Under 20</div>
            </div>
            <div className="bg-court-lighter rounded p-3 text-center">
              <div className="text-xl font-bold text-accent">
                {players.filter(p => p.ageGroup === 'U23' || p.ageGroup === 'Pro').length}
              </div>
              <div className="text-xs text-text-dim">U23 / Pro</div>
            </div>
          </div>
        </div>

        <div className="bg-court-light border border-court-border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-text-bright mb-3">Recently Updated</h2>
          {stats.recentlyUpdated.length === 0 ? (
            <p className="text-sm text-text-dim">No players yet. Add your first prospect!</p>
          ) : (
            <div className="space-y-2">
              {stats.recentlyUpdated.map(p => (
                <Link
                  key={p.id}
                  to={`/players/${p.id}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-court-lighter transition-colors"
                >
                  <div>
                    <span className="text-sm text-text-bright">{p.firstName} {p.lastName}</span>
                    <span className="text-xs text-text-dim ml-2">{p.position} · {p.currentTeam}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-accent">{p.overallRating}</span>
                    <span className="text-xs text-text-dim">{getAge(p.dateOfBirth)}y</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats.topProspects.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-text-bright mb-3">Top Prospects by Potential</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topProspects.map(p => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
