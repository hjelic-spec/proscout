import type { SkillRatings } from '../types';
import { SKILL_LABELS } from '../types';

interface Props {
  skills: SkillRatings;
  size?: number;
  showLabels?: boolean;
  compareSkills?: SkillRatings;
}

export function SkillRadar({ skills, size = 280, showLabels = true, compareSkills }: Props) {
  const entries = Object.entries(skills) as [keyof SkillRatings, number][];
  const n = entries.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const labelR = size * 0.48;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 10) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLevels = [2, 4, 6, 8, 10];
  const points = entries.map(([, v], i) => getPoint(i, v));
  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');

  let comparePolygon = '';
  if (compareSkills) {
    const compareEntries = Object.entries(compareSkills) as [keyof SkillRatings, number][];
    const comparePoints = compareEntries.map(([, v], i) => getPoint(i, v));
    comparePolygon = comparePoints.map(p => `${p.x},${p.y}`).join(' ');
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {gridLevels.map(level => {
        const gridPoints = Array.from({ length: n }, (_, i) => getPoint(i, level));
        return (
          <polygon
            key={level}
            points={gridPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#2e3456"
            strokeWidth={level === 10 ? 1.5 : 0.5}
          />
        );
      })}
      {entries.map((_, i) => {
        const edge = getPoint(i, 10);
        return (
          <line key={i} x1={cx} y1={cy} x2={edge.x} y2={edge.y} stroke="#2e3456" strokeWidth={0.5} />
        );
      })}
      {compareSkills && (
        <polygon points={comparePolygon} fill="rgba(29,66,138,0.2)" stroke="#1d428a" strokeWidth={1.5} />
      )}
      <polygon points={polygon} fill="rgba(233,69,96,0.25)" stroke="#e94560" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#e94560" />
      ))}
      {showLabels &&
        entries.map(([key], i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          const anchor = Math.abs(angle) < 0.1 || Math.abs(angle - Math.PI) < 0.1
            ? 'middle'
            : angle > -Math.PI / 2 && angle < Math.PI / 2
            ? 'start'
            : 'end';
          return (
            <text
              key={key}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="#8892b0"
              fontSize={9}
              fontWeight={500}
            >
              {SKILL_LABELS[key]}
            </text>
          );
        })}
    </svg>
  );
}
