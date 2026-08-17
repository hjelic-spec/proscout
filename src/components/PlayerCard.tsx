import { Link } from 'react-router-dom';
import type { Player } from '../types';
import { getAge, formatHeight } from '../types';
import { SkillRadar } from './SkillRadar';

interface Props {
  player: Player;
}

const positionColors: Record<string, string> = {
  PG: 'bg-blue-500/20 text-blue-400',
  SG: 'bg-green-500/20 text-green-400',
  SF: 'bg-purple-500/20 text-purple-400',
  PF: 'bg-orange-500/20 text-orange-400',
  C: 'bg-red-500/20 text-red-400',
};

const leagueColors: Record<string, string> = {
  NCAA: 'bg-green-600/20 text-green-400',
  'High School': 'bg-cyan-600/20 text-cyan-400',
  AAU: 'bg-purple-600/20 text-purple-400',
  NBA: 'bg-nba/20 text-blue-400',
  Euroleague: 'bg-euroleague/20 text-orange-400',
  Other: 'bg-gray-600/20 text-gray-400',
};

export function PlayerCard({ player }: Props) {
  const age = getAge(player.dateOfBirth);

  return (
    <Link
      to={`/players/${player.id}`}
      className="block bg-court-light border border-court-border rounded-lg p-4 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text-bright group-hover:text-accent transition-colors">
            {player.firstName} {player.lastName}
          </h3>
          <p className="text-sm text-text-dim">{player.currentTeam}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent">{player.overallRating}</div>
          <div className="text-xs text-text-dim">OVR</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${positionColors[player.position]}`}>
          {player.position}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${leagueColors[player.league]}`}>
          {player.league}
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-court-lighter text-text-dim">
          {age}y
        </span>
      </div>

      <div className="flex justify-center mb-3">
        <SkillRadar skills={player.skills} size={180} showLabels={false} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-text-dim">
          Height: <span className="text-text">{formatHeight(player.height)}</span>
        </div>
        <div className="text-text-dim">
          Potential: <span className="text-gold font-medium">{player.potential}</span>
        </div>
        <div className="text-text-dim">
          Draft: <span className="text-text">{player.draftProjection}</span>
        </div>
        <div className="text-text-dim">
          Nation: <span className="text-text">{player.nationality}</span>
        </div>
      </div>
    </Link>
  );
}
