import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import { Calculator, RotateCcw, Wallet, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardBody, Disclaimer, StatPill } from '@/components/ui';
import { computeCost, formatINR, type CostBreakdown } from '@/lib/calc';

export function CostPlanner() {
  const { state, setCosts } = useStore();
  const [local, setLocal] = useState(state.costs);
  const cost = computeCost(local);

  const update = (key: keyof typeof local, value: number) => {
    const next = { ...local, [key]: value < 0 ? 0 : value };
    setLocal(next);
    setCosts(next);
  };

  const reset = () => {
    const fresh: typeof local = {
      annualTuition: 0, accommodation: 0, transport: 0, books: 0, other: 0,
      scholarship: 0, durationYears: 4, annualBudget: 0,
    };
    setLocal(fresh);
    setCosts(fresh);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Education Cost Planner"
        subtitle="Estimate annual and total engineering education expenses, and compare them to your family budget."
        icon={<Calculator size={18} />}
      />

      <Disclaimer>
        All figures are estimates you enter for planning purposes. They are not verified fees. Always confirm official tuition, hostel, and scholarship amounts with your institution.
      </Disclaimer>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-2">
          <CardHeader title="Your inputs" subtitle="Edit any value — results recalculate instantly"
            action={<button onClick={reset} className="btn-ghost text-xs !px-2.5 !py-1.5"><RotateCcw size={13} /> Reset</button>}
            icon={<Wallet size={16} />}
          />
          <CardBody className="space-y-4">
            <NumberField label="Annual tuition fees" value={local.annualTuition} onChange={(v) => update('annualTuition', v)} />
            <NumberField label="Hostel / accommodation (annual)" value={local.accommodation} onChange={(v) => update('accommodation', v)} />
            <NumberField label="Transport (annual)" value={local.transport} onChange={(v) => update('transport', v)} />
            <NumberField label="Books, equipment & learning resources" value={local.books} onChange={(v) => update('books', v)} />
            <NumberField label="Other education expenses" value={local.other} onChange={(v) => update('other', v)} />
            <NumberField label="Scholarship / financial assistance (annual)" value={local.scholarship} onChange={(v) => update('scholarship', v)} />
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Duration (years)" value={local.durationYears} onChange={(v) => update('durationYears', v)} min={1} max={8} />
              <NumberField label="Annual family budget" value={local.annualBudget} onChange={(v) => update('annualBudget', v)} />
            </div>
          </CardBody>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader title="Summary" icon={<TrendingDown size={16} />} />
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <SummaryStat label="Annual expense" value={formatINR(cost.annual)} />
                <SummaryStat label="After scholarship / yr" value={formatINR(cost.afterScholarshipAnnual)} tone="good" />
                <SummaryStat label={`${cost.durationYears}-yr total`} value={formatINR(cost.afterScholarshipTotal)} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <SummaryStat label="Annual budget" value={formatINR(cost.annualBudget)} />
                <SummaryStat
                  label="Yearly budget gap"
                  value={`${cost.budgetDiffAnnual < 0 ? '−' : '+'} ${formatINR(Math.abs(cost.budgetDiffAnnual)).replace('Rs. ', 'Rs. ')}`}
                  tone={cost.overBudget ? 'bad' : 'good'}
                />
                <SummaryStat
                  label={`${cost.durationYears}-yr budget gap`}
                  value={`${cost.budgetDiffTotal < 0 ? '−' : '+'} ${formatINR(Math.abs(cost.budgetDiffTotal))}`}
                  tone={cost.budgetDiffTotal < 0 ? 'bad' : 'good'}
                />
              </div>

              <BudgetStatus cost={cost} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Category-wise spending" subtitle="Estimated annual expense by category" icon={<Calculator size={16} />} />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cost.categories} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v) => formatINR(Number(v))}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                      cursor={{ fill: '#f1f5f9' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {cost.categories.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                {cost.categories.map((c, i) => (
                  <div key={c.key} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: BAR_COLORS[i % BAR_COLORS.length] }} />
                    {c.name}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

const BAR_COLORS = ['#1e3d7a', '#2cc4b0', '#3f6fbd', '#5edcca', '#94a3b8'];

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-600 text-white shrink-0">{icon}</div>
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}

function NumberField({
  label, value, onChange, min = 0, max,
}: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          onChange(Number.isFinite(v) ? v : 0);
        }}
        className="input"
      />
    </div>
  );
}

function SummaryStat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'good' | 'bad' }) {
  const toneCls: Record<string, string> = {
    default: 'text-navy-900',
    good: 'text-emerald-600',
    bad: 'text-rose-600',
  };
  return (
    <div className="rounded-xl bg-slate-50 px-3.5 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-display text-base font-bold mt-0.5 ${toneCls[tone]}`}>{value}</p>
    </div>
  );
}

function BudgetStatus({ cost }: { cost: CostBreakdown }) {
  if (cost.annualBudget <= 0) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3 text-xs text-slate-600">
        <AlertTriangle size={15} className="text-slate-400 mt-0.5 shrink-0" />
        Enter an annual family budget above to see whether your estimates fit within it.
      </div>
    );
  }
  if (cost.overBudget) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-3 text-xs text-rose-700">
        <AlertTriangle size={15} className="text-rose-500 mt-0.5 shrink-0" />
        Your estimated annual expense after scholarship exceeds your budget by <strong className="font-semibold mx-1">{formatINR(Math.abs(cost.budgetDiffAnnual))}</strong>. Consider reducing costs, increasing scholarship search, or revisiting the plan with your family.
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-3 text-xs text-emerald-700">
      <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" />
      Your estimated annual expense fits within the family budget with a surplus of <strong className="font-semibold mx-1">{formatINR(cost.budgetDiffAnnual)}</strong>. Keep a buffer for unexpected costs.
    </div>
  );
}
