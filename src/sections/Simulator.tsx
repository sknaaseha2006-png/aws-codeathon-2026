import { useState } from 'react';
import {
  GitCompare, Plus, Trash2, Save, ArrowRight, Scale, Clock, Sparkles, TrendingDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend,
} from 'recharts';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardBody, Badge, Disclaimer, EmptyState, Modal } from '@/components/ui';
import type { Scenario } from '@/types';
import { computeScenarioCost, formatINR } from '@/lib/calc';

const BAR_COLORS = ['#1e3d7a', '#2cc4b0', '#f59e0b'];

export function Simulator() {
  const { state, addScenario, updateScenario, deleteScenario, saveScenarioToDecisions } = useStore();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Scenario>>({
    name: '', tuition: 140000, accommodation: 68000, scholarship: 25000, learningHours: 12, careerPriority: 'Software Development', durationYears: 4,
  });

  const scenarios = state.scenarios;
  const comparison = scenarios.map((s) => ({
    name: s.name,
    total: computeScenarioCost(s).afterScholarshipTotal,
    annual: computeScenarioCost(s).afterScholarshipAnnual,
  }));

  const createScenario = () => {
    if (!draft.name?.trim()) return;
    addScenario({
      name: draft.name.trim(),
      tuition: Number(draft.tuition) || 0,
      accommodation: Number(draft.accommodation) || 0,
      scholarship: Number(draft.scholarship) || 0,
      learningHours: Number(draft.learningHours) || 0,
      careerPriority: draft.careerPriority || 'Software Development',
      durationYears: Number(draft.durationYears) || 4,
    });
    setDraft({ name: '', tuition: 140000, accommodation: 68000, scholarship: 25000, learningHours: 12, careerPriority: 'Software Development', durationYears: 4 });
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="What-If Scenario Simulator"
        subtitle="Compare two or three hypothetical education plans side by side. Change expenses, accommodation, scholarship, learning time, and career priority."
        icon={<GitCompare size={18} />}
      />

      <Disclaimer>
        Numeric outputs are estimates based on your inputs. Non-numeric factors (career focus, family involvement, learning time) are explained qualitatively — they are not measured with scientific precision.
      </Disclaimer>

      <div className="flex justify-end">
        <button onClick={() => setAdding(true)} className="btn-primary text-sm" disabled={scenarios.length >= 3}>
          <Plus size={15} /> Add scenario {scenarios.length >= 3 && '(max 3)'}
        </button>
      </div>

      {scenarios.length === 0 ? (
        <Card>
          <EmptyState
            icon={<GitCompare size={22} />}
            title="No scenarios yet"
            description="Add at least two scenarios to compare education plans side by side."
            action={<button onClick={() => setAdding(true)} className="btn-primary text-sm"><Plus size={15} /> Add a scenario</button>}
          />
        </Card>
      ) : (
        <>
          {/* Scenario cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {scenarios.map((s, i) => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                color={BAR_COLORS[i % BAR_COLORS.length]}
                onSave={() => saveScenarioToDecisions(s.id)}
                onDelete={() => deleteScenario(s.id)}
                onUpdate={(patch) => updateScenario(s.id, patch)}
                saved={state.savedScenarioIds.includes(s.id)}
              />
            ))}
          </div>

          {/* Comparison chart */}
          {scenarios.length >= 2 && (
            <Card>
              <CardHeader title="Total cost comparison" subtitle="Estimated total cost after scholarship over the selected duration" icon={<TrendingDown size={16} />} />
              <CardBody>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparison} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v) => formatINR(Number(v))} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} cursor={{ fill: '#f1f5f9' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="annual" name="Annual" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="total" name="Total" radius={[6, 6, 0, 0]}>
                        {comparison.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Trade-off comparison table */}
          {scenarios.length >= 2 && (
            <Card>
              <CardHeader title="Trade-off comparison" subtitle="Key differences and discussion questions" icon={<Scale size={16} />} />
              <CardBody className="!pt-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2.5 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Factor</th>
                        {scenarios.map((s, i) => (
                          <th key={s.id} className="text-left py-2.5 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}>
                            {s.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <CompareRow label="Total est. cost" scenarios={scenarios} render={(s) => formatINR(computeScenarioCost(s).afterScholarshipTotal)} />
                      <CompareRow label="Annual est. cost" scenarios={scenarios} render={(s) => formatINR(computeScenarioCost(s).afterScholarshipAnnual)} />
                      <CompareRow label="Accommodation" scenarios={scenarios} render={(s) => formatINR(s.accommodation)} />
                      <CompareRow label="Scholarship" scenarios={scenarios} render={(s) => formatINR(s.scholarship)} />
                      <CompareRow label="Career focus" scenarios={scenarios} render={(s) => s.careerPriority} />
                      <CompareRow label="Learning time / week" scenarios={scenarios} render={(s) => `${s.learningHours} hrs`} />
                      <CompareRow label="Duration" scenarios={scenarios} render={(s) => `${s.durationYears} years`} />
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 rounded-xl bg-navy-50/60 border border-navy-100 p-4">
                  <p className="text-xs font-semibold text-navy-700 mb-2 flex items-center gap-1.5"><Sparkles size={14} /> Questions to discuss as a family</p>
                  <ul className="space-y-1.5 text-sm text-navy-800">
                    <li>• Which scenario best matches the student's career interest and the family's budget comfort?</li>
                    <li>• Is the higher-cost scenario worth the difference in study environment or career focus?</li>
                    <li>• Are the scholarship assumptions realistic? What's the fallback if the scholarship doesn't come through?</li>
                    <li>• Does more learning time meaningfully improve career readiness, or risk academic balance?</li>
                    <li>• What would change your mind in 6 months — what should you review then?</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add a scenario"
        size="md"
        footer={
          <>
            <button onClick={() => setAdding(false)} className="btn-secondary">Cancel</button>
            <button onClick={createScenario} className="btn-primary">Add</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Scenario name</label>
            <input autoFocus value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="input" placeholder="e.g. Hostel + Software focus" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="Annual tuition" value={draft.tuition} onChange={(v) => setDraft((d) => ({ ...d, tuition: v }))} />
            <NumField label="Accommodation / yr" value={draft.accommodation} onChange={(v) => setDraft((d) => ({ ...d, accommodation: v }))} />
            <NumField label="Scholarship / yr" value={draft.scholarship} onChange={(v) => setDraft((d) => ({ ...d, scholarship: v }))} />
            <NumField label="Duration (years)" value={draft.durationYears} onChange={(v) => setDraft((d) => ({ ...d, durationYears: v }))} />
            <NumField label="Learning hrs / week" value={draft.learningHours} onChange={(v) => setDraft((d) => ({ ...d, learningHours: v }))} />
            <div>
              <label className="label">Career priority</label>
              <select value={draft.careerPriority} onChange={(e) => setDraft((d) => ({ ...d, careerPriority: e.target.value }))} className="input">
                {['Software Development', 'Data & AI', 'Cybersecurity', 'Cloud Computing', 'Electronics & Embedded'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ScenarioCard({
  scenario, color, onSave, onDelete, onUpdate, saved,
}: {
  scenario: Scenario;
  color: string;
  onSave: () => void;
  onDelete: () => void;
  onUpdate: (patch: Partial<Scenario>) => void;
  saved: boolean;
}) {
  const cost = computeScenarioCost(scenario);
  return (
    <Card className="overflow-hidden">
      <div className="h-1.5" style={{ background: color }} />
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <input
            value={scenario.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="font-display text-base font-bold text-navy-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-navy-400/30 rounded-lg px-1 -mx-1 flex-1 min-w-0"
          />
          <button onClick={onDelete} className="text-slate-400 hover:text-rose-500 shrink-0" aria-label="Delete"><Trash2 size={15} /></button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <NumField label="Tuition" value={scenario.tuition} onChange={(v) => onUpdate({ tuition: v })} compact />
          <NumField label="Accommodation" value={scenario.accommodation} onChange={(v) => onUpdate({ accommodation: v })} compact />
          <NumField label="Scholarship" value={scenario.scholarship} onChange={(v) => onUpdate({ scholarship: v })} compact />
          <NumField label="Years" value={scenario.durationYears} onChange={(v) => onUpdate({ durationYears: v })} compact />
        </div>

        <div>
          <label className="text-xs text-slate-500">Career priority</label>
          <select value={scenario.careerPriority} onChange={(e) => onUpdate({ careerPriority: e.target.value })} className="input !py-2 text-sm">
            {['Software Development', 'Data & AI', 'Cybersecurity', 'Cloud Computing', 'Electronics & Embedded'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> Learning hours / week: <strong className="text-navy-700">{scenario.learningHours}</strong></label>
          <input type="range" min={0} max={30} value={scenario.learningHours} onChange={(e) => onUpdate({ learningHours: parseInt(e.target.value) })} className="w-full accent-navy-600 mt-1" />
        </div>

        <div className="rounded-xl bg-slate-50 px-3.5 py-3 space-y-1.5">
          <Row label="Annual (after scholarship)" value={formatINR(cost.afterScholarshipAnnual)} />
          <Row label={`${scenario.durationYears}-yr total`} value={formatINR(cost.afterScholarshipTotal)} bold />
          <Row label="Learning hrs / year" value={`${cost.perYearLearning} hrs`} />
        </div>

        <button onClick={onSave} disabled={saved} className="btn-secondary w-full text-sm">
          {saved ? <><Save size={14} /> Saved to workspace</> : <><Save size={14} /> Save to Family Workspace <ArrowRight size={13} /></>}
        </button>
      </CardBody>
    </Card>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={bold ? 'font-display font-bold text-navy-900' : 'font-medium text-navy-800'}>{value}</span>
    </div>
  );
}

function CompareRow({ label, scenarios, render }: { label: string; scenarios: Scenario[]; render: (s: Scenario) => string }) {
  return (
    <tr>
      <td className="py-2.5 pr-4 text-sm font-medium text-slate-600">{label}</td>
      {scenarios.map((s) => <td key={s.id} className="py-2.5 px-3 text-sm text-navy-800">{render(s)}</td>)}
    </tr>
  );
}

function NumField({ label, value, onChange, compact }: { label: string; value: number | undefined; onChange: (v: number) => void; compact?: boolean }) {
  return (
    <div>
      <label className={compact ? 'text-xs text-slate-500' : 'label'}>{label}</label>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={compact ? 'input !py-2 text-sm' : 'input'}
      />
    </div>
  );
}

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
