import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { GameLog, League } from '../types';
import { store } from '../store';

interface Props {
  playerId: string;
  gameLog?: GameLog;
  onSave: () => void;
  onCancel: () => void;
}

const leagues: League[] = ['NCAA', 'High School', 'AAU', 'NBA', 'Euroleague', 'Other'];

export function GameLogForm({ playerId, gameLog, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Omit<GameLog, 'id' | 'playerId'>>({
    date: gameLog?.date || new Date().toISOString().split('T')[0],
    opponent: gameLog?.opponent || '',
    league: gameLog?.league || 'NBA',
    minutes: gameLog?.minutes || 0,
    points: gameLog?.points || 0,
    rebounds: gameLog?.rebounds || 0,
    offRebounds: gameLog?.offRebounds || 0,
    assists: gameLog?.assists || 0,
    steals: gameLog?.steals || 0,
    blocks: gameLog?.blocks || 0,
    turnovers: gameLog?.turnovers || 0,
    fouls: gameLog?.fouls || 0,
    fgMade: gameLog?.fgMade || 0,
    fgAttempted: gameLog?.fgAttempted || 0,
    threePtMade: gameLog?.threePtMade || 0,
    threePtAttempted: gameLog?.threePtAttempted || 0,
    ftMade: gameLog?.ftMade || 0,
    ftAttempted: gameLog?.ftAttempted || 0,
    plusMinus: gameLog?.plusMinus || 0,
    notes: gameLog?.notes || '',
  });

  const set = (key: string, value: string | number) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log: GameLog = { id: gameLog?.id || uuid(), playerId, ...form };
    if (gameLog) {
      store.updateGameLog(log);
    } else {
      store.addGameLog(log);
    }
    onSave();
  };

  const inputClass = 'w-full bg-court-lighter border border-court-border rounded px-3 py-2 text-sm text-text focus:border-accent focus:outline-none';
  const labelClass = 'block text-xs font-medium text-text-dim mb-1';

  const numField = (label: string, key: string, min = 0, max = 99) => (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="number"
        className={inputClass}
        value={(form as Record<string, unknown>)[key] as number}
        onChange={e => set(key, Number(e.target.value))}
        min={min}
        max={max}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Opponent</label>
          <input className={inputClass} value={form.opponent} onChange={e => set('opponent', e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>League</label>
          <select className={inputClass} value={form.league} onChange={e => set('league', e.target.value)}>
            {leagues.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {numField('MIN', 'minutes', 0, 60)}
        {numField('PTS', 'points')}
        {numField('REB', 'rebounds')}
        {numField('OREB', 'offRebounds')}
        {numField('AST', 'assists')}
        {numField('STL', 'steals')}
        {numField('BLK', 'blocks')}
        {numField('TO', 'turnovers')}
        {numField('PF', 'fouls', 0, 6)}
        {numField('+/-', 'plusMinus', -50, 50)}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {numField('FGM', 'fgMade')}
        {numField('FGA', 'fgAttempted')}
        {numField('3PM', 'threePtMade')}
        {numField('3PA', 'threePtAttempted')}
        {numField('FTM', 'ftMade')}
        {numField('FTA', 'ftAttempted')}
      </div>

      <div>
        <label className={labelClass}>Game Notes</label>
        <textarea
          className={`${inputClass} h-20 resize-none`}
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Observations from this game..."
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm rounded border border-court-border text-text-dim hover:text-text transition-colors">
          Cancel
        </button>
        <button type="submit" className="px-6 py-2 text-sm rounded bg-accent hover:bg-accent-hover text-white font-medium transition-colors">
          {gameLog ? 'Update' : 'Log Game'}
        </button>
      </div>
    </form>
  );
}
