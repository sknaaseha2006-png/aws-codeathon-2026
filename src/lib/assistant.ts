import type { AppState } from '@/types';
import { computeCost, formatINR } from './calc';

export interface AssistantReply {
  content: string;
  followups?: string[];
}

interface Intent {
  id: string;
  match: (q: string) => boolean;
  respond: (q: string, state: AppState) => AssistantReply;
}

const has = (q: string, ...words: string[]) =>
  words.some((w) => q.includes(w));

const intents: Intent[] = [
  {
    id: 'budget',
    match: (q) => has(q, 'budget', 'cost', 'fee', 'fees', 'expense', 'afford', 'money', 'finance', 'financial'),
    respond: (_q, state) => {
      const c = computeCost(state.costs);
      const over = c.overBudget;
      return {
        content: `Here's a quick picture based on your current Cost Planner inputs:

• Estimated annual expense (before scholarship): ${formatINR(c.annual)}
• Scholarship / assistance entered: ${formatINR(c.scholarship)}
• Estimated annual expense after scholarship: ${formatINR(c.afterScholarshipAnnual)}
• Estimated total over ${c.durationYears} years: ${formatINR(c.afterScholarshipTotal)}
• Your annual family budget: ${formatINR(c.annualBudget)}
• Budget difference (per year): ${over ? 'short by' : 'surplus of'} ${formatINR(Math.abs(c.budgetDiffAnnual))}

${over
  ? "Your current estimates exceed the family budget. A few options to consider together: increase scholarship search, reduce accommodation or transport costs, or revisit the duration plan. Open the Cost Planner to adjust numbers."
  : "Your estimates fit within the family budget. It's still wise to keep a buffer for unexpected expenses and verify all figures with your institution."}

Would you like me to suggest a few questions to discuss with your family, or help compare two study arrangements in the What-If Simulator?`,
        followups: [
          'What questions should we discuss about the budget?',
          'Compare hostel vs day-scholar costs',
          'How can we reduce education costs?',
        ],
      };
    },
  },
  {
    id: 'skills',
    match: (q) => has(q, 'skill', 'learn', 'study', 'practice', 'improve', 'software', 'developer', 'coding', 'program'),
    respond: (_q, state) => {
      const dir = state.profile.careerDirection || 'software development';
      return {
        content: `For a pathway toward ${dir}, a sensible skill plan looks like this:

1. Strengthen fundamentals — Data Structures, Algorithms, and one language you already know (${state.skills[0]?.name || 'e.g. Python'}).
2. Build small projects weekly with your available ${state.profile.weeklyLearningHours} hrs/week.
3. Add version control (Git) and one deployment basics topic (e.g. basic cloud / hosting).
4. Practice consistent problem-solving on a platform of your choice.
5. Add communication and teamwork through group projects or campus clubs.

Trade-offs: spending more time on skills can reduce academic study time, so plan a weekly balance. The Career & Skills Navigator has detailed pathways and a checklist you can edit.

Want me to open the Career Navigator, or suggest a weekly time split between academics and skills?`,
        followups: [
          'Suggest a weekly time split',
          'Open the Career Navigator',
          'Which skills matter most for placements?',
        ],
      };
    },
  },
  {
    id: 'compare-options',
    match: (q) => has(q, 'compare', 'two options', 'hostel', 'day-scholar', 'arrangement', 'choose between'),
    respond: (_q, state) => {
      const d = state.decisions[0];
      return {
        content: `Comparing two education options works best when you look at both numbers and lived experience. A good approach:

1. List 3–5 criteria that matter to both student and family (cost, study environment, family involvement, commute, safety).
2. Rate each criterion's importance (1–5) — don't average them blindly.
3. For each option, write pros, cons, estimated cost, and risks.
4. Talk through the trade-offs out loud — subjective factors matter.

${d ? `You already have a decision in your workspace: "${d.title}". Open the Family Decision Workspace to review or update it.` : 'Open the Family Decision Workspace to start one — I have included a sample decision you can edit.'}

For cost-only comparisons, the What-If Simulator lets you compare 2–3 plans side by side.`,
        followups: [
          'Open the Family Decision Workspace',
          'Open the What-If Simulator',
          'What criteria should we use?',
        ],
      };
    },
  },
  {
    id: 'balance',
    match: (q) => has(q, 'balance', 'academic', 'cgpa', 'grade', 'performance', 'gpa'),
    respond: (_q, state) => {
      const gap = Math.max(0, state.profile.targetCgpa - state.profile.cgpa);
      return {
        content: `Balancing academics with skill development is a common challenge. Here's a structured approach:

• Your current CGPA is ${state.profile.cgpa} with a target of ${state.profile.targetCgpa} — a gap of ${gap.toFixed(1)} points.
• Treat academics as the non-negotiable base: allocate fixed daily slots for coursework and revision.
• Use ${state.profile.weeklyLearningHours} hrs/week for skills mostly on weekends and lighter academic days.
• Avoid skill work in the two weeks before exams; ramp up skill work during lighter weeks.
• Track both in My Action Plan so neither is forgotten.

A simple rule: academics first in the day, skills in the evening, one full rest day weekly to avoid burnout. Want me to add a balanced weekly plan to your Action Plan?`,
        followups: [
          'Add a balanced weekly plan',
          'Open My Action Plan',
          'How do I improve my CGPA?',
        ],
      };
    },
  },
  {
    id: 'family-discussion',
    match: (q) => has(q, 'family', 'parent', 'parents', 'discuss', 'conversation', 'talk', 'mother', 'father'),
    respond: () => ({
      content: `Before choosing a career pathway, families benefit from discussing these questions together:

1. What does the student enjoy and persist at — not just what sounds prestigious?
2. What are the realistic costs for the chosen pathway, and is the family comfortable with them?
3. What placement and internship support does the institution actually provide?
4. Is there a backup plan if the first choice doesn't work out?
5. How will the family stay involved without pressuring the student?

Use the Family Decision Workspace to record each person's priorities separately — this keeps the conversation respectful and visible. Avoid treating it as a debate to win; the goal is a shared, informed choice.

Want me to create a decision template for your family to fill in?`,
      followups: [
        'Create a family decision template',
        'Open the Family Workspace',
        'What if parents and student disagree?',
      ],
    }),
  },
  {
    id: 'career-path',
    match: (q) => has(q, 'career', 'job', 'future', 'pathway', 'path', 'profession', 'placement', 'internship'),
    respond: (_q, state) => ({
      content: `Career planning works best in small, verifiable steps rather than big leaps. Based on your interest in ${state.profile.careerDirection}:

• Short term (this semester): strengthen one core skill and build one small project.
• Medium term (6–12 months): complete a portfolio of 2–3 projects; apply to internships early.
• Long term: specialize based on what you genuinely enjoy doing day-to-day.

Important: career guidance is general direction, not a guarantee of jobs, salaries, or placements. Always verify placement statistics with your institution's official records.

The Career & Skills Navigator has editable pathways for software, data, cybersecurity, cloud, and electronics. Want me to open it?`,
      followups: [
        'Open the Career Navigator',
        'How do I prepare for internships?',
        'Which pathway suits my branch?',
      ],
    }),
  },
  {
    id: 'scenario',
    match: (q) => has(q, 'scenario', 'what-if', 'what if', 'simulator', 'compare plans'),
    respond: () => ({
      content: `The What-If Simulator lets you compare 2–3 education plans by changing expenses, accommodation, scholarship assumptions, learning time, and career priorities.

For each scenario you'll see estimated total cost, budget difference, advantages, trade-offs, and questions to discuss as a family. You can save any scenario to the Family Decision Workspace for further review.

A good starting point: compare your current plan against a "lower cost + more skill time" alternative — that often surfaces the real trade-off between money and career preparation.`,
      followups: [
        'Open the What-If Simulator',
        'What should I change in a scenario?',
        'How do I save a scenario?',
      ],
    }),
  },
  {
    id: 'reset',
    match: (q) => has(q, 'reset', 'restart', 'start over', 'clear'),
    respond: () => ({
      content: `You can reset all demonstration data using the "Reset demo data" button at the bottom of the sidebar. This clears your profile, costs, tasks, skills, decisions, scenarios, and chat history, and restores the original sample data.`,
    }),
  },
];

const fallback: Intent = {
  id: 'fallback',
  match: () => true,
  respond: (q) => ({
    content: `I'm a demo education-planning assistant (transparent fallback mode — no live language model is connected in this environment). I can help with:

• Planning your engineering education budget
• Choosing skills for a career direction
• Comparing two education options as a family
• Balancing academics with skill development
• Preparing questions for a family discussion
• Exploring career pathways and scenarios

You asked: "${q.slice(0, 120)}". Try one of the suggestions below, or rephrase using words like budget, skills, career, compare, or family.`,
    followups: [
      'How can we plan our education budget?',
      'Which skills should I learn for software development?',
      'How should my family compare two education options?',
      'How can I balance academics with skill development?',
      'What should we discuss before choosing a career pathway?',
    ],
  }),
};

export function generateReply(question: string, state: AppState): AssistantReply {
  const q = question.toLowerCase().trim();
  for (const intent of intents) {
    if (intent.match(q)) return intent.respond(q, state);
  }
  return fallback.respond(q, state);
}

export const QUICK_PROMPTS = [
  'How can we plan our engineering education budget?',
  'Which skills should I learn for a software development career?',
  'How should my family compare two education options?',
  'How can I balance academic performance with skill development?',
  'What should we discuss before choosing a career pathway?',
];
