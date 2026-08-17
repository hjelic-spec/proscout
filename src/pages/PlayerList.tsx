import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, Download, Upload } from 'lucide-react';
import { store } from '../store';
import type { Player, Position, League, AgeGroup } from '../types';
import { PlayerCard } from '../components/PlayerCard';

export function PlayerList() {
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<Position | ''>('');
  const [leagueFilter, setLeagueFilter] = useState<League | ''>('');
  const [ageFilter, setAgeFilter] = useState<AgeGroup | ''>('');
  const [sortBy, setSortBy] = useState<'rating' | 'potential' | 'name' | 'age'>('rating');
  const [refreshKey, setRefreshKey] = useState(0);

  const players = useMemo(() => {
    let list = store.getPlayers();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.currentTeam.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q)
      );
    }
    if (posFilter) list = list.filter(p => p.position === posFilter || p.secondaryPosition === posFilter);
    if (leagueFilter) list = list.filter(p => p.league === leagueFilter);
    if (ageFilter) list = list.filter(p => p.ageGroup === ageFilter);

    list.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.overallRating - a.overallRating;
        case 'potential': return b.potential - a.potential;
        case 'name': return a.lastName.localeCompare(b.lastName);
        case 'age': return new Date(b.dateOfBirth).getTime() - new Date(a.dateOfBirth).getTime();
        default: return 0;
      }
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, posFilter, leagueFilter, ageFilter, sortBy, refreshKey]);

  const handleExport = () => {
    const data = store.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proscout-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.players && data.gameLogs && data.notes) {
        store.importAll(data);
        setRefreshKey(k => k + 1);
      }
    };
    input.click();
  };

  const selectClass = 'bg-court-lighter border border-court-border rounded px-3 py-2 text-sm text-text focus:border-accent focus:outline-none';

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-bright">Players</h1>
        <div className="flex gap-2">
          <button onClick={handleImport} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-court-border rounded text-text-dim hover:text-text transition-colors">
            <Upload size={14} /> Import
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-court-border rounded text-text-dim hover:text-text transition-colors">
            <Download size={14} /> Export
          </button>
          <Link
            to="/players/new"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add Player
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-court-light border border-court-border rounded-lg p-3">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search size={16} className="text-text-dim" />
          <input
            type="text"
            placeholder="Search players, teams, nationality..."
            className="flex-1 bg-transparent text-sm text-text focus:outline-none placeholder:text-text-dim/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <SlidersHorizontal size={16} className="text-text-dim" />
        <select className={selectClass} value={posFilter} onChange={e => setPosFilter(e.target.value as Position | '')}>
          <option value="">All Positions</option>
          {(['PG', 'SG', 'SF', 'PF', 'C'] as Position[]).map(p => <option key={p}>{p}</option>)}
        </select>
        <select className={selectClass} value={leagueFilter} onChange={e => setLeagueFilter(e.target.value as League | '')}>
          <option value="">All Leagues</option>
          {(['NCAA', 'High School', 'AAU', 'Euroleague', 'NBA', 'Other'] as League[]).map(l => <option key={l}>{l}</option>)}
        </select>
        <select className={selectClass} value={ageFilter} onChange={e => setAgeFilter(e.target.value as AgeGroup | '')}>
          <option value="">All Ages</option>
          {(['U16', 'U18', 'U20', 'U23', 'Pro'] as AgeGroup[]).map(a => <option key={a}>{a}</option>)}
        </select>
        <select className={selectClass} value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
          <option value="rating">Sort: Rating</option>
          <option value="potential">Sort: Potential</option>
          <option value="name">Sort: Name</option>
          <option value="age">Sort: Age</option>
        </select>
      </div>

      <div className="text-sm text-text-dim">{players.length} player{players.length !== 1 ? 's' : ''}</div>

      {players.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🏀</div>
          <p className="text-text-dim">No players found. Start scouting!</p>
          <Link to="/players/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-sm font-medium transition-colors">
            <Plus size={16} /> Add First Player
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map(p => <PlayerCard key={p.id} player={p} />)}
        </div>
      )}
    </div>
  );
}
