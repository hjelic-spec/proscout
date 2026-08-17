import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { PlayerList } from './pages/PlayerList';
import { PlayerDetail } from './pages/PlayerDetail';
import { AddPlayer } from './pages/AddPlayer';
import { Stats } from './pages/Stats';
import { Compare } from './pages/Compare';
import { Rankings } from './pages/Rankings';
import { About } from './pages/About';
import { Import } from './pages/Import';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/players/new" element={<AddPlayer />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/about" element={<About />} />
          <Route path="/import" element={<Import />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
