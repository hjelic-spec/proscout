import { Info, Mail, Trophy, Users, BarChart3, GitCompareArrows, Activity } from 'lucide-react';

export function About() {
  const features = [
    { icon: Users, label: 'Player Profiles', desc: 'Detailed profiles with 12-skill radar charts, game logs, and scout notes' },
    { icon: Activity, label: 'Game Logging', desc: 'Track full box score stats per game across NCAA, High School, and AAU' },
    { icon: Trophy, label: 'Draft Rankings', desc: 'Sortable rankings by draft class with weekly snapshots and CSV export' },
    { icon: GitCompareArrows, label: 'Head-to-Head', desc: 'Side-by-side comparison with overlaid radar charts and stat breakdowns' },
    { icon: BarChart3, label: 'Statistical Leaders', desc: 'Top performers, position distributions, and skill averages by position' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="text-5xl mb-3">🏀</div>
        <h1 className="text-3xl font-bold text-text-bright">ProScout</h1>
        <p className="text-text-dim mt-2">Basketball Prospect Scouting App</p>
        <p className="text-xs text-text-dim mt-1">v1.0.0</p>
      </div>

      <div className="bg-court-light border border-court-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-bright flex items-center gap-2 mb-3">
          <Info size={20} className="text-accent" /> About
        </h2>
        <p className="text-sm text-text leading-relaxed">
          ProScout is a web application for scouting and tracking young basketball prospects
          across NCAA, High School, and AAU levels. Organize rankings by NBA draft class
          log game stats, compare players head-to-head, and monitor prospect
          development over time. Import data via CSV/JSON from ESPN, 247Sports, and other sources.
        </p>
      </div>

      <div className="bg-court-light border border-court-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-bright mb-4">Features</h2>
        <div className="space-y-3">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={18} className="text-accent mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-medium text-text-bright">{label}</div>
                <div className="text-xs text-text-dim">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-court-light border border-court-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-bright mb-3">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'React Router', 'Recharts', 'Lucide Icons'].map(tech => (
            <span key={tech} className="px-2.5 py-1 bg-court-lighter border border-court-border rounded text-xs text-text-dim">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-court-light border border-court-border rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-text-bright mb-2">Author</h2>
        <p className="text-accent font-medium text-lg">Matthew Ivan Jelić</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <a href="mailto:hjelic@gmail.com" className="flex items-center gap-1.5 text-sm text-text-dim hover:text-accent transition-colors">
            <Mail size={14} /> hjelic@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
