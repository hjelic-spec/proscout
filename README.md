# ProScout — Basketball Prospect Scouting App

A web application for scouting and tracking young basketball prospects across NCAA, High School, and AAU levels. Organize rankings by NBA draft class (2028–2030), log game stats, compare players head-to-head, and monitor prospect development over time.

## Features

- **Dashboard** — Overview of total prospects, league breakdown (NCAA/HS/AAU), age group stats, and top prospects by potential
- **Player Profiles** — Detailed profiles with 12-skill radar charts, season averages, game logs, and scout notes
- **Game Logging** — Track full box score stats per game with opponent and league info
- **Draft Rankings** — Sortable rankings by draft class (2028, 2029, 2030) with weekly snapshot saving and CSV export
- **Head-to-Head Compare** — Side-by-side comparison with overlaid radar charts and stat breakdowns
- **Statistical Leaders** — Top 5 leaders across categories, position/age distributions, and skill averages by position
- **Import/Export** — JSON import/export for backing up and sharing prospect databases

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** with HMR
- **Tailwind CSS v4** with custom theme (court colors, accent, league colors)
- **React Router DOM** for navigation
- **Recharts** for statistical charts
- **Lucide React** for icons
- **localStorage** for data persistence

## Getting Started

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173` and comes pre-loaded with 93 real prospects across three draft classes, including international players from European leagues.

## Data

All prospect data is stored in localStorage under the keys:
- `scout_players` — Player profiles and skill ratings
- `scout_game_logs` — Individual game statistics
- `scout_notes` — Scout observations and notes
- `scout_ranking_snapshots` — Weekly ranking snapshots

Clear localStorage to reset to the default seed data.

## Author

**Matthew Ivan Jelić**
