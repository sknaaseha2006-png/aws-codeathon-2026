import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
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
import { loadState, saveState, resetState, uid } from './defaults';

interface StoreContextValue {
  state: AppState;
  setProfile: (p: Partial<StudentProfile>) => void;
  setCosts: (c: Partial<CostInputs>) => void;
  addTask: (t: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addSkill: (s: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, patch: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;
  addMessage: (m: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  addDecision: (d: Omit<Decision, 'id' | 'createdAt'>) => void;
  updateDecision: (id: string, patch: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;
  addScenario: (s: Omit<Scenario, 'id'>) => void;
  updateScenario: (id: string, patch: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  saveScenarioToDecisions: (id: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setProfile = useCallback((p: Partial<StudentProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
  }, []);

  const setCosts = useCallback((c: Partial<CostInputs>) => {
    setState((s) => ({ ...s, costs: { ...s.costs, ...c } }));
  }, []);

  const addTask = useCallback((t: Omit<Task, 'id' | 'completed'>) => {
    setState((s) => ({ ...s, tasks: [{ ...t, id: uid(), completed: false }, ...s.tasks] }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  }, []);

  const addSkill = useCallback((sk: Omit<SkillItem, 'id'>) => {
    setState((s) => ({ ...s, skills: [...s.skills, { ...sk, id: uid() }] }));
  }, []);

  const updateSkill = useCallback((id: string, patch: Partial<SkillItem>) => {
    setState((s) => ({
      ...s,
      skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...patch } : sk)),
    }));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setState((s) => ({ ...s, skills: s.skills.filter((sk) => sk.id !== id) }));
  }, []);

  const addMessage = useCallback((m: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setState((s) => ({
      ...s,
      chat: [...s.chat, { ...m, id: uid(), timestamp: Date.now() }],
    }));
  }, []);

  const clearChat = useCallback(() => {
    setState((s) => ({ ...s, chat: [] }));
  }, []);

  const addDecision = useCallback((d: Omit<Decision, 'id' | 'createdAt'>) => {
    setState((s) => ({
      ...s,
      decisions: [{ ...d, id: uid(), createdAt: Date.now() }, ...s.decisions],
    }));
  }, []);

  const updateDecision = useCallback((id: string, patch: Partial<Decision>) => {
    setState((s) => ({
      ...s,
      decisions: s.decisions.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  }, []);

  const deleteDecision = useCallback((id: string) => {
    setState((s) => ({ ...s, decisions: s.decisions.filter((d) => d.id !== id) }));
  }, []);

  const addScenario = useCallback((sc: Omit<Scenario, 'id'>) => {
    setState((s) => ({ ...s, scenarios: [...s.scenarios, { ...sc, id: uid() }] }));
  }, []);

  const updateScenario = useCallback((id: string, patch: Partial<Scenario>) => {
    setState((s) => ({
      ...s,
      scenarios: s.scenarios.map((sc) => (sc.id === id ? { ...sc, ...patch } : sc)),
    }));
  }, []);

  const deleteScenario = useCallback((id: string) => {
    setState((s) => ({ ...s, scenarios: s.scenarios.filter((sc) => sc.id !== id) }));
  }, []);

  const saveScenarioToDecisions = useCallback((id: string) => {
    setState((s) => {
      const sc = s.scenarios.find((x) => x.id === id);
      if (!sc) return s;
      const totalCost =
        (sc.tuition + sc.accommodation - Math.max(0, sc.scholarship)) * sc.durationYears;
      const newDecision: Decision = {
        id: uid(),
        title: `Review scenario: ${sc.name}`,
        description: `Compare the "${sc.name}" scenario with current plans. Estimated total cost (approx. Rs. ${totalCost.toLocaleString(
          'en-IN'
        )}) over ${sc.durationYears} years, with a focus on ${sc.careerPriority} and ${sc.learningHours} hrs/week of skill learning.`,
        status: 'discussing',
        studentPriorities: `Pursue ${sc.careerPriority}; ${sc.learningHours} hrs/week learning time.`,
        familyPriorities: 'Affordability, alignment with annual budget, long-term value.',
        criteria: [
          { id: uid(), name: 'Total cost', importance: 4 },
          { id: uid(), name: 'Career focus', importance: 5 },
          { id: uid(), name: 'Learning time', importance: 3 },
        ],
        options: [
          {
            id: uid(),
            name: sc.name,
            pros: 'Reflects an actively considered plan with concrete numbers.',
            cons: 'Needs verification of actual fees and scholarship likelihood.',
            estimatedCost: `Rs. ${totalCost.toLocaleString('en-IN')} (approx. total)`,
            risks: 'Scholarship may not be confirmed; costs are estimates.',
          },
        ],
        comments: [],
        createdAt: Date.now(),
      };
      return {
        ...s,
        decisions: [newDecision, ...s.decisions],
        savedScenarioIds: [...s.savedScenarioIds, id],
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(resetState());
  }, []);

  const value: StoreContextValue = {
    state,
    setProfile,
    setCosts,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addSkill,
    updateSkill,
    deleteSkill,
    addMessage,
    clearChat,
    addDecision,
    updateDecision,
    deleteDecision,
    addScenario,
    updateScenario,
    deleteScenario,
    saveScenarioToDecisions,
    resetAll,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
