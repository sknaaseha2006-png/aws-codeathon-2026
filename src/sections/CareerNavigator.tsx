import { useState } from 'react';
import { Compass, Plus, Trash2, CheckCircle2, Circle, Target, Clock, BookOpen, Briefcase } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardBody, Badge, Disclaimer, EmptyState, Modal } from '@/components/ui';
import type { SkillItem } from '@/types';

interface Pathway {
  id: string;
  name: string;
  tagline: string;
  why: string;
  skills: string[];
  steps: string[];
  projects: string[];
  milestones: { name: string; weeks: number }[];
}

const PATHWAYS: Pathway[] = [
  {
    id: 'software',
    name: 'Software Development',
    tagline: 'Build applications and pursue full-stack or backend engineering roles.',
    why: 'A strong fit if you enjoy building things, solving logic problems, and seeing your work used by people. High internship availability in most engineering colleges.',
    skills: ['Data Structures & Algorithms', 'One language (Python/Java/C++)', 'Git & GitHub', 'Web basics (HTML/CSS/JS)', 'Databases (SQL)', 'REST APIs', 'Testing basics'],
    steps: [
      'Pick one language and revise fundamentals until comfortable.',
      'Solve 2–3 easy problems daily on a coding platform.',
      'Build one small project (e.g. to-do app, calculator) end-to-end.',
      'Learn Git: commit, branch, push, pull-request flow.',
      'Add a second project that connects to a database and an API.',
    ],
    projects: ['Personal portfolio website', 'Weather app using a public API', 'Simple blog with login and database', 'CLI tool that organizes your files'],
    milestones: [
      { name: 'Fundamentals solid', weeks: 4 },
      { name: 'First project shipped', weeks: 6 },
      { name: 'Portfolio of 3 projects', weeks: 16 },
      { name: 'Internship-ready', weeks: 24 },
    ],
  },
  {
    id: 'data',
    name: 'Data & AI',
    tagline: 'Analyze data and build models for insights and predictions.',
    why: 'A good fit if you enjoy math, statistics, and finding patterns. Useful across many industries, not only tech companies.',
    skills: ['Python', 'Pandas & NumPy', 'Statistics basics', 'SQL', 'Data visualization', 'Intro ML (scikit-learn)', 'Notebooks (Jupyter)'],
    steps: [
      'Strengthen Python and basic statistics.',
      'Learn Pandas for cleaning and exploring datasets.',
      'Practice with public datasets (e.g. Kaggle beginner sets).',
      'Build visualizations that tell a clear story.',
      'Try one supervised ML model end-to-end.',
    ],
    projects: ['EDA on a public dataset', 'Dashboard for your college attendance data', 'Simple house-price predictor', 'Sentiment analysis on product reviews'],
    milestones: [
      { name: 'Pandas comfortable', weeks: 4 },
      { name: 'First EDA notebook', weeks: 6 },
      { name: 'ML model trained', weeks: 14 },
      { name: 'Data portfolio ready', weeks: 22 },
    ],
  },
  {
    id: 'cyber',
    name: 'Cybersecurity',
    tagline: 'Protect systems and learn offensive/defensive security basics.',
    why: 'A good fit if you are curious about how systems break and like attention to detail. Growing demand, but requires continuous learning.',
    skills: ['Networking fundamentals', 'Linux basics', 'Bash/Python scripting', 'Web security (OWASP Top 10)', 'Cryptography basics', 'Tools (Nmap, Burp Suite)'],
    steps: [
      'Learn Linux command line and networking basics.',
      'Understand the OWASP Top 10 web vulnerabilities.',
      'Set up a safe lab (VMs) and practice on legal platforms.',
      'Try a beginner CTF (capture the flag) competition.',
      'Pick a specialization: offensive, defensive, or cloud security.',
    ],
    projects: ['Build a basic port scanner', 'Audit a deliberately vulnerable app', 'Write a small intrusion-detection script', 'Document a CTF writeup'],
    milestones: [
      { name: 'Networking + Linux solid', weeks: 5 },
      { name: 'First CTF completed', weeks: 10 },
      { name: 'Specialization chosen', weeks: 16 },
      { name: 'Security portfolio', weeks: 26 },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    tagline: 'Deploy and manage applications on cloud platforms.',
    why: 'A good fit if you enjoy infrastructure, automation, and reliability. Strong demand and a practical path for students from any engineering branch.',
    skills: ['Linux', 'Networking basics', 'One cloud (AWS/Azure/GCP)', 'Containers (Docker)', 'CI/CD basics', 'Infrastructure as code basics'],
    steps: [
      'Learn Linux and basic networking.',
      'Pick one cloud provider and complete their free tier basics.',
      'Learn Docker: build and run containers locally.',
      'Deploy a small app to the cloud manually.',
      'Automate deployment with a simple CI/CD pipeline.',
    ],
    projects: ['Host a static site on cloud storage', 'Containerize a small app', 'Set up CI/CD for a GitHub project', 'Deploy a small app with a database'],
    milestones: [
      { name: 'Cloud basics done', weeks: 4 },
      { name: 'First app deployed', weeks: 8 },
      { name: 'CI/CD working', weeks: 14 },
      { name: 'Cloud portfolio', weeks: 22 },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & Embedded',
    tagline: 'Work with hardware, microcontrollers, and IoT systems.',
    why: 'A strong fit for ECE/EEE students who like hands-on work and bridging hardware with software. Useful in automotive, IoT, and robotics.',
    skills: ['C / C++', 'Digital electronics', 'Microcontrollers (Arduino/ESP32)', 'Sensors & actuators', 'Basic PCB design', 'Communication protocols (I2C, SPI, UART)'],
    steps: [
      'Revise digital electronics and C programming.',
      'Get an Arduino or ESP32 starter kit.',
      'Build small circuits: blink LED, read a sensor.',
      'Interface sensors and send data to a laptop or cloud.',
      'Try one mini IoT project end-to-end.',
    ],
    projects: ['Temperature monitor with display', 'Smart light controlled over Wi-Fi', 'Simple obstacle-avoiding robot', 'Home air-quality logger'],
    milestones: [
      { name: 'Arduino basics', weeks: 3 },
      { name: 'Sensor interfacing', weeks: 6 },
      { name: 'Connected IoT project', weeks: 14 },
      { name: 'Embedded portfolio', weeks: 24 },
    ],
  },
];

export function CareerNavigator() {
  const { state, addSkill, updateSkill, deleteSkill } = useStore();
  const [selected, setSelected] = useState<Pathway>(PATHWAYS[0]);
  const [addingSkill, setAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState<{ name: string; level: SkillItem['level'] }>({ name: '', level: 'beginner' });
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleSkillCheck = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const addNewSkill = () => {
    if (!newSkill.name.trim()) return;
    addSkill({ name: newSkill.name.trim(), level: newSkill.level });
    setNewSkill({ name: '', level: 'beginner' });
    setAddingSkill(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Career & Skills Navigator"
        subtitle="Explore engineering career pathways, edit your skills, and follow beginner-friendly milestones."
        icon={<Compass size={18} />}
      />

      <Disclaimer>
        Career guidance here is general direction, not a personalized professional assessment. We do not guarantee jobs, salaries, placements, or admission outcomes. Verify placement statistics with your institution's official records.
      </Disclaimer>

      {/* Profile summary */}
      <Card>
        <CardHeader title="Your career direction" icon={<Target size={16} />} />
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCell label="Branch" value={state.profile.branch} />
            <InfoCell label="Career direction" value={state.profile.careerDirection} />
            <InfoCell label="Weekly learning time" value={`${state.profile.weeklyLearningHours} hrs`} />
            <InfoCell label="Interests" value={state.profile.interests.join(', ')} />
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pathway list */}
        <Card className="lg:col-span-1">
          <CardHeader title="Pathways" subtitle="Choose one to explore" icon={<Briefcase size={16} />} />
          <CardBody className="!pt-2 space-y-1.5">
            {PATHWAYS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full text-left rounded-xl px-3.5 py-3 transition-all ${
                  selected.id === p.id
                    ? 'bg-navy-600 text-white shadow-sm'
                    : 'hover:bg-slate-50 text-navy-800'
                }`}
              >
                <p className="text-sm font-semibold">{p.name}</p>
                <p className={`text-xs mt-0.5 ${selected.id === p.id ? 'text-white/70' : 'text-slate-500'}`}>
                  {p.tagline}
                </p>
              </button>
            ))}
          </CardBody>
        </Card>

        {/* Pathway detail */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title={selected.name} subtitle={selected.tagline} />
            <CardBody className="space-y-5">
              <div className="rounded-xl bg-navy-50/60 border border-navy-100 px-4 py-3">
                <p className="text-xs font-semibold text-navy-700 mb-1">Why this may fit</p>
                <p className="text-sm text-navy-800 leading-relaxed">{selected.why}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy-800 mb-2">Relevant skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills.map((s) => (
                    <Badge key={s} color="navy">{s}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy-800 mb-2">Beginner-friendly steps</p>
                <ol className="space-y-2">
                  {selected.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold shrink-0">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-navy-800 mb-2">Example projects</p>
                  <ul className="space-y-1.5">
                    {selected.projects.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                        <BookOpen size={14} className="text-slate-400 mt-0.5 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy-800 mb-2">Suggested milestones</p>
                  <ul className="space-y-1.5">
                    {selected.milestones.map((m) => (
                      <li key={m.name} className="flex items-center justify-between text-sm text-slate-700">
                        <span className="flex items-center gap-2"><Clock size={14} className="text-slate-400" /> {m.name}</span>
                        <Badge color="slate">{m.weeks}w</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Skills checklist */}
          <Card>
            <CardHeader title="Your skills checklist" subtitle="Track skills you're practicing"
              icon={<CheckCircle2 size={16} />}
              action={<button onClick={() => setAddingSkill(true)} className="btn-secondary text-xs !px-3 !py-1.5"><Plus size={13} /> Add skill</button>}
            />
            <CardBody className="!pt-2">
              {state.skills.length === 0 ? (
                <EmptyState title="No skills yet" description="Add a skill you're currently learning or want to practice." />
              ) : (
                <ul className="space-y-1.5">
                  {state.skills.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 group">
                      <button onClick={() => toggleSkillCheck(s.id)} className="shrink-0" aria-label="Toggle">
                        {checked[s.id] ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${checked[s.id] ? 'line-through text-slate-400' : 'text-navy-800'}`}>{s.name}</p>
                      </div>
                      <select
                        value={s.level}
                        onChange={(e) => updateSkill(s.id, { level: e.target.value as SkillItem['level'] })}
                        className="text-xs rounded-lg border border-slate-200 px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-navy-400/40"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                      <button onClick={() => deleteSkill(s.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={addingSkill}
        onClose={() => setAddingSkill(false)}
        title="Add a skill"
        footer={
          <>
            <button onClick={() => setAddingSkill(false)} className="btn-secondary">Cancel</button>
            <button onClick={addNewSkill} className="btn-primary">Add skill</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Skill name</label>
            <input
              autoFocus
              value={newSkill.name}
              onChange={(e) => setNewSkill((s) => ({ ...s, name: e.target.value }))}
              className="input"
              placeholder="e.g. JavaScript, SQL, Docker"
            />
          </div>
          <div>
            <label className="label">Current level</label>
            <select
              value={newSkill.level}
              onChange={(e) => setNewSkill((s) => ({ ...s, level: e.target.value as SkillItem['level'] }))}
              className="input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </Modal>
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

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3.5 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-navy-800 mt-0.5">{value}</p>
    </div>
  );
}
