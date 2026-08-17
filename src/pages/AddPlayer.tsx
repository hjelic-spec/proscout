import { useNavigate } from 'react-router-dom';
import { PlayerForm } from '../components/PlayerForm';

export function AddPlayer() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-bright mb-6">Add New Prospect</h1>
      <PlayerForm
        onSave={(player) => navigate(`/players/${player.id}`)}
        onCancel={() => navigate('/players')}
      />
    </div>
  );
}
