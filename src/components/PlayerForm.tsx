import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Player, SkillRatings, League, Position, AgeGroup, DraftProjection } from '../types';
import { DEFAULT_SKILLS, SKILL_LABELS, calculateOverall } from '../types';
import { store } from '../store';

interface Props {
  player?: Player;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];
const leagues: League[] = ['NCAA', 'High School', 'AAU', 'NBA', 'Euroleague', 'Other'];
const ageGroups: AgeGroup[] = ['U16', 'U18', 'U20', 'U23', 'Pro'];
const draftProjections: DraftProjection[] = ['Lottery', 'First Round', 'Second Round', 'Undrafted', 'TBD'];

export function PlayerForm({ player, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    firstName: player?.firstName || '',
    lastName: player?.lastName || '',
    dateOfBirth: player?.dateOfBirth || '',
    ageGroup: player?.ageGroup || 'U18' as AgeGroup,
    position: player?.position || 'PG' as Position,
    secondaryPosition: player?.secondaryPosition || '' as Position | '',
    height: player?.height || 190,
    weight: player?.weight || 85,
    wingspan: player?.wingspan || 0,
    standingReach: player?.standingReach || 0,
    nationality: player?.nationality || '',
    currentTeam: player?.currentTeam || '',
    league: player?.league || 'NBA' as League,
    potential: player?.potential || 70,
    draftProjection: player?.draftProjection || 'TBD' as DraftProjection,
    draftYear: player?.draftYear || new Date().getFullYear() + 1,
  });

  const [skills, setSkills] = useState<SkillRatings>(player?.skills || { ...DEFAULT_SKILLS });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const p: Player = {
      id: player?.id || uuid(),
      ...form,
      secondaryPosition: form.secondaryPosition || undefined,
      wingspan: form.wingspan || undefined,
      standingReach: form.standingReach || undefined,
      skills,
      overallRating: calculateOverall(skills),
      createdAt: player?.createdAt || now,
      updatedAt: now,
    };
    if (player) {
      store.updatePlayer(p);
    } else {
      store.addPlayer(p);
    }
    onSave(p);
  };

  const updateSkill = (key: keyof SkillRatings, value: number) => {
    setSkills(prev => ({ ...prev, [key]: value }));
  };

  const inputClass = 'w-full bg-court-lighter border border-court-border rounded px-3 py-2 text-sm text-text focus:border-accent focus:outline-none';
  const labelClass = 'block text-xs font-medium text-text-dim mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name *</label>
          <input
            className={inputClass}
            value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input
            className={inputClass}
            value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Date of Birth *</label>
          <input
            type="date"
            className={inputClass}
            value={form.dateOfBirth}
            onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Age Group</label>
          <select
            className={inputClass}
            value={form.ageGroup}
            onChange={e => setForm(f => ({ ...f, ageGroup: e.target.value as AgeGroup }))}
          >
            {ageGroups.map(ag => <option key={ag} value={ag}>{ag}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Primary Position *</label>
          <select
            className={inputClass}
            value={form.position}
            onChange={e => setForm(f => ({ ...f, position: e.target.value as Position }))}
          >
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Secondary Position</label>
          <select
            className={inputClass}
            value={form.secondaryPosition}
            onChange={e => setForm(f => ({ ...f, secondaryPosition: e.target.value as Position | '' }))}
          >
            <option value="">None</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Height (cm) *</label>
          <input
            type="number"
            className={inputClass}
            value={form.height}
            onChange={e => setForm(f => ({ ...f, height: Number(e.target.value) }))}
            min={150}
            max={230}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Weight (kg) *</label>
          <input
            type="number"
            className={inputClass}
            value={form.weight}
            onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))}
            min={50}
            max={150}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Wingspan (cm)</label>
          <input
            type="number"
            className={inputClass}
            value={form.wingspan || ''}
            onChange={e => setForm(f => ({ ...f, wingspan: Number(e.target.value) }))}
            min={150}
            max={250}
          />
        </div>
        <div>
          <label className={labelClass}>Standing Reach (cm)</label>
          <input
            type="number"
            className={inputClass}
            value={form.standingReach || ''}
            onChange={e => setForm(f => ({ ...f, standingReach: Number(e.target.value) }))}
            min={180}
            max={310}
          />
        </div>
        <div>
          <label className={labelClass}>Nationality *</label>
          <input
            className={inputClass}
            value={form.nationality}
            onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Current Team *</label>
          <input
            className={inputClass}
            value={form.currentTeam}
            onChange={e => setForm(f => ({ ...f, currentTeam: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClass}>League</label>
          <select
            className={inputClass}
            value={form.league}
            onChange={e => setForm(f => ({ ...f, league: e.target.value as League }))}
          >
            {leagues.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Draft Projection</label>
          <select
            className={inputClass}
            value={form.draftProjection}
            onChange={e => setForm(f => ({ ...f, draftProjection: e.target.value as DraftProjection }))}
          >
            {draftProjections.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Draft Year</label>
          <input
            type="number"
            className={inputClass}
            value={form.draftYear}
            onChange={e => setForm(f => ({ ...f, draftYear: Number(e.target.value) }))}
            min={2024}
            max={2035}
          />
        </div>
        <div>
          <label className={labelClass}>Potential (1-100)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={100}
              value={form.potential}
              onChange={e => setForm(f => ({ ...f, potential: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-gold font-bold text-sm w-8">{form.potential}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-bright mb-4">Skill Ratings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.entries(skills) as [keyof SkillRatings, number][]).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-xs text-text-dim w-28 shrink-0">{SKILL_LABELS[key]}</label>
              <input
                type="range"
                min={1}
                max={10}
                value={value}
                onChange={e => updateSkill(key, Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono text-accent w-6 text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-text-dim">
          Overall: <span className="text-accent font-bold text-lg">{calculateOverall(skills)}</span>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded border border-court-border text-text-dim hover:text-text hover:border-text-dim transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm rounded bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
        >
          {player ? 'Update Player' : 'Add Player'}
        </button>
      </div>
    </form>
  );
}
