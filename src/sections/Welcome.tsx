import {
  GraduationCap,
  Sparkles,
  Calculator,
  Compass,
  Users,
  GitCompare,
  ListChecks,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react';
import type { SectionId } from '@/types';
import { Brand } from '@/components/AppShell';

export function Welcome({ onEnter }: { onEnter: (id: SectionId) => void }) {
  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 sm:px-8 py-5">
        <Brand />
        <button
          onClick={() => onEnter('dashboard')}
          className="btn bg-white/10 text-white border border-white/20 hover:bg-white/15 backdrop-blur-sm"
        >
          Enter app <ArrowRight size={16} />
        </button>
      </header>

      {/* Hero */}
      <section className="px-5 sm:px-8 pt-10 sm:pt-16 pb-12 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-medium text-teal-200 mb-6 animate-fade-in">
          <Sparkles size={13} /> AI-Enabled Family Decision-Support Platform
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-4xl text-balance animate-slide-up">
          Better decisions.
          <br />
          <span className="bg-gradient-to-r from-teal-300 to-teal-400 bg-clip-text text-transparent">
            Stronger families.
          </span>{' '}
          Brighter engineering futures.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '60ms' }}>
          EduFamily Compass brings together a student's aspirations, a family's priorities,
          education costs, academic progress, and career opportunities into one shared
          planning space — so engineering education decisions are made together, with clarity.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '120ms' }}>
          <button onClick={() => onEnter('dashboard')} className="btn-accent !px-5 !py-3 text-sm">
            Start exploring <ArrowRight size={16} />
          </button>
          <button
            onClick={() => onEnter('assistant')}
            className="btn bg-white/10 text-white border border-white/20 hover:bg-white/15 !px-5 !py-3 text-sm"
          >
            <Sparkles size={16} /> Try the AI assistant
          </button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-5 sm:px-8 pb-16 max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.18em] text-white/40 font-semibold mb-4">
          What's inside
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => onEnter(f.id)}
                className="group text-left rounded-2xl bg-white/[0.06] border border-white/10 p-5 hover:bg-white/[0.10] hover:border-white/20 transition-all animate-slide-up"
                style={{ animationDelay: `${160 + i * 50}ms` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300 mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{f.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-teal-300 group-hover:gap-2 transition-all">
                  Open <ArrowRight size={13} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Principles */}
      <section className="px-5 sm:px-8 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <Icon size={18} className="text-teal-300 mb-3" />
                <p className="text-sm font-display font-semibold text-white">{p.title}</p>
                <p className="text-xs text-white/55 mt-1 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 sm:px-8 py-6 text-xs text-white/40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-2">
          <span>EduFamily Compass — Hackathon demo. Sample data shown for illustration.</span>
          <span>Data is stored locally in your browser and does not sync between devices.</span>
        </div>
      </footer>
    </div>
  );
}

const FEATURES: { id: SectionId; title: string; description: string; icon: typeof Sparkles }[] = [
  {
    id: 'dashboard',
    title: 'Overview Dashboard',
    description: 'A personalized snapshot of academics, budget, skills, and pending family decisions.',
    icon: GraduationCap,
  },
  {
    id: 'assistant',
    title: 'AI Decision Assistant',
    description: 'Ask education-related questions and get structured, family-friendly guidance.',
    icon: Sparkles,
  },
  {
    id: 'cost',
    title: 'Education Cost Planner',
    description: 'Estimate annual and total expenses, compare them to your family budget.',
    icon: Calculator,
  },
  {
    id: 'career',
    title: 'Career & Skills Navigator',
    description: 'Explore career pathways with skills, milestones, and beginner-friendly steps.',
    icon: Compass,
  },
  {
    id: 'family',
    title: 'Family Decision Workspace',
    description: 'Record priorities, compare options, and decide together with full transparency.',
    icon: Users,
  },
  {
    id: 'simulator',
    title: 'What-If Scenario Simulator',
    description: 'Compare two or three education plans side by side and save them for review.',
    icon: GitCompare,
  },
];

const PRINCIPLES = [
  {
    title: 'Transparent, not prescriptive',
    description: 'We surface trade-offs and questions to discuss — we never make the decision for your family.',
    icon: Lightbulb,
  },
  {
    title: 'Built for students and families',
    description: 'Both voices matter. Priorities are presented respectfully, not as a conflict to win.',
    icon: HeartHandshake,
  },
  {
    title: 'Estimates clearly labeled',
    description: 'Figures are sample estimates. Always verify fees, scholarships and placements officially.',
    icon: ShieldCheck,
  },
];

export const FEATURE_LIST = FEATURES;
