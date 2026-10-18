import {
  Sparkles,
  Calculator,
  Compass,
  Users,
  GitCompare,
  TrendingUp,
  Wallet,
  Target,
  ListChecks,
  CheckCircle2,
  Circle,
  ArrowRight,
  GraduationCap,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { SectionId } from '@/types';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardBody, ProgressBar, Badge, StatPill, Disclaimer } from '@/components/ui';
import { computeCost, formatINR } from '@/lib/calc';

const PIE_COLORS = ['#1e3d7a', '#2cc4b0', '#3f6fbd', '#5edcca', '#94a3b8'];

export function Dashboard({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const { state } = useStore();
  const { profile, costs, tasks, skills } = state;
  const cost = computeCost(costs);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const skillLevels = skills.map((s) => ({ name: s.name, value: s.level === 'beginner' ? 33 : s.level === 'intermediate' ? 66 : 100, level: s.level }));
  const avgSkill = skillLevels.length
    ? Math.round(skillLevels.reduce((a, b) => a + b.value, 0) / skillLevels.length)
    : 0;

  const cgpaPct = Math.min(100, (profile.cgpa / 10) * 100);
  const cgpaGap = Math.max(0, profile.targetCgpa - profile.cgpa);

  const pendingDecisions = state.decisions.filter((d) => d.status === 'discussing').length;

  return (
    <div className="space-y-6">
      {/* Greeting banner */}
      <Card className="overflow-hidden border-0 bg-gradient-hero text-white">
        <div className="p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-teal-200 font-medium uppercase tracking-wider">
                {profile.year} · {profile.semester}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                Welcome back, {profile.name.split(' ')[0]}
              </h2>
              <p className="text-white/70 text-sm mt-1.5 max-w-lg">
                {profile.branch} · Interests in {profile.interests.slice(0, 3).join(', ')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onNavigate('assistant')} className="btn bg-white/10 border border-white/20 text-white hover:bg-white/15 text-sm">
                <Sparkles size={15} /> Ask assistant
              </button>
              <button onClick={() => onNavigate('cost')} className="btn bg-teal-400 text-navy-950 hover:bg-teal-300 text-sm font-semibold">
                <Calculator size={15} /> Plan budget
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Wallet size={18} />}
          label="Annual budget"
          value={formatINR(cost.annualBudget)}
          sub={`Est. ${formatINR(cost.afterScholarshipAnnual)} after scholarship`}
          tone={cost.overBudget ? 'bad' : 'good'}
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Current CGPA"
          value={profile.cgpa.toFixed(1)}
          sub={`Target ${profile.targetCgpa.toFixed(1)} · gap ${cgpaGap.toFixed(1)}`}
          tone="default"
        />
        <StatCard
          icon={<ListChecks size={18} />}
          label="Action plan"
          value={`${taskPct}%`}
          sub={`${completedTasks}/${totalTasks} tasks done`}
          tone="default"
        />
        <StatCard
          icon={<Users size={18} />}
          label="Open decisions"
          value={String(pendingDecisions)}
          sub={pendingDecisions ? 'Awaiting family discussion' : 'All decisions reviewed'}
          tone={pendingDecisions ? 'warn' : 'good'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic & skill progress */}
        <Card className="lg:col-span-2">
          <CardHeader title="Academic & skill progress" subtitle="Editable in Career & Skills and the Action Plan" icon={<Target size={16} />} />
          <CardBody className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-navy-800">CGPA progress</span>
                <span className="text-slate-500">{profile.cgpa.toFixed(1)} / {profile.targetCgpa.toFixed(1)}</span>
              </div>
              <ProgressBar value={cgpaPct} color="navy" />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-navy-800">Average skill development</span>
                <span className="text-slate-500">{avgSkill}%</span>
              </div>
              <ProgressBar value={avgSkill} color="teal" />
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skills.slice(0, 6).map((s) => (
                  <Badge key={s.id} color={s.level === 'advanced' ? 'teal' : s.level === 'intermediate' ? 'navy' : 'slate'}>
                    {s.name} · {s.level}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-navy-800">Career readiness checklist</span>
                <button onClick={() => onNavigate('career')} className="text-xs text-navy-600 hover:text-navy-700 font-medium inline-flex items-center gap-1">
                  Open navigator <ArrowRight size={12} />
                </button>
              </div>
              <ul className="space-y-1.5">
                {CAREER_CHECKLIST.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-sm text-slate-600">
                    {c.done ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Circle size={15} className="text-slate-300" />}
                    <span className={c.done ? 'line-through text-slate-400' : ''}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Expense breakdown */}
        <Card>
          <CardHeader title="Education expenses" subtitle="Estimated annual split" icon={<Calculator size={16} />}
            action={<button onClick={() => onNavigate('cost')} className="text-xs text-navy-600 hover:text-navy-700 font-medium">Edit</button>}
          />
          <CardBody>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cost.categories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {cost.categories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatINR(Number(v))}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {cost.categories.filter((c) => c.value > 0).map((c, i) => (
                <div key={c.key} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {c.name}
                  </span>
                  <span className="font-medium text-navy-800">{formatINR(c.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs pt-2 mt-1 border-t border-slate-100">
                <span className="font-semibold text-navy-900">Estimated annual</span>
                <span className="font-display font-bold text-navy-900">{formatINR(cost.annual)}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Budget summary + recommended next step */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Education budget summary" subtitle="Compared against your family's annual budget" icon={<Wallet size={16} />}
            action={<button onClick={() => onNavigate('cost')} className="text-xs text-navy-600 hover:text-navy-700 font-medium">Open planner</button>}
          />
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <BudgetStat label="Annual est." value={formatINR(cost.afterScholarshipAnnual)} />
              <BudgetStat label={`${cost.durationYears}-yr total`} value={formatINR(cost.afterScholarshipTotal)} />
              <BudgetStat label="Annual budget" value={formatINR(cost.annualBudget)} />
              <BudgetStat
                label="Yearly gap"
                value={`${cost.budgetDiffAnnual < 0 ? '−' : '+'}${formatINR(Math.abs(cost.budgetDiffAnnual)).replace('Rs. ', '')}`}
                tone={cost.overBudget ? 'bad' : 'good'}
              />
            </div>
            <div className="mt-4">
              <ProgressBar
                value={cost.afterScholarshipAnnual}
                max={Math.max(cost.annualBudget, cost.afterScholarshipAnnual, 1)}
                color={cost.overBudget ? 'amber' : 'teal'}
              />
              <p className={`text-xs mt-2 ${cost.overBudget ? 'text-amber-600' : 'text-emerald-600'}`}>
                {cost.overBudget
                  ? `Estimates exceed your annual budget by ${formatINR(Math.abs(cost.budgetDiffAnnual))}. Consider adjusting costs or increasing scholarships.`
                  : `Estimates fit within your annual budget with a surplus of ${formatINR(cost.budgetDiffAnnual)}.`}
              </p>
            </div>
            <Disclaimer className="mt-4">
              Figures are sample estimates based on the values you enter. Verify official fees, scholarships, and expenses with your institution.
            </Disclaimer>
          </CardBody>
        </Card>

        {/* Recommended next step */}
        <Card className="bg-gradient-to-br from-navy-50 to-teal-50/40 border-navy-100">
          <CardHeader title="Recommended next step" icon={<Sparkles size={16} />} />
          <CardBody className="space-y-3">
            {recommendedNextStep({ cost, pendingDecisions, taskPct, onNavigate }).card}
          </CardBody>
        </Card>
      </div>

      {/* Upcoming tasks + goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Upcoming action items" subtitle="From My Action Plan" icon={<ListChecks size={16} />}
            action={<button onClick={() => onNavigate('plan')} className="text-xs text-navy-600 hover:text-navy-700 font-medium">View all</button>}
          />
          <CardBody className="!pt-2">
            {tasks.filter((t) => !t.completed).slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <Circle size={16} className="text-slate-300 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-navy-800 truncate">{t.title}</p>
                  <p className="text-xs text-slate-500">{CATEGORY_LABEL[t.category]} · due {t.dueDate}</p>
                </div>
                <Badge color={PRIORITY_COLOR[t.priority]}>{t.priority}</Badge>
              </div>
            ))}
            {tasks.filter((t) => !t.completed).length === 0 && (
              <div className="text-sm text-slate-500 py-4 text-center">All caught up — no pending tasks.</div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Pending family decisions" subtitle="From the Family Decision Workspace" icon={<Users size={16} />}
            action={<button onClick={() => onNavigate('family')} className="text-xs text-navy-600 hover:text-navy-700 font-medium">Open</button>}
          />
          <CardBody className="!pt-2">
            {state.decisions.filter((d) => d.status === 'discussing').slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm text-navy-800 truncate">{d.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{d.options.length} option(s) · {d.comments.length} comment(s)</p>
                </div>
              </div>
            ))}
            {state.decisions.filter((d) => d.status === 'discussing').length === 0 && (
              <div className="text-sm text-slate-500 py-4 text-center">No open decisions right now.</div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickAction icon={<Sparkles size={18} />} label="AI Assistant" onClick={() => onNavigate('assistant')} />
        <QuickAction icon={<Compass size={18} />} label="Career Navigator" onClick={() => onNavigate('career')} />
        <QuickAction icon={<GitCompare size={18} />} label="What-If Simulator" onClick={() => onNavigate('simulator')} />
        <QuickAction icon={<ListChecks size={18} />} label="My Action Plan" onClick={() => onNavigate('plan')} />
      </div>
    </div>
  );
}

const CAREER_CHECKLIST = [
  { label: 'Resume / portfolio started', done: true },
  { label: 'One hands-on project completed', done: true },
  { label: 'Internship search initiated', done: false },
  { label: 'LinkedIn / professional profile set up', done: false },
  { label: 'Mock interview practice', done: false },
];

const CATEGORY_LABEL: Record<string, string> = {
  education: 'Education',
  finance: 'Finance',
  family: 'Family discussion',
  career: 'Career',
};

const PRIORITY_COLOR: Record<string, 'rose' | 'amber' | 'slate'> = {
  high: 'rose',
  medium: 'amber',
  low: 'slate',
};

function StatCard({
  icon, label, value, sub, tone = 'default',
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; tone?: 'default' | 'good' | 'warn' | 'bad';
}) {
  const toneRing: Record<string, string> = {
    default: 'bg-navy-50 text-navy-600',
    good: 'bg-emerald-50 text-emerald-600',
    warn: 'bg-amber-50 text-amber-600',
    bad: 'bg-rose-50 text-rose-600',
  };
  return (
    <Card hover>
      <CardBody className="!p-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneRing[tone]}`}>{icon}</div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 truncate">{label}</p>
            <p className="font-display text-lg font-bold text-navy-900 truncate">{value}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 truncate">{sub}</p>
      </CardBody>
    </Card>
  );
}

function BudgetStat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'good' | 'bad' }) {
  const toneCls: Record<string, string> = {
    default: 'text-navy-900',
    good: 'text-emerald-600',
    bad: 'text-rose-600',
  };
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-display text-base font-bold mt-0.5 ${toneCls[tone]}`}>{value}</p>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card card-hover p-4 flex items-center gap-3 text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-navy-800 truncate">{label}</p>
        <p className="text-xs text-slate-500">Open section</p>
      </div>
      <ArrowRight size={16} className="ml-auto text-slate-300 shrink-0" />
    </button>
  );
}

function recommendedNextStep({
  cost, pendingDecisions, taskPct, onNavigate,
}: {
  cost: ReturnType<typeof computeCost>;
  pendingDecisions: number;
  taskPct: number;
  onNavigate: (id: SectionId) => void;
}): { card: React.ReactNode } {
  let title = '';
  let body = '';
  let action: { label: string; id: SectionId } = { label: 'Open cost planner', id: 'cost' };
  let Icon = Calculator;

  if (cost.overBudget) {
    title = 'Review your education budget';
    body = `Your current estimates exceed your annual family budget by ${formatINR(Math.abs(cost.budgetDiffAnnual))}. Adjust expenses or scholarship assumptions in the Cost Planner.`;
    action = { label: 'Open cost planner', id: 'cost' };
    Icon = Wallet;
  } else if (pendingDecisions > 0) {
    title = 'A family decision is waiting';
    body = `${pendingDecisions} decision(s) are still being discussed. Review them with your family and record everyone's priorities.`;
    action = { label: 'Open family workspace', id: 'family' };
    Icon = Users;
  } else if (taskPct < 50) {
    title = 'Make progress on your action plan';
    body = `You've completed ${taskPct}% of your tasks. Pick the next high-priority task and complete it this week.`;
    action = { label: 'Open action plan', id: 'plan' };
    Icon = ListChecks;
  } else {
    title = 'Explore a what-if scenario';
    body = 'Things are looking steady. Try comparing two education plans in the What-If Simulator to surface trade-offs early.';
    action = { label: 'Open simulator', id: 'simulator' };
    Icon = GitCompare;
  }

  return {
    card: (
      <>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-navy-600 shadow-sm shrink-0">
            <Icon size={16} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-navy-900">{title}</p>
            <p className="text-xs text-navy-700/70 mt-1 leading-relaxed">{body}</p>
          </div>
        </div>
        <button onClick={() => onNavigate(action.id)} className="btn-primary w-full text-sm">
          {action.label} <ArrowRight size={14} />
        </button>
      </>
    ),
  };
}

export const DASHBOARD_CATEGORY_LABEL = CATEGORY_LABEL;
