import type { Player, GameLog, ScoutNote } from './types';

const KEYS = {
  players: 'scout_players',
  gameLogs: 'scout_game_logs',
  notes: 'scout_notes',
} as const;

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const store = {
  getPlayers: () => load<Player>(KEYS.players),
  savePlayers: (players: Player[]) => save(KEYS.players, players),

  getPlayer: (id: string) => load<Player>(KEYS.players).find(p => p.id === id),

  addPlayer: (player: Player) => {
    const players = load<Player>(KEYS.players);
    players.push(player);
    save(KEYS.players, players);
  },

  updatePlayer: (player: Player) => {
    const players = load<Player>(KEYS.players);
    const idx = players.findIndex(p => p.id === player.id);
    if (idx !== -1) {
      players[idx] = player;
      save(KEYS.players, players);
    }
  },

  deletePlayer: (id: string) => {
    save(KEYS.players, load<Player>(KEYS.players).filter(p => p.id !== id));
    save(KEYS.gameLogs, load<GameLog>(KEYS.gameLogs).filter(g => g.playerId !== id));
    save(KEYS.notes, load<ScoutNote>(KEYS.notes).filter(n => n.playerId !== id));
  },

  getGameLogs: (playerId?: string) => {
    const logs = load<GameLog>(KEYS.gameLogs);
    return playerId ? logs.filter(g => g.playerId === playerId) : logs;
  },

  addGameLog: (log: GameLog) => {
    const logs = load<GameLog>(KEYS.gameLogs);
    logs.push(log);
    save(KEYS.gameLogs, logs);
  },

  updateGameLog: (log: GameLog) => {
    const logs = load<GameLog>(KEYS.gameLogs);
    const idx = logs.findIndex(g => g.id === log.id);
    if (idx !== -1) {
      logs[idx] = log;
      save(KEYS.gameLogs, logs);
    }
  },

  deleteGameLog: (id: string) => {
    save(KEYS.gameLogs, load<GameLog>(KEYS.gameLogs).filter(g => g.id !== id));
  },

  getNotes: (playerId?: string) => {
    const notes = load<ScoutNote>(KEYS.notes);
    return playerId ? notes.filter(n => n.playerId === playerId) : notes;
  },

  addNote: (note: ScoutNote) => {
    const notes = load<ScoutNote>(KEYS.notes);
    notes.push(note);
    save(KEYS.notes, notes);
  },

  deleteNote: (id: string) => {
    save(KEYS.notes, load<ScoutNote>(KEYS.notes).filter(n => n.id !== id));
  },

  exportAll: () => ({
    players: load<Player>(KEYS.players),
    gameLogs: load<GameLog>(KEYS.gameLogs),
    notes: load<ScoutNote>(KEYS.notes),
    exportedAt: new Date().toISOString(),
  }),

  importAll: (data: { players: Player[]; gameLogs: GameLog[]; notes: ScoutNote[] }) => {
    save(KEYS.players, data.players);
    save(KEYS.gameLogs, data.gameLogs);
    save(KEYS.notes, data.notes);
  },
};
