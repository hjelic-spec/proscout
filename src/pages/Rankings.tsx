import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, TrendingUp, TrendingDown, Minus, Calendar, Download } from 'lucide-react';
import { store } from '../store';
import { getAge } from '../types';

type RankBy = 'overall' | 'potential' | 'ppg' | 'rpg' | 'apg';

const DRAFT_CLASSES = ['2028', '2029', '2030', 'All'] as const;
type DraftClass = typeof DRAFT_CLASSES[number];

interface RankingSnapshot {
  date: string;
  category: string;
  rankings: { playerId: string; rank: number; rating: number }[];
}

function getWeekKey(date: Date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

function loadSnapshots(): RankingSnapshot[] {
  try {
    return JSON.parse(localStorage.getItem('scout_ranking_snapshots') || '[]');
  } catch { return []; }
}

function saveSnapshot(snapshot: RankingSnapshot) {
  const snapshots = loadSnapshots();
  const idx = snapshots.findIndex(s => s.date === snapshot.date && s.category === snapshot.category);
  if (idx >= 0) snapshots[idx] = snapshot;
  else snapshots.push(snapshot);
  localStorage.setItem('scout_ranking_snapshots', JSON.stringify(snapshots));
}

export function Rankings() {
  const [draftClass, setDraftClass] = useState<DraftClass>('All');
  const [rankBy, setRankBy] = useState<RankBy>('overall');
  const players = store.getPlayers();

  const filtered = useMemo(() => {
    if (draftClass === 'All') return [...players];
    return players.filter(p => p.draftYear === Number(draftClass));
  }, [players, draftClass]);

  const playerAverages = useMemo(() => {
    const avgs: Record<string, { ppg: number; rpg: number; apg: number; games: number }> = {};
    for (const p of filtered) {
      const logs = store.getGameLogs(p.id);
      if (logs.length === 0) { avgs[p.id] = { ppg: 0, rpg: 0, apg: 0, games: 0 }; continue; }
      const n = logs.length;
      avgs[p.id] = {
        ppg: logs.reduce((a, g) => a + g.points, 0) / n,
        rpg: logs.reduce((a, g) => a + g.rebounds, 0) / n,
        apg: logs.reduce((a, g) => a + g.assists, 0) / n,
        games: n,
      };
    }
    return avgs;
  }, [filtered]);

  const ranked = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (rankBy) {
        case 'overall': return b.overallRating - a.overallRating;
        case 'potential': return b.potential - a.potential;
        case 'ppg': return (playerAverages[b.id]?.ppg || 0) - (playerAverages[a.id]?.ppg || 0);
        case 'rpg': return (playerAverages[b.id]?.rpg || 0) - (playerAverages[a.id]?.rpg || 0);
        case 'apg': return (playerAverages[b.id]?.apg || 0) - (playerAverages[a.id]?.apg || 0);
        default: return 0;
      }
    });
  }, [filtered, rankBy, playerAverages]);

  const previousRankings = useMemo(() => {
    const prev = new Date();
    prev.setDate(prev.getDate() - 7);
    return loadSnapshots().find(s => s.date === getWeekKey(prev) && s.category === draftClass)?.rankings || [];
  }, [draftClass]);

  const getRankChange = (playerId: string, currentRank: number) => {
    const prev = previousRankings.find(r => r.playerId === playerId);
    if (!prev) return null;
    return prev.rank - currentRank;
  };

  const handleSaveSnapshot = () => {
    const weekKey = getWeekKey();
    saveSnapshot({
      date: weekKey,
      category: draftClass,
      rankings: ranked.map((p, i) => ({ playerId: p.id, rank: i + 1, rating: p.overallRating })),
    });
    alert(`Week ${weekKey} rankings saved for Draft Class ${draftClass}!`);
  };

  const handleExport = () => {
    if (ranked.length === 0) return;
    const rows = ranked.map((p, i) => [
      i + 1, `${p.firstName} ${p.lastName}`, p.position, getAge(p.dateOfBirth),
      p.currentTeam, p.league, p.draftYear || '', p.draftProjection,
      p.overallRating, p.potential,
      playerAverages[p.id]?.ppg.toFixed(1) || '0.0',
      playerAverages[p.id]?.rpg.toFixed(1) || '0.0',
      playerAverages[p.id]?.apg.toFixed(1) || '0.0',
      playerAverages[p.id]?.games || 0,
    ]);
    const csv = ['Rank,Name,Pos,Age,Team,League,Draft Year,Projection,OVR,POT,PPG,RPG,APG,GP', ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proscout-${draftClass}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const classCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cls of DRAFT_CLASSES) {
      c[cls] = cls === 'All' ? players.length : players.filter(p => p.draftYear === Number(cls)).length;
    }
    return c;
  }, [players]);

  const medalColors = ['text-gold', 'text-silver', 'text-bronze'];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-bright flex items-center gap-2">
            <Trophy size={24} className="text-gold" /> Draft Rankings
          </h1>
          <p className="text-sm text-text-dim mt-1">Weekly prospect rankings by draft class</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSaveSnapshot} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-court-lighter border border-court-border rounded text-text-dim hover:text-accent hover:border-accent/40 transition-colors">
            <Calendar size={14} /> Save Weekly Snapshot
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-court-lighter border border-court-border rounded text-text-dim hover:text-text transition-colors">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-1 bg-court-light border border-court-border rounded-lg p-1">
          {DRAFT_CLASSES.map(cls => (
            <button
              key={cls}
              onClick={() => setDraftClass(cls)}
              className={`px-3 py-1.5 text-sm rounded font-medium transition-colors ${
                draftClass === cls ? 'bg-accent text-white' : 'text-text-dim hover:text-text'
              }`}
            >
              {cls === 'All' ? 'All' : cls}
              <span className="ml-1 text-xs opacity-60">({classCounts[cls]})</span>
            </button>
          ))}
        </div>
        <select
          className="bg-court-lighter border border-court-border rounded px-3 py-2 text-sm text-text focus:border-accent focus:outline-none"
          value={rankBy}
          onChange={e => setRankBy(e.target.value as RankBy)}
        >
          <option value="overall">Rank by Overall</option>
          <option value="potential">Rank by Potential</option>
          <option value="ppg">Rank by PPG</option>
          <option value="rpg">Rank by RPG</option>
          <option value="apg">Rank by APG</option>
        </select>
      </div>

      <div className="text-sm text-text-dim">
        {ranked.length} prospect{ranked.length !== 1 ? 's' : ''} in {draftClass === 'All' ? 'all classes' : `Draft Class ${draftClass}`}
      </div>

      {ranked.length === 0 ? (
        <div className="text-center py-16">
          <Trophy size={48} className="text-text-dim mx-auto mb-4 opacity-30" />
          <p className="text-text-dim">No prospects in this draft class yet.</p>
        </div>
      ) : (
        <div className="bg-court-light border border-court-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-court-border text-text-dim text-xs bg-court-lighter/50">
                <th className="py-3 px-3 text-left w-12">#</th>
                <th className="py-3 px-3 text-left">Player</th>
                <th className="py-3 px-3">Pos</th>
                <th className="py-3 px-3">Age</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Projection</th>
                <th className="py-3 px-3">OVR</th>
                <th className="py-3 px-3">POT</th>
                <th className="py-3 px-3">PPG</th>
                <th className="py-3 px-3">RPG</th>
                <th className="py-3 px-3">APG</th>
                <th className="py-3 px-3">GP</th>
                <th className="py-3 px-3 w-12">Trend</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((player, i) => {
                const rank = i + 1;
                const change = getRankChange(player.id, rank);
                const avg = playerAverages[player.id];

                return (
                  <tr key={player.id} className="border-b border-court-border/30 hover:bg-court-lighter/30 transition-colors">
                    <td className={`py-3 px-3 font-bold ${i < 3 ? medalColors[i] : 'text-text-dim'}`}>{rank}</td>
                    <td className="py-3 px-3">
                      <Link to={`/players/${player.id}`} className="hover:text-accent transition-colors">
                        <div className="font-medium text-text-bright">{player.firstName} {player.lastName}</div>
                        <div className="text-xs text-text-dim">{player.currentTeam}</div>
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-center">{player.position}</td>
                    <td className="py-3 px-3 text-center">{getAge(player.dateOfBirth)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={
                        player.league === 'NCAA' ? 'text-green-400' :
                        player.league === 'High School' ? 'text-cyan-400' :
                        player.league === 'AAU' ? 'text-purple-400' : ''
                      }>
                        {player.league}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-xs">{player.draftProjection}</td>
                    <td className="py-3 px-3 text-center font-bold text-accent">{player.overallRating}</td>
                    <td className="py-3 px-3 text-center text-gold">{player.potential}</td>
                    <td className="py-3 px-3 text-center">{avg?.ppg.toFixed(1) || '-'}</td>
                    <td className="py-3 px-3 text-center">{avg?.rpg.toFixed(1) || '-'}</td>
                    <td className="py-3 px-3 text-center">{avg?.apg.toFixed(1) || '-'}</td>
                    <td className="py-3 px-3 text-center text-text-dim">{avg?.games || 0}</td>
                    <td className="py-3 px-3 text-center">
                      {change === null ? (
                        <span className="text-text-dim text-xs">NEW</span>
                      ) : change > 0 ? (
                        <span className="flex items-center justify-center gap-0.5 text-success text-xs">
                          <TrendingUp size={12} /> +{change}
                        </span>
                      ) : change < 0 ? (
                        <span className="flex items-center justify-center gap-0.5 text-danger text-xs">
                          <TrendingDown size={12} /> {change}
                        </span>
                      ) : (
                        <Minus size={12} className="text-text-dim mx-auto" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-court-light border border-court-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-text-bright mb-2">Weekly Snapshot History</h3>
        <div className="space-y-1">
          {loadSnapshots()
            .filter(s => s.category === draftClass)
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 10)
            .map(s => (
              <div key={`${s.date}-${s.category}`} className="text-sm text-text-dim flex justify-between">
                <span>Week of {s.date}</span>
                <span>{s.rankings.length} prospects ranked</span>
              </div>
            ))}
          {loadSnapshots().filter(s => s.category === draftClass).length === 0 && (
            <p className="text-sm text-text-dim">No snapshots yet. Save your first weekly ranking!</p>
          )}
        </div>
      </div>
    </div>
  );
}
