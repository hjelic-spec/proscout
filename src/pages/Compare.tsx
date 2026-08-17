import { useState, useMemo } from 'react';
import { store } from '../store';
import type { SkillRatings } from '../types';
import { getAge, SKILL_LABELS } from '../types';
import { SkillRadar } from '../components/SkillRadar';

export function Compare() {
  const players = store.getPlayers();
  const [playerAId, setPlayerAId] = useState('');
  const [playerBId, setPlayerBId] = useState('');

  const playerA = useMemo(() => players.find(p => p.id === playerAId), [players, playerAId]);
  const playerB = useMemo(() => players.find(p => p.id === playerBId), [players, playerBId]);

  const getAverages = (playerId: string) => {
    const logs = store.getGameLogs(playerId);
    if (logs.length === 0) return null;
    const n = logs.length;
    const sum = (key: keyof typeof logs[0]) => logs.reduce((a, g) => a + (g[key] as number), 0);
    return {
      games: n,
      ppg: (sum('points') / n).toFixed(1),
      rpg: (sum('rebounds') / n).toFixed(1),
      apg: (sum('assists') / n).toFixed(1),
      spg: (sum('steals') / n).toFixed(1),
      bpg: (sum('blocks') / n).toFixed(1),
      mpg: (sum('minutes') / n).toFixed(1),
      fgPct: sum('fgAttempted') > 0 ? ((sum('fgMade') / sum('fgAttempted')) * 100).toFixed(1) : '0.0',
      threePct: sum('threePtAttempted') > 0 ? ((sum('threePtMade') / sum('threePtAttempted')) * 100).toFixed(1) : '0.0',
    };
  };

  const avgA = playerA ? getAverages(playerA.id) : null;
  const avgB = playerB ? getAverages(playerB.id) : null;

  const selectClass = 'w-full bg-court-lighter border border-court-border rounded px-3 py-2 text-sm text-text focus:border-accent focus:outline-none';

  const compareRow = (label: string, valA: string | number, valB: string | number, higherIsBetter = true) => {
    const numA = typeof valA === 'number' ? valA : parseFloat(valA);
    const numB = typeof valB === 'number' ? valB : parseFloat(valB);
    const aWins = higherIsBetter ? numA > numB : numA < numB;
    const bWins = higherIsBetter ? numB > numA : numA > numB;
    return (
      <div className="grid grid-cols-3 py-2 border-b border-court-border/30 text-sm">
        <div className={`text-center ${aWins ? 'text-accent font-semibold' : 'text-text'}`}>{valA}</div>
        <div className="text-center text-text-dim text-xs">{label}</div>
        <div className={`text-center ${bWins ? 'text-accent font-semibold' : 'text-text'}`}>{valB}</div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-text-bright">Compare Players</h1>

      {players.length < 2 ? (
        <p className="text-text-dim">You need at least 2 players to compare.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <select className={selectClass} value={playerAId} onChange={e => setPlayerAId(e.target.value)}>
              <option value="">Select Player A</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.position})</option>
              ))}
            </select>
            <select className={selectClass} value={playerBId} onChange={e => setPlayerBId(e.target.value)}>
              <option value="">Select Player B</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.position})</option>
              ))}
            </select>
          </div>

          {playerA && playerB && (
            <div className="space-y-6">
              <div className="bg-court-light border border-court-border rounded-lg p-6">
                <div className="grid grid-cols-3 mb-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-court-lighter mx-auto mb-2 flex items-center justify-center text-xl font-bold text-accent">
                      {playerA.firstName[0]}{playerA.lastName[0]}
                    </div>
                    <div className="font-semibold text-text-bright">{playerA.firstName} {playerA.lastName}</div>
                    <div className="text-xs text-text-dim">{playerA.currentTeam}</div>
                  </div>
                  <div className="flex items-center justify-center text-text-dim text-sm font-medium">VS</div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-court-lighter mx-auto mb-2 flex items-center justify-center text-xl font-bold text-nba">
                      {playerB.firstName[0]}{playerB.lastName[0]}
                    </div>
                    <div className="font-semibold text-text-bright">{playerB.firstName} {playerB.lastName}</div>
                    <div className="text-xs text-text-dim">{playerB.currentTeam}</div>
                  </div>
                </div>

                {compareRow('Overall', playerA.overallRating, playerB.overallRating)}
                {compareRow('Potential', playerA.potential, playerB.potential)}
                {compareRow('Age', getAge(playerA.dateOfBirth), getAge(playerB.dateOfBirth), false)}
                {compareRow('Height', `${playerA.height}cm`, `${playerB.height}cm`)}
                {compareRow('Weight', `${playerA.weight}kg`, `${playerB.weight}kg`)}
                {compareRow('Position', playerA.position, playerB.position)}
                {compareRow('League', playerA.league, playerB.league)}
                {compareRow('Draft', playerA.draftProjection, playerB.draftProjection)}
              </div>

              <div className="bg-court-light border border-court-border rounded-lg p-6">
                <h3 className="text-sm font-semibold text-text-bright mb-4 text-center">Skill Comparison</h3>
                <div className="flex justify-center">
                  <SkillRadar skills={playerA.skills} compareSkills={playerB.skills} size={320} />
                </div>
                <div className="flex justify-center gap-6 mt-3 text-xs">
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-accent/50" /> {playerA.lastName}</div>
                  <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-nba/50" /> {playerB.lastName}</div>
                </div>

                <div className="mt-4 space-y-1">
                  {(Object.keys(playerA.skills) as (keyof SkillRatings)[]).map(key => (
                    <div key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                      <div className="flex items-center gap-2 justify-end">
                        <span className={playerA.skills[key] > playerB.skills[key] ? 'text-accent font-semibold' : ''}>{playerA.skills[key]}</span>
                        <div className="w-20 h-1.5 bg-court-lighter rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${playerA.skills[key] * 10}%`, marginLeft: 'auto' }} />
                        </div>
                      </div>
                      <span className="text-xs text-text-dim w-24 text-center">{SKILL_LABELS[key]}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-court-lighter rounded-full overflow-hidden">
                          <div className="h-full bg-nba rounded-full" style={{ width: `${playerB.skills[key] * 10}%` }} />
                        </div>
                        <span className={playerB.skills[key] > playerA.skills[key] ? 'text-nba font-semibold' : ''}>{playerB.skills[key]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(avgA || avgB) && (
                <div className="bg-court-light border border-court-border rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-text-bright mb-4 text-center">Statistical Comparison</h3>
                  {avgA && avgB && (
                    <>
                      {compareRow('PPG', avgA.ppg, avgB.ppg)}
                      {compareRow('RPG', avgA.rpg, avgB.rpg)}
                      {compareRow('APG', avgA.apg, avgB.apg)}
                      {compareRow('SPG', avgA.spg, avgB.spg)}
                      {compareRow('BPG', avgA.bpg, avgB.bpg)}
                      {compareRow('FG%', `${avgA.fgPct}%`, `${avgB.fgPct}%`)}
                      {compareRow('3P%', `${avgA.threePct}%`, `${avgB.threePct}%`)}
                      {compareRow('Games', avgA.games, avgB.games)}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
