import type {
  AppState,
  StudentProfile,
  CostInputs,
  Task,
  SkillItem,
  ChatMessage,
  Decision,
  Scenario,
} from '@/types';

const STORAGE_KEY = 'edufamily-compass-v1';

export const defaultProfile: StudentProfile = {
  name: 'Aarav Sharma',
  branch: 'Computer Science & Engineering',
  year: '2nd Year',
  semester: 'Semester 3',
  interests: ['Software Development', 'Artificial Intelligence', 'Web Apps'],
  careerDirection: 'Software Developer',
  weeklyLearningHours: 12,
  cgpa: 8.2,
  targetCgpa: 9.0,
  familyPriority: 'Affordable education with strong placement prospects',
};

export const defaultCosts: CostInputs = {
  annualTuition: 140000,
  accommodation: 68000,
  transport: 22000,
  books: 14000,
  other: 18000,
  scholarship: 25000,
  durationYears: 4,
  annualBudget: 220000,
};

const sampleTasks: Task[] = [
  {
    id: 't1',
    title: 'Complete Data Structures assignment',
    category: 'education',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    completed: false,
  },
  {
    id: 't2',
    title: 'Discuss annual budget with family',
    category: 'family',
    priority: 'high',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
    completed: false,
  },
  {
    id: 't3',
    title: 'Research scholarship eligibility for Semester 4',
    category: 'finance',
    priority: 'medium',
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
    completed: false,
  },
  {
    id: 't4',
    title: 'Build a small React portfolio project',
    category: 'career',
    priority: 'medium',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    completed: false,
  },
  {
    id: 't5',
    title: 'Attend campus coding club workshop',
    category: 'career',
    priority: 'low',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    completed: true,
  },
];

const sampleSkills: SkillItem[] = [
  { id: 's1', name: 'Python', level: 'intermediate' },
  { id: 's2', name: 'C Programming', level: 'intermediate' },
  { id: 's3', name: 'HTML & CSS', level: 'beginner' },
  { id: 's4', name: 'Data Structures', level: 'beginner' },
  { id: 's5', name: 'Git', level: 'beginner' },
];

const sampleChat: ChatMessage[] = [];

const sampleDecisions: Decision[] = [
  {
    id: 'd1',
    title: 'Compare hostel stay vs. day-scholar arrangement',
    description:
      'We are deciding whether Aarav should continue staying in the college hostel or switch to a day-scholar arrangement (living at home and commuting). This affects cost, study time, and family involvement.',
    status: 'discussing',
    studentPriorities:
      'Closer access to campus labs and peer study groups; independence; less travel fatigue.',
    familyPriorities:
      'Lower overall cost; safer environment; more family oversight on academics and health.',
    criteria: [
      { id: 'c1', name: 'Monthly cost', importance: 4 },
      { id: 'c2', name: 'Study environment', importance: 5 },
      { id: 'c3', name: 'Family involvement', importance: 3 },
      { id: 'c4', name: 'Commute time', importance: 3 },
    ],
    options: [
      {
        id: 'o1',
        name: 'Stay in college hostel',
        pros: 'Closer to labs and library; peer study groups; structured mess; saves commute time.',
        cons: 'Higher accommodation cost; less daily family contact.',
        estimatedCost: 'Rs. 6,800 / month (approx.)',
        risks: 'Homesickness; adjustment to shared living.',
      },
      {
        id: 'o2',
        name: 'Day-scholar from home',
        pros: 'Lower cost; daily family support; home-cooked meals.',
        cons: 'Daily commute time and fatigue; less access to evening labs.',
        estimatedCost: 'Rs. 2,200 / month transport (approx.)',
        risks: 'Long travel may reduce study hours; weather/disruptions.',
      },
    ],
    comments: [
      {
        id: 'cm1',
        author: 'Mother',
        text: 'If hostel improves focus and lab access, the extra cost may be worth it for two more years.',
        timestamp: Date.now() - 2 * 86400000,
      },
      {
        id: 'cm2',
        author: 'Aarav',
        text: 'I can try day-scholar for one semester and we review results together.',
        timestamp: Date.now() - 1 * 86400000,
      },
    ],
    createdAt: Date.now() - 5 * 86400000,
  },
];

const sampleScenarios: Scenario[] = [
  {
    id: 'sc1',
    name: 'Hostel + Current Plan',
    tuition: 140000,
    accommodation: 68000,
    scholarship: 25000,
    learningHours: 12,
    careerPriority: 'Software Development',
    durationYears: 4,
  },
  {
    id: 'sc2',
    name: 'Day-scholar + More Skills',
    tuition: 140000,
    accommodation: 26000,
    scholarship: 25000,
    learningHours: 18,
    careerPriority: 'Data & AI',
    durationYears: 4,
  },
];

export const defaultState: AppState = {
  profile: defaultProfile,
  costs: defaultCosts,
  tasks: sampleTasks,
  skills: sampleSkills,
  chat: sampleChat,
  decisions: sampleDecisions,
  scenarios: sampleScenarios,
  savedScenarioIds: [],
  initialized: false,
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState, initialized: true };
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      profile: { ...defaultProfile, ...(parsed.profile || {}) },
      costs: { ...defaultCosts, ...(parsed.costs || {}) },
      initialized: true,
    } as AppState;
  } catch {
    return { ...defaultState, initialized: true };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors silently in demo
  }
}

export function resetState(): AppState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return { ...defaultState, initialized: true };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
