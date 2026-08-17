import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { generateSeedData } from './seedData'

if (!localStorage.getItem('scout_players') || JSON.parse(localStorage.getItem('scout_players')!).length === 0) {
  const seed = generateSeedData();
  localStorage.setItem('scout_players', JSON.stringify(seed.players));
  localStorage.setItem('scout_game_logs', JSON.stringify(seed.gameLogs));
  localStorage.setItem('scout_notes', JSON.stringify(seed.notes));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
