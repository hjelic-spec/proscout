import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Edit3, Trash2, Plus, MessageSquare,
  TrendingUp, Calendar, AlertTriangle, Star, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { store } from '../store';
import type { SkillRatings, ScoutNoteType } from '../types';
import { getAge, formatHeight, formatWeight, SKILL_LABELS } from '../types';
import { SkillRadar } from '../components/SkillRadar';
import { PlayerForm } from '../components/PlayerForm';
import { GameLogForm } from '../components/GameLogForm';
import { v4 as uuid } from 'uuid';

const noteTypeConfig: Record<ScoutNoteType, { icon: typeof Star; color: string; label: string }> = {
  strength: { icon: ThumbsUp, color: 'text-success', label: 'Strength' },
  weakness: { icon: ThumbsDown, color: 'text-danger', label: 'Weakness' },
  general: { icon: MessageSquare, color: 'text-text-dim', label: 'General' },
  'red-flag': { icon: AlertTriangle, color: 'text-warning', label: 'Red Flag' },
};

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [addingGame, setAddingGame] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [noteType, setNoteType] = useState<ScoutNoteType>('general');
  const [noteContent, setNoteContent] = useState('');
  const [tab, setTab] = useState<'overview' | 'games' | 'notes'>('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const player = useMemo(() => store.getPlayer(id!), [id, refreshKey]);
  const gameLogs = useMemo(() => store.getGameLogs(id!).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [id, refreshKey]);
  const notes = useMemo(() => store.getNotes(id!).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [id, refreshKey]);

  if (!player) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-dim">Player not found.</p>
        <Link to="/players" className="text-accent text-sm">Back to players</Link>
      </div>
    );
  }

  const averages = useMemo(() => {
    if (gameLogs.length === 0) return null;
    const sum = (key: keyof typeof gameLogs[0]) => gameLogs.reduce((a, g) => a + (g[key] as number), 0);
    const n = gameLogs.length;
    return {
      ppg: (sum('points') / n).toFixed(1),
      rpg: (sum('rebounds') / n).toFixed(1),
      apg: (sum('assists') / n).toFixed(1),
      spg: (sum('steals') / n).toFixed(1),
      bpg: (sum('blocks') / n).toFixed(1),
      mpg: (sum('minutes') / n).toFixed(1),
      fgPct: sum('fgAttempted') > 0 ? ((sum('fgMade') / sum('fgAttempted')) * 100).toFixed(1) : '0.0',
      threePct: sum('threePtAttempted') > 0 ? ((sum('threePtMade') / sum('threePtAttempted')) * 100).toFixed(1) : '0.0',
      ftPct: sum('ftAttempted') > 0 ? ((sum('ftMade') / sum('ftAttempted')) * 100).toFixed(1) : '0.0',
    };
  }, [gameLogs]);

  const handleDelete = () => {
    if (confirm(`Delete ${player.firstName} ${player.lastName}?`)) {
      store.deletePlayer(player.id);
      navigate('/players');
    }
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    store.addNote({
      id: uuid(),
      playerId: player.id,
      date: new Date().toISOString(),
      content: noteContent.trim(),
      type: noteType,
    });
    setNoteContent('');
    setAddingNote(false);
    setRefreshKey(k => k + 1);
  };

  if (editing) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-text-bright mb-4">Edit Player</h1>
        <PlayerForm player={player} onSave={() => { setEditing(false); setRefreshKey(k => k + 1); }} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  const age = getAge(player.dateOfBirth);
  const leagueColor = player.league === 'NBA' ? 'text-nba' : player.league === 'Euroleague' ? 'text-euroleague' : 'text-text';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded hover:bg-court-lighter transition-colors">
          <ArrowLeft size={18} className="text-text-dim" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-bright">
            {player.firstName} {player.lastName}
          </h1>
          <p className="text-sm text-text-dim">{player.currentTeam} · <span className={leagueColor}>{player.league}</span></p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-court-border rounded text-text-dim hover:text-accent hover:border-accent/40 transition-colors">
            <Edit3 size={14} /> Edit
          </button>
          <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-court-border rounded text-text-dim hover:text-danger hover:border-danger/40 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-court-light border border-court-border rounded-lg p-4 text-center">
            <div className="w-20 h-20 rounded-full bg-court-lighter mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-accent">
              {player.firstName[0]}{player.lastName[0]}
            </div>
            <div className="text-3xl font-bold text-accent">{player.overallRating}</div>
            <div className="text-xs text-text-dim mb-3">Overall Rating</div>
            <div className="flex justify-center gap-4 text-sm">
              <div>
                <div className="text-gold font-bold">{player.potential}</div>
                <div className="text-xs text-text-dim">Potential</div>
              </div>
              <div>
                <div className="text-text-bright font-bold">{age}</div>
                <div className="text-xs text-text-dim">Age</div>
              </div>
              <div>
                <div className="text-text-bright font-bold">{player.position}</div>
                <div className="text-xs text-text-dim">Position</div>
              </div>
            </div>
          </div>

          <div className="bg-court-light border border-court-border rounded-lg p-4">
            <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-3">Physical</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-dim">Height</span><span>{formatHeight(player.height)}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Weight</span><span>{formatWeight(player.weight)}</span></div>
              {player.wingspan && <div className="flex justify-between"><span className="text-text-dim">Wingspan</span><span>{player.wingspan}cm</span></div>}
              {player.standingReach && <div className="flex justify-between"><span className="text-text-dim">Reach</span><span>{player.standingReach}cm</span></div>}
              <div className="flex justify-between"><span className="text-text-dim">DOB</span><span>{player.dateOfBirth}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Nationality</span><span>{player.nationality}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Draft</span><span>{player.draftProjection} {player.draftYear ? `(${player.draftYear})` : ''}</span></div>
              <div className="flex justify-between"><span className="text-text-dim">Age Group</span><span>{player.ageGroup}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 border-b border-court-border">
            {(['overview', 'games', 'notes'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t ? 'border-accent text-accent' : 'border-transparent text-text-dim hover:text-text'
                }`}
              >
                {t === 'overview' ? 'Overview' : t === 'games' ? `Games (${gameLogs.length})` : `Notes (${notes.length})`}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-court-light border border-court-border rounded-lg p-4">
                <h3 className="text-sm font-semibold text-text-bright mb-3">Skill Profile</h3>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <SkillRadar skills={player.skills} size={280} />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {(Object.entries(player.skills) as [keyof SkillRatings, number][]).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className="w-20 text-xs text-text-dim">{SKILL_LABELS[key]}</div>
                        <div className="flex-1 h-2 bg-court-lighter rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${val * 10}%`,
                              background: val >= 8 ? '#38a169' : val >= 6 ? '#e94560' : val >= 4 ? '#ecc94b' : '#e53e3e',
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono w-4 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {averages && (
                <div className="bg-court-light border border-court-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-text-bright mb-3">Season Averages ({gameLogs.length} games)</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {[
                      { label: 'PPG', value: averages.ppg },
                      { label: 'RPG', value: averages.rpg },
                      { label: 'APG', value: averages.apg },
                      { label: 'SPG', value: averages.spg },
                      { label: 'BPG', value: averages.bpg },
                      { label: 'MPG', value: averages.mpg },
                      { label: 'FG%', value: `${averages.fgPct}%` },
                      { label: '3P%', value: `${averages.threePct}%` },
                      { label: 'FT%', value: `${averages.ftPct}%` },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center">
                        <div className="text-lg font-bold text-accent">{value}</div>
                        <div className="text-xs text-text-dim">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'games' && (
            <div className="space-y-4">
              {addingGame ? (
                <div className="bg-court-light border border-court-border rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-text-bright mb-3">Log New Game</h3>
                  <GameLogForm playerId={player.id} onSave={() => { setAddingGame(false); setRefreshKey(k => k + 1); }} onCancel={() => setAddingGame(false)} />
                </div>
              ) : (
                <button onClick={() => setAddingGame(true)} className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-sm font-medium transition-colors">
                  <Plus size={16} /> Log Game
                </button>
              )}

              {gameLogs.length === 0 ? (
                <p className="text-sm text-text-dim py-4">No games logged yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-court-border text-text-dim text-xs">
                        <th className="text-left py-2 px-2">Date</th>
                        <th className="text-left py-2 px-2">vs</th>
                        <th className="py-2 px-1">MIN</th>
                        <th className="py-2 px-1">PTS</th>
                        <th className="py-2 px-1">REB</th>
                        <th className="py-2 px-1">AST</th>
                        <th className="py-2 px-1">STL</th>
                        <th className="py-2 px-1">BLK</th>
                        <th className="py-2 px-1">TO</th>
                        <th className="py-2 px-1">FG</th>
                        <th className="py-2 px-1">3PT</th>
                        <th className="py-2 px-1">+/-</th>
                        <th className="py-2 px-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameLogs.map(g => (
                        <tr key={g.id} className="border-b border-court-border/50 hover:bg-court-lighter/30">
                          <td className="py-2 px-2 text-text-dim">{g.date}</td>
                          <td className="py-2 px-2">{g.opponent}</td>
                          <td className="py-2 px-1 text-center">{g.minutes}</td>
                          <td className="py-2 px-1 text-center font-medium text-accent">{g.points}</td>
                          <td className="py-2 px-1 text-center">{g.rebounds}</td>
                          <td className="py-2 px-1 text-center">{g.assists}</td>
                          <td className="py-2 px-1 text-center">{g.steals}</td>
                          <td className="py-2 px-1 text-center">{g.blocks}</td>
                          <td className="py-2 px-1 text-center">{g.turnovers}</td>
                          <td className="py-2 px-1 text-center text-text-dim">{g.fgMade}/{g.fgAttempted}</td>
                          <td className="py-2 px-1 text-center text-text-dim">{g.threePtMade}/{g.threePtAttempted}</td>
                          <td className={`py-2 px-1 text-center ${g.plusMinus >= 0 ? 'text-success' : 'text-danger'}`}>
                            {g.plusMinus > 0 ? '+' : ''}{g.plusMinus}
                          </td>
                          <td className="py-2 px-1">
                            <button onClick={() => { store.deleteGameLog(g.id); setRefreshKey(k => k + 1); }} className="text-text-dim hover:text-danger">
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-4">
              {addingNote ? (
                <div className="bg-court-light border border-court-border rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    {(Object.entries(noteTypeConfig) as [ScoutNoteType, typeof noteTypeConfig[ScoutNoteType]][]).map(([type, cfg]) => (
                      <button
                        key={type}
                        onClick={() => setNoteType(type)}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                          noteType === type ? `${cfg.color} bg-court-lighter` : 'text-text-dim hover:text-text'
                        }`}
                      >
                        <cfg.icon size={12} /> {cfg.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="w-full bg-court-lighter border border-court-border rounded px-3 py-2 text-sm text-text focus:border-accent focus:outline-none h-24 resize-none"
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    placeholder="Your scouting observation..."
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setAddingNote(false)} className="px-3 py-1.5 text-sm text-text-dim hover:text-text">Cancel</button>
                    <button onClick={handleAddNote} className="px-4 py-1.5 text-sm bg-accent hover:bg-accent-hover text-white rounded font-medium">Save Note</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingNote(true)} className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded text-sm font-medium transition-colors">
                  <Plus size={16} /> Add Note
                </button>
              )}

              {notes.length === 0 ? (
                <p className="text-sm text-text-dim py-4">No scout notes yet.</p>
              ) : (
                <div className="space-y-2">
                  {notes.map(note => {
                    const cfg = noteTypeConfig[note.type];
                    return (
                      <div key={note.id} className="bg-court-light border border-court-border rounded-lg p-3 flex gap-3">
                        <cfg.icon size={16} className={`${cfg.color} shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                            <span className="text-xs text-text-dim">{new Date(note.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                        <button onClick={() => { store.deleteNote(note.id); setRefreshKey(k => k + 1); }} className="text-text-dim hover:text-danger shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
