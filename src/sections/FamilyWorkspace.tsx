import { useState } from 'react';
import {
  Users, Plus, Trash2, MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle,
  CheckCircle2, Scale, ArrowRight, Pencil,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardBody, Badge, Disclaimer, EmptyState, Modal } from '@/components/ui';
import type { Decision, DecisionOption } from '@/types';
import { uid } from '@/store/defaults';

export function FamilyWorkspace() {
  const { state, addDecision, updateDecision, deleteDecision } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: '', description: '' });

  const open = state.decisions.find((d) => d.id === openId) || null;

  const createDecision = () => {
    if (!draft.title.trim()) return;
    addDecision({
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: 'discussing',
      studentPriorities: '',
      familyPriorities: '',
      criteria: [
        { id: uid(), name: 'Cost', importance: 4 },
        { id: uid(), name: 'Study environment', importance: 4 },
      ],
      options: [],
      comments: [],
    });
    setDraft({ title: '', description: '' });
    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Family Decision Workspace"
        subtitle="Record priorities, compare options side by side, and decide together — respectfully and transparently."
        icon={<Users size={18} />}
      />

      <Disclaimer>
        This workspace helps structure family conversations. It does not make decisions for you. Priorities from students and parents are presented equally — not as a conflict to win.
      </Disclaimer>

      <div className="flex justify-end">
        <button onClick={() => setCreating(true)} className="btn-primary text-sm">
          <Plus size={15} /> New decision
        </button>
      </div>

      {state.decisions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users size={22} />}
            title="No decisions yet"
            description="Create a decision your family needs to make together — like choosing between two study arrangements or a career pathway."
            action={<button onClick={() => setCreating(true)} className="btn-primary text-sm"><Plus size={15} /> Create a decision</button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.decisions.map((d) => (
            <Card key={d.id} hover className="cursor-pointer" >
              <div onClick={() => setOpenId(d.id)}>
                <CardHeader
                  title={d.title}
                  subtitle={d.description}
                  icon={<Scale size={16} />}
                  action={<StatusBadge status={d.status} />}
                />
                <CardBody className="!pt-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{d.options.length} option(s)</span>
                    <span>{d.criteria.length} criteria</span>
                    <span>{d.comments.length} comment(s)</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-navy-600 font-medium inline-flex items-center gap-1">
                      Open workspace <ArrowRight size={13} />
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${d.title}"?`)) deleteDecision(d.id); }}
                      className="text-slate-400 hover:text-rose-500 text-xs inline-flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </CardBody>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <DecisionDetail
          decision={open}
          onUpdate={(patch) => updateDecision(open.id, patch)}
          onClose={() => setOpenId(null)}
        />
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create a decision"
        footer={
          <>
            <button onClick={() => setCreating(false)} className="btn-secondary">Cancel</button>
            <button onClick={createDecision} className="btn-primary">Create</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Decision title</label>
            <input
              autoFocus
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="input"
              placeholder="e.g. Choose between two internship offers"
            />
          </div>
          <div>
            <label className="label">Brief description (optional)</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              className="input min-h-[80px] resize-y"
              placeholder="What does the family need to decide, and why now?"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DecisionDetail({
  decision, onUpdate, onClose,
}: {
  decision: Decision;
  onUpdate: (patch: Partial<Decision>) => void;
  onClose: () => void;
}) {
  const [newOption, setNewOption] = useState<Partial<DecisionOption>>({ name: '', pros: '', cons: '', estimatedCost: '', risks: '' });
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [addingOption, setAddingOption] = useState(false);

  const addOption = () => {
    if (!newOption.name?.trim()) return;
    onUpdate({ options: [...decision.options, { id: uid(), name: newOption.name, pros: newOption.pros ?? '', cons: newOption.cons ?? '', estimatedCost: newOption.estimatedCost ?? '', risks: newOption.risks ?? '' }] });
    setNewOption({ name: '', pros: '', cons: '', estimatedCost: '', risks: '' });
    setAddingOption(false);
  };

  const addComment = () => {
    if (!newComment.text.trim()) return;
    onUpdate({ comments: [...decision.comments, { id: uid(), author: newComment.author.trim() || 'Family member', text: newComment.text.trim(), timestamp: Date.now() }] });
    setNewComment({ author: '', text: '' });
  };

  return (
    <div className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm flex items-stretch justify-center animate-fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full max-w-5xl m-2 sm:m-4 rounded-2xl shadow-soft-lg overflow-hidden flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-navy-900 truncate">{decision.title}</h2>
            <p className="text-xs text-slate-500 truncate">{decision.description}</p>
          </div>
          <button onClick={onClose} className="btn-ghost !px-2 text-slate-400 hover:text-navy-700" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Status:</span>
            <select
              value={decision.status}
              onChange={(e) => onUpdate({ status: e.target.value as Decision['status'] })}
              className="text-xs rounded-lg border border-slate-200 px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-navy-400/40"
            >
              <option value="discussing">Discussing</option>
              <option value="decided">Decided</option>
              <option value="review">Review later</option>
            </select>
          </div>

          {/* Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PriorityBox
              title="Student priorities & concerns"
              tone="navy"
              value={decision.studentPriorities}
              onChange={(v) => onUpdate({ studentPriorities: v })}
            />
            <PriorityBox
              title="Family priorities & concerns"
              tone="teal"
              value={decision.familyPriorities}
              onChange={(v) => onUpdate({ familyPriorities: v })}
            />
          </div>

          {/* Criteria */}
          <Card>
            <CardHeader title="Criteria & importance" subtitle="Rate each criterion 1 (low) – 5 (high)" icon={<Scale size={16} />} />
            <CardBody className="space-y-2">
              {decision.criteria.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <input
                    value={c.name}
                    onChange={(e) => onUpdate({ criteria: decision.criteria.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x) })}
                    className="input flex-1"
                  />
                  <input
                    type="range" min={1} max={5} value={c.importance}
                    onChange={(e) => onUpdate({ criteria: decision.criteria.map((x) => x.id === c.id ? { ...x, importance: parseInt(e.target.value) } : x) })}
                    className="flex-1 accent-navy-600"
                  />
                  <span className="text-sm font-semibold text-navy-700 w-6 text-center">{c.importance}</span>
                  <button
                    onClick={() => onUpdate({ criteria: decision.criteria.filter((x) => x.id !== c.id) })}
                    className="text-slate-400 hover:text-rose-500"
                  ><Trash2 size={15} /></button>
                </div>
              ))}
              <button
                onClick={() => onUpdate({ criteria: [...decision.criteria, { id: uid(), name: 'New criterion', importance: 3 }] })}
                className="btn-ghost text-xs !px-2"
              ><Plus size={13} /> Add criterion</button>
            </CardBody>
          </Card>

          {/* Options comparison */}
          <Card>
            <CardHeader
              title="Options to compare"
              subtitle="Add pros, cons, estimated cost, and risks for each"
              icon={<Scale size={16} />}
              action={<button onClick={() => setAddingOption(true)} className="btn-secondary text-xs !px-3 !py-1.5"><Plus size={13} /> Add option</button>}
            />
            <CardBody>
              {decision.options.length === 0 ? (
                <EmptyState title="No options yet" description="Add at least two options to compare them side by side." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {decision.options.map((o) => (
                    <div key={o.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-sm font-semibold text-navy-900">{o.name}</p>
                        <button onClick={() => onUpdate({ options: decision.options.filter((x) => x.id !== o.id) })} className="text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                      </div>
                      <OptionField label="Pros" icon={<ThumbsUp size={13} className="text-emerald-500" />} value={o.pros} onChange={(v) => onUpdate({ options: decision.options.map((x) => x.id === o.id ? { ...x, pros: v } : x) })} />
                      <OptionField label="Cons" icon={<ThumbsDown size={13} className="text-rose-500" />} value={o.cons} onChange={(v) => onUpdate({ options: decision.options.map((x) => x.id === o.id ? { ...x, cons: v } : x) })} />
                      <OptionField label="Estimated cost" icon={<span className="text-xs">Rs.</span>} value={o.estimatedCost} onChange={(v) => onUpdate({ options: decision.options.map((x) => x.id === o.id ? { ...x, estimatedCost: v } : x) })} />
                      <OptionField label="Risks" icon={<AlertTriangle size={13} className="text-amber-500" />} value={o.risks} onChange={(v) => onUpdate({ options: decision.options.map((x) => x.id === o.id ? { ...x, risks: v } : x) })} />
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Tentative decision */}
          <Card>
            <CardHeader title="Tentative decision & reasons" subtitle="Record what you're leaning toward and why — you can change it later" icon={<CheckCircle2 size={16} />} />
            <CardBody className="space-y-3">
              <input
                value={decision.tentativeDecision || ''}
                onChange={(e) => onUpdate({ tentativeDecision: e.target.value })}
                className="input"
                placeholder="e.g. We're leaning towards staying in the hostel for one more year."
              />
              <textarea
                value={decision.decisionReason || ''}
                onChange={(e) => onUpdate({ decisionReason: e.target.value })}
                className="input min-h-[70px] resize-y"
                placeholder="Why? Reference cost, study environment, family input, and trade-offs."
              />
            </CardBody>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader title="Discussion notes" subtitle="Comments from family members" icon={<MessageSquare size={16} />} />
            <CardBody className="space-y-3">
              {decision.comments.length === 0 ? (
                <p className="text-sm text-slate-500">No comments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {decision.comments.map((c) => (
                    <li key={c.id} className="rounded-xl bg-slate-50 px-3.5 py-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-navy-700">{c.author}</p>
                        <button onClick={() => onUpdate({ comments: decision.comments.filter((x) => x.id !== c.id) })} className="text-slate-400 hover:text-rose-500"><Trash2 size={13} /></button>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{c.text}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                <input
                  value={newComment.author}
                  onChange={(e) => setNewComment((c) => ({ ...c, author: e.target.value }))}
                  className="input"
                  placeholder="Your name"
                />
                <input
                  value={newComment.text}
                  onChange={(e) => setNewComment((c) => ({ ...c, text: e.target.value }))}
                  className="input sm:col-span-2"
                  placeholder="Add a comment…"
                  onKeyDown={(e) => { if (e.key === 'Enter') addComment(); }}
                />
              </div>
              <button onClick={addComment} className="btn-secondary text-sm"><MessageSquare size={14} /> Add comment</button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function OptionField({ label, icon, value, onChange }: { label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-2">
      <label className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">{icon} {label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="input !py-2 min-h-[44px] text-xs resize-y" />
    </div>
  );
}

function PriorityBox({ title, tone, value, onChange }: { title: string; tone: 'navy' | 'teal'; value: string; onChange: (v: string) => void }) {
  const toneCls = tone === 'navy' ? 'bg-navy-50/50 border-navy-100' : 'bg-teal-50/40 border-teal-100';
  return (
    <div className={`rounded-xl border ${toneCls} p-4`}>
      <p className="text-sm font-semibold text-navy-800 mb-2">{title}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input min-h-[80px] resize-y bg-white"
        placeholder="What matters most to this person? What are they worried about?"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: Decision['status'] }) {
  if (status === 'decided') return <Badge color="emerald"><CheckCircle2 size={12} /> Decided</Badge>;
  if (status === 'review') return <Badge color="slate">Review later</Badge>;
  return <Badge color="amber"><Pencil size={12} /> Discussing</Badge>;
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
