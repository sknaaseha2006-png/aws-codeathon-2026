import { useState } from 'react';
import {
  ListChecks, Plus, Trash2, Pencil, CheckCircle2, Circle, CalendarDays,
  Flag, Sparkles, X,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardBody, Badge, ProgressBar, EmptyState, Modal, Disclaimer } from '@/components/ui';
import type { Task } from '@/types';
import { uid } from '@/store/defaults';

const CATEGORIES: { id: Task['category']; label: string; color: 'navy' | 'teal' | 'amber' | 'rose' }[] = [
  { id: 'education', label: 'Education', color: 'navy' },
  { id: 'finance', label: 'Finance', color: 'teal' },
  { id: 'family', label: 'Family discussion', color: 'amber' },
  { id: 'career', label: 'Career', color: 'rose' },
];

const PRIORITY_COLOR: Record<Task['priority'], 'rose' | 'amber' | 'slate'> = {
  high: 'rose', medium: 'amber', low: 'slate',
};

export function ActionPlan() {
  const { state, addTask, updateTask, deleteTask, toggleTask } = useStore();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [draft, setDraft] = useState<Partial<Task>>({
    title: '', category: 'education', priority: 'medium', dueDate: new Date().toISOString().slice(0, 10), notes: '',
  });
  const [generating, setGenerating] = useState(false);

  const tasks = state.tasks;
  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const grouped = CATEGORIES.map((c) => ({
    ...c,
    items: tasks.filter((t) => t.category === c.id),
  }));

  const openNew = () => {
    setDraft({ title: '', category: 'education', priority: 'medium', dueDate: new Date().toISOString().slice(0, 10), notes: '' });
    setAdding(true);
  };

  const openEdit = (t: Task) => {
    setDraft(t);
    setEditing(t);
  };

  const save = () => {
    if (!draft.title?.trim()) return;
    if (editing) {
      updateTask(editing.id, { title: draft.title.trim(), category: draft.category, priority: draft.priority, dueDate: draft.dueDate, notes: draft.notes });
      setEditing(null);
    } else {
      addTask({ title: draft.title.trim(), category: draft.category!, priority: draft.priority!, dueDate: draft.dueDate!, notes: draft.notes });
      setAdding(false);
    }
  };

  const generateWeeklyPlan = () => {
    setGenerating(true);
    const base = Date.now();
    const plan: Omit<Task, 'id' | 'completed'>[] = [
      { title: 'Review this week\'s lecture notes (2 hrs)', category: 'education', priority: 'high', dueDate: new Date(base + 1 * 86400000).toISOString().slice(0, 10) },
      { title: 'Practice 5 coding problems', category: 'career', priority: 'medium', dueDate: new Date(base + 3 * 86400000).toISOString().slice(0, 10) },
      { title: 'Update cost planner with latest fee info', category: 'finance', priority: 'medium', dueDate: new Date(base + 4 * 86400000).toISOString().slice(0, 10) },
      { title: 'Share weekly progress with family', category: 'family', priority: 'medium', dueDate: new Date(base + 6 * 86400000).toISOString().slice(0, 10) },
      { title: 'Build one small project increment', category: 'career', priority: 'low', dueDate: new Date(base + 7 * 86400000).toISOString().slice(0, 10) },
    ];
    plan.forEach((p) => addTask(p));
    setTimeout(() => setGenerating(false), 400);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Action Plan"
        subtitle="Turn recommendations into trackable actions. Grouped by education, finance, family discussion, and career."
        icon={<ListChecks size={18} />}
      />

      {/* Progress + actions */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between mb-1.5">
              <p className="text-sm font-semibold text-navy-800">Overall progress</p>
              <p className="text-sm text-slate-500">{completed} of {total} done · {pct}%</p>
            </div>
            <ProgressBar value={pct} color="teal" />
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={generateWeeklyPlan} disabled={generating} className="btn-secondary text-sm">
              <Sparkles size={14} /> Suggest weekly plan
            </button>
            <button onClick={openNew} className="btn-primary text-sm">
              <Plus size={15} /> Add task
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Grouped tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {grouped.map((g) => (
          <Card key={g.id}>
            <CardHeader
              title={g.label}
              subtitle={`${g.items.filter((t) => !t.completed).length} pending · ${g.items.filter((t) => t.completed).length} done`}
              icon={<CategoryIcon category={g.id} />}
              action={<Badge color={g.color}>{g.items.length}</Badge>}
            />
            <CardBody className="!pt-2">
              {g.items.length === 0 ? (
                <EmptyState title={`No ${g.label.toLowerCase()} tasks`} description="Add a task in this category to get started." />
              ) : (
                <ul className="space-y-1">
                  {g.items.map((t) => (
                    <li key={t.id} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0 group">
                      <button onClick={() => toggleTask(t.id)} className="mt-0.5 shrink-0" aria-label="Toggle complete">
                        {t.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300 hover:text-navy-400" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${t.completed ? 'line-through text-slate-400' : 'text-navy-800'}`}>{t.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><CalendarDays size={11} /> {t.dueDate}</span>
                          <span className="flex items-center gap-1"><Flag size={11} /> {t.priority}</span>
                          {t.notes && <span className="truncate">· {t.notes}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(t)} className="text-slate-400 hover:text-navy-700" aria-label="Edit"><Pencil size={14} /></button>
                        <button onClick={() => deleteTask(t.id)} className="text-slate-400 hover:text-rose-500" aria-label="Delete"><Trash2 size={14} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <Disclaimer>
        Your tasks are saved in this browser only and persist across page refreshes. They are not synchronized to other devices or family members.
      </Disclaimer>

      <Modal
        open={adding || editing !== null}
        onClose={() => { setAdding(false); setEditing(null); }}
        title={editing ? 'Edit task' : 'Add a task'}
        footer={
          <>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="btn-secondary">Cancel</button>
            <button onClick={save} className="btn-primary">{editing ? 'Save changes' : 'Add task'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Task title</label>
            <input autoFocus value={draft.title || ''} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} className="input" placeholder="e.g. Submit scholarship application" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as Task['category'] }))} className="input">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select value={draft.priority} onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value as Task['priority'] }))} className="input">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Due date</label>
              <input type="date" value={draft.dueDate || ''} onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))} className="input" />
            </div>
            <div className="col-span-2">
              <label className="label">Notes (optional)</label>
              <input value={draft.notes || ''} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} className="input" placeholder="Any extra context" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CategoryIcon({ category }: { category: Task['category'] }) {
  const map: Record<Task['category'], React.ReactNode> = {
    education: <ListChecks size={16} />,
    finance: <span className="text-xs font-bold">Rs</span>,
    family: <span className="text-xs">F</span>,
    career: <Flag size={16} />,
  };
  return <>{map[category]}</>;
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
