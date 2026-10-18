export type SectionId =
  | 'welcome'
  | 'dashboard'
  | 'assistant'
  | 'cost'
  | 'career'
  | 'family'
  | 'simulator'
  | 'plan';

export interface StudentProfile {
  name: string;
  branch: string;
  year: string;
  semester: string;
  interests: string[];
  careerDirection: string;
  weeklyLearningHours: number;
  cgpa: number;
  targetCgpa: number;
  familyPriority: string;
}

export interface CostInputs {
  annualTuition: number;
  accommodation: number;
  transport: number;
  books: number;
  other: number;
  scholarship: number;
  durationYears: number;
  annualBudget: number;
}

export interface Task {
  id: string;
  title: string;
  category: 'education' | 'finance' | 'family' | 'career';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  completed: boolean;
  notes?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface DecisionOption {
  id: string;
  name: string;
  pros: string;
  cons: string;
  estimatedCost: string;
  risks: string;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  status: 'discussing' | 'decided' | 'review';
  studentPriorities: string;
  familyPriorities: string;
  criteria: { id: string; name: string; importance: number }[];
  options: DecisionOption[];
  comments: { id: string; author: string; text: string; timestamp: number }[];
  tentativeDecision?: string;
  decisionReason?: string;
  createdAt: number;
}

export interface Scenario {
  id: string;
  name: string;
  tuition: number;
  accommodation: number;
  scholarship: number;
  learningHours: number;
  careerPriority: string;
  durationYears: number;
}

export interface AppState {
  profile: StudentProfile;
  costs: CostInputs;
  tasks: Task[];
  skills: SkillItem[];
  chat: ChatMessage[];
  decisions: Decision[];
  scenarios: Scenario[];
  savedScenarioIds: string[];
  initialized: boolean;
}
