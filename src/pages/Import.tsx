import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Download, AlertTriangle, CheckCircle, X, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import type { Player, GameLog, ScoutNote, SkillRatings, League, Position, AgeGroup, DraftProjection } from '../types';
import { calculateOverall, DEFAULT_SKILLS } from '../types';
import { store } from '../store';

type ImportMode = 'players' | 'gamelogs' | 'notes';
type FileType = 'csv' | 'json';

interface ParsedPlayer {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  position: Position;
  secondaryPosition?: Position;
  height: number;
  weight: number;
  wingspan?: number;
  nationality: string;
  currentTeam: string;
  league: League;
  ageGroup: AgeGroup;
  potential: number;
  draftProjection: DraftProjection;
  draftYear?: number;
  skills: Partial<SkillRatings>;
}

interface ParsedGameLog {
  playerName: string;
  date: string;
  opponent: string;
  league: League;
  minutes: number;
  points: number;
  rebounds: number;
  offRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgMade: number;
  fgAttempted: number;
  threePtMade: number;
  threePtAttempted: number;
  ftMade: number;
  ftAttempted: number;
  plusMinus: number;
  notes: string;
}

interface ParsedNote {
  playerName: string;
  date: string;
  content: string;
  type: ScoutNote['type'];
}

const VALID_POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];
const VALID_LEAGUES: League[] = ['NCAA', 'High School', 'AAU', 'NBA', 'Euroleague', 'Other'];
const VALID_AGE_GROUPS: AgeGroup[] = ['U16', 'U18', 'U20', 'U23', 'Pro'];
const VALID_PROJECTIONS: DraftProjection[] = ['Lottery', 'First Round', 'Second Round', 'Undrafted', 'TBD'];
const VALID_NOTE_TYPES: ScoutNote['type'][] = ['strength', 'weakness', 'general', 'red-flag'];

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"' && !inQuotes) { inQuotes = true; continue; }
      if (char === '"' && inQuotes) { inQuotes = false; continue; }
      if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
      current += char;
    }
    values.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findField(row: Record<string, string>, ...candidates: string[]): string {
  for (const c of candidates) {
    const norm = normalizeKey(c);
    for (const [k, v] of Object.entries(row)) {
      if (normalizeKey(k) === norm) return v;
    }
  }
  return '';
}

function parseNum(val: string, fallback = 0): number {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

function matchPosition(val: string): Position {
  const v = val.toUpperCase().trim();
  if (VALID_POSITIONS.includes(v as Position)) return v as Position;
  const map: Record<string, Position> = {
    'POINT GUARD': 'PG', 'SHOOTING GUARD': 'SG', 'SMALL FORWARD': 'SF',
    'POWER FORWARD': 'PF', 'CENTER': 'C', 'GUARD': 'SG', 'FORWARD': 'SF',
    'G': 'PG', 'F': 'SF',
  };
  return map[v] || 'SF';
}

function matchLeague(val: string): League {
  const v = val.trim();
  if (VALID_LEAGUES.includes(v as League)) return v as League;
  const lower = v.toLowerCase();
  if (lower.includes('ncaa') || lower.includes('college') || lower.includes('division')) return 'NCAA';
  if (lower.includes('high school') || lower.includes('hs') || lower.includes('prep')) return 'High School';
  if (lower.includes('aau') || lower.includes('amateu')) return 'AAU';
  if (lower.includes('nba')) return 'NBA';
  if (lower.includes('euro') || lower.includes('fiba') || lower.includes('international')) return 'Euroleague';
  return 'Other';
}

function matchAgeGroup(val: string): AgeGroup {
  const v = val.trim().toUpperCase();
  if (VALID_AGE_GROUPS.includes(v as AgeGroup)) return v as AgeGroup;
  return 'U18';
}

function matchProjection(val: string): DraftProjection {
  const v = val.trim();
  if (VALID_PROJECTIONS.includes(v as DraftProjection)) return v as DraftProjection;
  const lower = v.toLowerCase();
  if (lower.includes('lottery') || lower.includes('top')) return 'Lottery';
  if (lower.includes('first') || lower.includes('1st')) return 'First Round';
  if (lower.includes('second') || lower.includes('2nd')) return 'Second Round';
  if (lower.includes('undraft')) return 'Undrafted';
  return 'TBD';
}

function matchNoteType(val: string): ScoutNote['type'] {
  const v = val.trim().toLowerCase();
  if (VALID_NOTE_TYPES.includes(v as ScoutNote['type'])) return v as ScoutNote['type'];
  if (v.includes('strength') || v.includes('pro') || v.includes('positive')) return 'strength';
  if (v.includes('weak') || v.includes('con') || v.includes('negative')) return 'weakness';
  if (v.includes('red') || v.includes('flag') || v.includes('concern')) return 'red-flag';
  return 'general';
}

function parsePlayersFromRows(rows: Record<string, string>[]): ParsedPlayer[] {
  return rows.map(row => {
    const firstName = findField(row, 'firstName', 'first_name', 'first', 'fname');
    const lastName = findField(row, 'lastName', 'last_name', 'last', 'lname', 'surname');
    let name = findField(row, 'name', 'player', 'playerName', 'player_name', 'fullName', 'full_name');
    let fn = firstName, ln = lastName;
    if (!fn && !ln && name) {
      const parts = name.split(/\s+/);
      fn = parts[0] || '';
      ln = parts.slice(1).join(' ') || '';
    }

    return {
      firstName: fn,
      lastName: ln,
      dateOfBirth: findField(row, 'dateOfBirth', 'dob', 'date_of_birth', 'birthdate', 'birth_date', 'birthday') || '2008-01-01',
      position: matchPosition(findField(row, 'position', 'pos', 'primary_position')),
      secondaryPosition: findField(row, 'secondaryPosition', 'secondary_position', 'pos2', 'altPosition') ? matchPosition(findField(row, 'secondaryPosition', 'secondary_position', 'pos2', 'altPosition')) : undefined,
      height: parseNum(findField(row, 'height', 'ht', 'height_cm'), 190),
      weight: parseNum(findField(row, 'weight', 'wt', 'weight_kg'), 85),
      wingspan: parseNum(findField(row, 'wingspan', 'ws', 'wingspan_cm')) || undefined,
      nationality: findField(row, 'nationality', 'nation', 'country', 'nat') || 'USA',
      currentTeam: findField(row, 'currentTeam', 'team', 'current_team', 'school', 'club') || 'Unknown',
      league: matchLeague(findField(row, 'league', 'lg', 'level', 'conference')),
      ageGroup: matchAgeGroup(findField(row, 'ageGroup', 'age_group', 'ag', 'class')),
      potential: parseNum(findField(row, 'potential', 'pot', 'ceiling'), 75),
      draftProjection: matchProjection(findField(row, 'draftProjection', 'draft_projection', 'projection', 'draft_proj')),
      draftYear: parseNum(findField(row, 'draftYear', 'draft_year', 'draft', 'class_year')) || undefined,
      skills: {
        shooting: parseNum(findField(row, 'shooting', 'mid_range', 'midrange')) || undefined,
        threePoint: parseNum(findField(row, 'threePoint', 'three_point', '3pt', 'three')) || undefined,
        finishing: parseNum(findField(row, 'finishing', 'finish', 'at_rim')) || undefined,
        ballHandling: parseNum(findField(row, 'ballHandling', 'ball_handling', 'handle', 'dribbling')) || undefined,
        passing: parseNum(findField(row, 'passing', 'pass', 'vision')) || undefined,
        perimeterDefense: parseNum(findField(row, 'perimeterDefense', 'perimeter_defense', 'perim_d', 'perimeter_d')) || undefined,
        interiorDefense: parseNum(findField(row, 'interiorDefense', 'interior_defense', 'int_d', 'interior_d')) || undefined,
        rebounding: parseNum(findField(row, 'rebounding', 'rebound', 'reb_skill')) || undefined,
        athleticism: parseNum(findField(row, 'athleticism', 'athletic', 'ath')) || undefined,
        basketballIQ: parseNum(findField(row, 'basketballIQ', 'basketball_iq', 'iq', 'bbiq')) || undefined,
        leadership: parseNum(findField(row, 'leadership', 'leader', 'lead')) || undefined,
        workEthic: parseNum(findField(row, 'workEthic', 'work_ethic', 'motor', 'effort')) || undefined,
      },
    };
  }).filter(p => p.firstName || p.lastName);
}

function parseGameLogsFromRows(rows: Record<string, string>[]): ParsedGameLog[] {
  return rows.map(row => ({
    playerName: findField(row, 'player', 'playerName', 'player_name', 'name'),
    date: findField(row, 'date', 'game_date', 'gameDate') || new Date().toISOString().split('T')[0],
    opponent: findField(row, 'opponent', 'opp', 'vs', 'against') || 'Unknown',
    league: matchLeague(findField(row, 'league', 'lg', 'level')),
    minutes: parseNum(findField(row, 'minutes', 'min', 'mins', 'mp')),
    points: parseNum(findField(row, 'points', 'pts', 'score')),
    rebounds: parseNum(findField(row, 'rebounds', 'reb', 'trb', 'total_rebounds')),
    offRebounds: parseNum(findField(row, 'offRebounds', 'off_rebounds', 'oreb', 'orb')),
    assists: parseNum(findField(row, 'assists', 'ast', 'asst')),
    steals: parseNum(findField(row, 'steals', 'stl', 'steal')),
    blocks: parseNum(findField(row, 'blocks', 'blk', 'block')),
    turnovers: parseNum(findField(row, 'turnovers', 'to', 'tov', 'turnover')),
    fouls: parseNum(findField(row, 'fouls', 'pf', 'foul', 'personal_fouls')),
    fgMade: parseNum(findField(row, 'fgMade', 'fg_made', 'fgm', 'fg')),
    fgAttempted: parseNum(findField(row, 'fgAttempted', 'fg_attempted', 'fga')),
    threePtMade: parseNum(findField(row, 'threePtMade', '3pt_made', 'tpm', '3pm', 'threes_made')),
    threePtAttempted: parseNum(findField(row, 'threePtAttempted', '3pt_attempted', 'tpa', '3pa', 'threes_attempted')),
    ftMade: parseNum(findField(row, 'ftMade', 'ft_made', 'ftm', 'ft')),
    ftAttempted: parseNum(findField(row, 'ftAttempted', 'ft_attempted', 'fta')),
    plusMinus: parseNum(findField(row, 'plusMinus', 'plus_minus', 'pm', '+/-')),
    notes: findField(row, 'notes', 'note', 'comment', 'comments'),
  })).filter(g => g.playerName);
}

function parseNotesFromRows(rows: Record<string, string>[]): ParsedNote[] {
  return rows.map(row => ({
    playerName: findField(row, 'player', 'playerName', 'player_name', 'name'),
    date: findField(row, 'date', 'note_date', 'noteDate') || new Date().toISOString().split('T')[0],
    content: findField(row, 'content', 'note', 'text', 'comment', 'observation'),
    type: matchNoteType(findField(row, 'type', 'note_type', 'noteType', 'category')),
  })).filter(n => n.playerName && n.content);
}

function convertToPlayers(parsed: ParsedPlayer[]): Player[] {
  const now = new Date().toISOString();
  return parsed.map(p => {
    const skills: SkillRatings = { ...DEFAULT_SKILLS };
    for (const [k, v] of Object.entries(p.skills)) {
      if (v !== undefined) (skills as Record<string, number>)[k] = Math.min(10, Math.max(1, v));
    }
    return {
      id: uuid(),
      firstName: p.firstName,
      lastName: p.lastName,
      dateOfBirth: p.dateOfBirth,
      position: p.position,
      secondaryPosition: p.secondaryPosition,
      ageGroup: p.ageGroup,
      height: p.height,
      weight: p.weight,
      wingspan: p.wingspan,
      nationality: p.nationality,
      currentTeam: p.currentTeam,
      league: p.league,
      skills,
      overallRating: calculateOverall(skills),
      potential: Math.min(100, Math.max(1, p.potential)),
      draftProjection: p.draftProjection,
      draftYear: p.draftYear,
      createdAt: now,
      updatedAt: now,
    };
  });
}

function resolvePlayerIds(names: string[]): Map<string, string> {
  const players = store.getPlayers();
  const map = new Map<string, string>();
  for (const name of names) {
    const lower = name.toLowerCase().trim();
    const match = players.find(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase() === lower ||
      `${p.lastName}, ${p.firstName}`.toLowerCase() === lower ||
      p.lastName.toLowerCase() === lower
    );
    if (match) map.set(name, match.id);
  }
  return map;
}

function convertToGameLogs(parsed: ParsedGameLog[]): { logs: GameLog[]; unmatched: string[] } {
  const names = [...new Set(parsed.map(g => g.playerName))];
  const idMap = resolvePlayerIds(names);
  const unmatched = names.filter(n => !idMap.has(n));
  const logs = parsed
    .filter(g => idMap.has(g.playerName))
    .map(g => ({
      id: uuid(),
      playerId: idMap.get(g.playerName)!,
      date: g.date,
      opponent: g.opponent,
      league: g.league,
      minutes: g.minutes,
      points: g.points,
      rebounds: g.rebounds,
      offRebounds: g.offRebounds,
      assists: g.assists,
      steals: g.steals,
      blocks: g.blocks,
      turnovers: g.turnovers,
      fouls: g.fouls,
      fgMade: g.fgMade,
      fgAttempted: g.fgAttempted,
      threePtMade: g.threePtMade,
      threePtAttempted: g.threePtAttempted,
      ftMade: g.ftMade,
      ftAttempted: g.ftAttempted,
      plusMinus: g.plusMinus,
      notes: g.notes,
    }));
  return { logs, unmatched };
}

function convertToNotes(parsed: ParsedNote[]): { notes: ScoutNote[]; unmatched: string[] } {
  const names = [...new Set(parsed.map(n => n.playerName))];
  const idMap = resolvePlayerIds(names);
  const unmatched = names.filter(n => !idMap.has(n));
  const notes = parsed
    .filter(n => idMap.has(n.playerName))
    .map(n => ({
      id: uuid(),
      playerId: idMap.get(n.playerName)!,
      date: n.date,
      content: n.content,
      type: n.type,
    }));
  return { notes, unmatched };
}

const PLAYER_TEMPLATE = `firstName,lastName,dateOfBirth,position,height,weight,nationality,currentTeam,league,ageGroup,potential,draftProjection,draftYear,shooting,threePoint,finishing,ballHandling,passing,perimeterDefense,interiorDefense,rebounding,athleticism,basketballIQ,leadership,workEthic
John,Smith,2008-03-15,SG,193,83,USA,Oak Hill Academy,High School,U18,85,Lottery,2028,7,7,6,8,6,6,4,4,8,7,6,7
Jane,Doe,2009-01-20,PF,201,92,USA,Duke,NCAA,U18,80,First Round,2029,6,5,7,5,5,6,7,7,8,7,6,7`;

const GAMELOG_TEMPLATE = `player,date,opponent,league,minutes,points,rebounds,offRebounds,assists,steals,blocks,turnovers,fouls,fgMade,fgAttempted,threePtMade,threePtAttempted,ftMade,ftAttempted,plusMinus,notes
Alijah Arenas,2027-01-15,Mater Dei,High School,32,28,5,1,4,2,0,3,2,10,18,4,8,4,5,12,Great shooting night`;

const NOTE_TEMPLATE = `player,date,content,type
Alijah Arenas,2027-01-15,Excellent court vision and decision making under pressure,strength
Koa Peat,2027-01-16,Needs to improve three-point consistency,weakness`;

const TEMPLATES: Record<ImportMode, string> = {
  players: PLAYER_TEMPLATE,
  gamelogs: GAMELOG_TEMPLATE,
  notes: NOTE_TEMPLATE,
};

export function Import() {
  const [mode, setMode] = useState<ImportMode>('players');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[] | null>(null);
  const [importResult, setImportResult] = useState<{ count: number; unmatched?: string[] } | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setPreview(null);
    setError(null);
    setImportResult(null);
    if (fileRef.current) fileRef.current.value = '';
  }, []);

  function detectFileType(name: string): FileType {
    return name.endsWith('.json') ? 'json' : 'csv';
  }

  function processFile(file: File) {
    reset();
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const type = detectFileType(file.name);
        let rows: Record<string, string>[];

        if (type === 'json') {
          const parsed = JSON.parse(text);
          const arr = Array.isArray(parsed) ? parsed : parsed.players || parsed.gameLogs || parsed.notes || parsed.data || [];
          rows = arr.map((item: Record<string, unknown>) => {
            const row: Record<string, string> = {};
            for (const [k, v] of Object.entries(item)) {
              row[k] = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '');
            }
            return row;
          });
        } else {
          rows = parseCSV(text);
        }

        if (rows.length === 0) {
          setError('File is empty or has no data rows.');
          return;
        }

        setPreview(rows);
      } catch (err) {
        setError(`Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleImport() {
    if (!preview) return;

    if (mode === 'players') {
      const parsed = parsePlayersFromRows(preview);
      const players = convertToPlayers(parsed);
      const existing = store.getPlayers();
      store.savePlayers([...existing, ...players]);
      setImportResult({ count: players.length });
    } else if (mode === 'gamelogs') {
      const parsed = parseGameLogsFromRows(preview);
      const { logs, unmatched } = convertToGameLogs(parsed);
      const existing = store.getGameLogs();
      store.importAll({
        players: store.getPlayers(),
        gameLogs: [...existing, ...logs],
        notes: store.getNotes(),
      });
      setImportResult({ count: logs.length, unmatched: unmatched.length > 0 ? unmatched : undefined });
    } else {
      const parsed = parseNotesFromRows(preview);
      const { notes, unmatched } = convertToNotes(parsed);
      const existing = store.getNotes();
      store.importAll({
        players: store.getPlayers(),
        gameLogs: store.getGameLogs(),
        notes: [...existing, ...notes],
      });
      setImportResult({ count: notes.length, unmatched: unmatched.length > 0 ? unmatched : undefined });
    }

    setPreview(null);
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATES[mode]], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proscout_${mode}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const modes: { key: ImportMode; label: string }[] = [
    { key: 'players', label: 'Players' },
    { key: 'gamelogs', label: 'Game Logs' },
    { key: 'notes', label: 'Scout Notes' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text-bright flex items-center gap-2">
          <Upload size={24} className="text-accent" />
          Import Data
        </h1>
        <p className="text-sm text-text-dim mt-1">
          Import players, game logs, or scout notes from CSV or JSON files.
        </p>
      </div>

      <div className="flex gap-2">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setMode(key); reset(); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === key
                ? 'bg-accent text-white'
                : 'bg-court-light text-text-dim hover:text-text border border-court-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-court-light border border-court-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-text-bright">Template</h3>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            <Download size={14} /> Download CSV Template
          </button>
        </div>
        <p className="text-xs text-text-dim">
          {mode === 'players' && 'Columns: firstName, lastName, dateOfBirth, position, height (cm), weight (kg), nationality, currentTeam, league, ageGroup, potential, draftProjection, draftYear, and 12 skill ratings (1-10).'}
          {mode === 'gamelogs' && 'Columns: player (full name), date, opponent, league, minutes, points, rebounds, offRebounds, assists, steals, blocks, turnovers, fouls, fgMade, fgAttempted, threePtMade, threePtAttempted, ftMade, ftAttempted, plusMinus, notes. Player must already exist in ProScout.'}
          {mode === 'notes' && 'Columns: player (full name), date, content, type (strength/weakness/general/red-flag). Player must already exist in ProScout.'}
        </p>
      </div>

      {!preview && !importResult && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-accent bg-accent/10'
              : 'border-court-border hover:border-accent/50 hover:bg-court-lighter/30'
          }`}
        >
          <FileText size={40} className="mx-auto text-text-dim/50 mb-3" />
          <p className="text-sm text-text-bright font-medium">
            Drop your CSV or JSON file here
          </p>
          <p className="text-xs text-text-dim mt-1">or click to browse</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-text-bright">{error}</p>
          </div>
          <button onClick={reset} className="text-text-dim hover:text-text">
            <X size={16} />
          </button>
        </div>
      )}

      {preview && (
        <div className="bg-court-light border border-court-border rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-court-border">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-accent" />
              <h3 className="text-sm font-semibold text-text-bright">
                Preview — {preview.length} {preview.length === 1 ? 'row' : 'rows'} found
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-text-dim hover:text-text"
              >
                {showPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button onClick={reset} className="text-text-dim hover:text-text">
                <X size={16} />
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-court-lighter/50">
                    {Object.keys(preview[0]).slice(0, 8).map(key => (
                      <th key={key} className="px-3 py-2 text-left text-text-dim font-medium whitespace-nowrap">
                        {key}
                      </th>
                    ))}
                    {Object.keys(preview[0]).length > 8 && (
                      <th className="px-3 py-2 text-left text-text-dim font-medium">
                        +{Object.keys(preview[0]).length - 8} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-t border-court-border/50">
                      {Object.values(row).slice(0, 8).map((val, j) => (
                        <td key={j} className="px-3 py-1.5 text-text whitespace-nowrap max-w-32 truncate">
                          {val || <span className="text-text-dim/40">—</span>}
                        </td>
                      ))}
                      {Object.keys(row).length > 8 && (
                        <td className="px-3 py-1.5 text-text-dim/40">…</td>
                      )}
                    </tr>
                  ))}
                  {preview.length > 10 && (
                    <tr className="border-t border-court-border/50">
                      <td colSpan={9} className="px-3 py-1.5 text-text-dim text-center">
                        … and {preview.length - 10} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-court-border flex items-center justify-between">
            <p className="text-xs text-text-dim">
              {mode === 'players' && `Will import ${preview.length} players`}
              {mode === 'gamelogs' && `Will import game logs (players must already exist)`}
              {mode === 'notes' && `Will import scout notes (players must already exist)`}
            </p>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Upload size={16} /> Import {mode === 'gamelogs' ? 'Game Logs' : mode === 'notes' ? 'Notes' : 'Players'}
            </button>
          </div>
        </div>
      )}

      {importResult && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-text-bright font-medium">Import complete</p>
              <p className="text-xs text-text-dim mt-1">
                Successfully imported {importResult.count} {mode === 'gamelogs' ? 'game logs' : mode === 'notes' ? 'notes' : 'players'}.
              </p>
            </div>
          </div>
          {importResult.unmatched && importResult.unmatched.length > 0 && (
            <div className="flex items-start gap-3 mt-2">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-bright">Unmatched players (skipped):</p>
                <p className="text-xs text-text-dim mt-0.5">{importResult.unmatched.join(', ')}</p>
              </div>
            </div>
          )}
          <button
            onClick={reset}
            className="text-xs text-accent hover:underline mt-2"
          >
            Import more
          </button>
        </div>
      )}
    </div>
  );
}
