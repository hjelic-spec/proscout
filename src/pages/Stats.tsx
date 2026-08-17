import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { store } from '../store';
import type { SkillRatings } from '../types';
import { getAge, SKILL_LABELS } from '../types';

export function Stats() {
  const players = store.getPlayers();
  const [view, setView] = useState<'leaders' | 'distribution' | 'skills'>('leaders');

  const leaderboard = useMemo(() => {
    return players.map(p => {
      const logs = store.getGameLogs(p.id);
      const n = logs.length;
      if (n === 0) return { player: p, ppg: 0, rpg: 0, apg: 0, spg: 0, bpg: 0, games: 0 };
      return {
        player: p,
        ppg: logs.reduce((a, g) => a + g.points, 0) / n,
        rpg: logs.reduce((a, g) => a + g.rebounds, 0) / n,
        apg: logs.reduce((a, g) => a + g.assists, 0) / n,
        spg: logs.reduce((a, g) => a + g.steals, 0) / n,
        bpg: logs.reduce((a, g) => a + g.blocks, 0) / n,
        games: n,
      };
    }).filter(p => p.games > 0);
  }, [players]);

  const positionData = useMemo(() => {
    const counts: Record<string, number> = { PG: 0, SG: 0, SF: 0, PF: 0, C: 0 };
    players.forEach(p => { counts[p.position] = (counts[p.position] || 0) + 1; });
    return Object.entries(counts).map(([pos, count]) => ({ position: pos, count }));
  }, [players]);

  const ageData = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach(p => {
      const age = getAge(p.dateOfBirth);
      const key = `${age}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort(([a], [b]) => Number(a) - Number(b)).map(([age, count]) => ({ age, count }));
  }, [players]);

  const avgSkillsByPosition = useMemo(() => {
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    const skillKeys = Object.keys(SKILL_LABELS) as (keyof SkillRatings)[];

    return skillKeys.map(skill => {
      const row: Record<string, string | number> = { skill: SKILL_LABELS[skill] };
      for (const pos of positions) {
        const posPlayers = players.filter(p => p.position === pos);
        row[pos] = posPlayers.length > 0
          ? Number((posPlayers.reduce((a, p) => a + p.skills[skill], 0) / posPlayers.length).toFixed(1))
          : 0;
      }
      return row;
    });
  }, [players]);

  const statLeader = (label: string, key: keyof typeof leaderboard[0]) => {
    const sorted = [...leaderboard].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, 5);
    return (
      <div className="bg-court-light border border-court-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-text-bright mb-3">{label} Leaders</h3>
        {sorted.length === 0 ? (
          <p className="text-xs text-text-dim">No game data yet.</p>
        ) : (
          <div className="space-y-2">
            {sorted.map((entry, i) => (
              <Link
                key={entry.player.id}
                to={`/players/${entry.player.id}`}
                className="flex items-center justify-between text-sm hover:bg-court-lighter/50 rounded px-2 py-1 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 font-bold text-xs ${i === 0 ? 'text-gold' : 'text-text-dim'}`}>{i + 1}</span>
                  <span className="text-text-bright">{entry.player.firstName} {entry.player.lastName}</span>
                  <span className="text-xs text-text-dim">{entry.player.position}</span>
                </div>
                <span className="font-bold text-accent">{(entry[key] as number).toFixed(1)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const tooltipStyle = {
    backgroundColor: '#1a1d35',
    border: '1px solid #2e3456',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '12px',
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-text-bright">Statistics</h1>

      <div className="flex gap-1 bg-court-light border border-court-border rounded-lg p-1 w-fit">
        {(['leaders', 'distribution', 'skills'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 text-sm rounded font-medium transition-colors capitalize ${
              view === v ? 'bg-accent text-white' : 'text-text-dim hover:text-text'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'leaders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statLeader('Scoring (PPG)', 'ppg')}
          {statLeader('Rebounding (RPG)', 'rpg')}
          {statLeader('Assists (APG)', 'apg')}
          {statLeader('Steals (SPG)', 'spg')}
          {statLeader('Blocks (BPG)', 'bpg')}
        </div>
      )}

      {view === 'distribution' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-court-light border border-court-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-text-bright mb-4">Position Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3456" />
                <XAxis dataKey="position" stroke="#8892b0" fontSize={12} />
                <YAxis stroke="#8892b0" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-court-light border border-court-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-text-bright mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3456" />
                <XAxis dataKey="age" stroke="#8892b0" fontSize={12} />
                <YAxis stroke="#8892b0" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#1d428a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-court-light border border-court-border rounded-lg p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-text-bright mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={players.map(p => ({ name: `${p.firstName[0]}. ${p.lastName}`, overall: p.overallRating, potential: p.potential })).sort((a, b) => b.overall - a.overall).slice(0, 20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e3456" />
                <XAxis dataKey="name" stroke="#8892b0" fontSize={10} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#8892b0" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="overall" fill="#e94560" radius={[2, 2, 0, 0]} name="Overall" />
                <Bar dataKey="potential" fill="#f5a623" radius={[2, 2, 0, 0]} name="Potential" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'skills' && (
        <div className="bg-court-light border border-court-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-text-bright mb-4">Average Skills by Position</h3>
          {players.length === 0 ? (
            <p className="text-sm text-text-dim">Add players to see skill breakdowns.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-court-border text-text-dim text-xs">
                    <th className="py-2 px-3 text-left">Skill</th>
                    <th className="py-2 px-3 text-center">PG</th>
                    <th className="py-2 px-3 text-center">SG</th>
                    <th className="py-2 px-3 text-center">SF</th>
                    <th className="py-2 px-3 text-center">PF</th>
                    <th className="py-2 px-3 text-center">C</th>
                  </tr>
                </thead>
                <tbody>
                  {avgSkillsByPosition.map(row => (
                    <tr key={row.skill as string} className="border-b border-court-border/30">
                      <td className="py-2 px-3 text-text-dim">{row.skill}</td>
                      {['PG', 'SG', 'SF', 'PF', 'C'].map(pos => (
                        <td key={pos} className="py-2 px-3 text-center">
                          <span className={`font-mono ${(row[pos] as number) >= 7 ? 'text-success' : (row[pos] as number) >= 5 ? 'text-text' : 'text-danger'}`}>
                            {row[pos] || '-'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
