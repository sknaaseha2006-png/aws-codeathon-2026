import type { CostInputs, Scenario } from '@/types';

export interface CostBreakdown {
  annual: number;
  total: number;
  afterScholarshipAnnual: number;
  afterScholarshipTotal: number;
  annualBudget: number;
  budgetDiffAnnual: number;
  budgetDiffTotal: number;
  overBudget: boolean;
  categories: { name: string; value: number; key: string }[];
  scholarship: number;
  durationYears: number;
}

export function computeCost(c: CostInputs): CostBreakdown {
  const safe = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
  const tuition = safe(c.annualTuition);
  const accommodation = safe(c.accommodation);
  const transport = safe(c.transport);
  const books = safe(c.books);
  const other = safe(c.other);
  const scholarship = safe(c.scholarship);
  const years = Math.max(1, Math.min(8, Number.isFinite(c.durationYears) ? Math.round(c.durationYears) : 1));
  const annualBudget = safe(c.annualBudget);

  const annual = tuition + accommodation + transport + books + other;
  const total = annual * years;
  const afterScholarshipAnnual = Math.max(0, annual - scholarship);
  const afterScholarshipTotal = afterScholarshipAnnual * years;
  const budgetDiffAnnual = annualBudget - afterScholarshipAnnual;
  const budgetDiffTotal = annualBudget * years - afterScholarshipTotal;

  return {
    annual,
    total,
    afterScholarshipAnnual,
    afterScholarshipTotal,
    annualBudget,
    budgetDiffAnnual,
    budgetDiffTotal,
    overBudget: afterScholarshipAnnual > annualBudget,
    categories: [
      { name: 'Tuition', value: tuition, key: 'tuition' },
      { name: 'Accommodation', value: accommodation, key: 'accommodation' },
      { name: 'Transport', value: transport, key: 'transport' },
      { name: 'Books & Resources', value: books, key: 'books' },
      { name: 'Other', value: other, key: 'other' },
    ],
    scholarship,
    durationYears: years,
  };
}

export interface ScenarioCost {
  annual: number;
  total: number;
  afterScholarshipAnnual: number;
  afterScholarshipTotal: number;
  perYearLearning: number;
}

export function computeScenarioCost(s: Scenario): ScenarioCost {
  const tuition = Math.max(0, s.tuition || 0);
  const accommodation = Math.max(0, s.accommodation || 0);
  const scholarship = Math.max(0, s.scholarship || 0);
  const years = Math.max(1, Math.min(8, Math.round(s.durationYears) || 1));
  const annual = tuition + accommodation;
  const afterScholarshipAnnual = Math.max(0, annual - scholarship);
  return {
    annual,
    total: annual * years,
    afterScholarshipAnnual,
    afterScholarshipTotal: afterScholarshipAnnual * years,
    perYearLearning: Math.max(0, s.learningHours || 0) * 52,
  };
}

export function formatINR(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return 'Rs. ' + Math.round(n).toLocaleString('en-IN');
}
