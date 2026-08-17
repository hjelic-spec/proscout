import { Link } from 'react-router-dom';
import { ArrowRight, Users, Trophy, BarChart3, GitCompareArrows } from 'lucide-react';

function Basketball() {
  return <span className="text-[12rem] leading-none select-none drop-shadow-2xl">🏀</span>;
}

export function Landing() {
  const highlights = [
    { icon: Users, label: '200 Prospects', desc: 'NCAA, HS & International' },
    { icon: Trophy, label: 'Draft Classes', desc: '2026 – 2030' },
    { icon: BarChart3, label: 'Full Stats', desc: 'Box scores & leaders' },
    { icon: GitCompareArrows, label: 'Compare', desc: 'Head-to-head analysis' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-court to-court-light flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <span className="text-4xl">🏀</span>
              <h1 className="text-5xl font-bold text-text-bright tracking-tight">ProScout</h1>
            </div>
            <p className="text-xl text-text-dim mb-2">Basketball Prospect Scouting</p>
            <p className="text-sm text-text-dim/70 mb-8 max-w-md mx-auto lg:mx-0">
              Scout, track, and rank young basketball talent across NCAA, High School, and AAU.
              Monitor development from high school to the NBA draft.
            </p>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-accent/25"
            >
              Enter ProScout <ArrowRight size={20} />
            </Link>

            <div className="grid grid-cols-2 gap-4 mt-10">
              {highlights.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-court-light/50 border border-court-border/50 rounded-lg p-3 backdrop-blur-sm">
                  <Icon size={18} className="text-accent mb-1" />
                  <div className="text-sm font-semibold text-text-bright">{label}</div>
                  <div className="text-xs text-text-dim">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: basketball */}
          <div className="flex-1 flex items-center justify-center">
            <Basketball />
          </div>
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-text-dim/50 border-t border-court-border/30">
        Created by <span className="text-text-dim">Matthew Ivan Jelić</span>
      </footer>
    </div>
  );
}
