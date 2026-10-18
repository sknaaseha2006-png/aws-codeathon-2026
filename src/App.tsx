import { useState } from 'react';
import { StoreProvider, useStore } from '@/store/StoreContext';
import { AppShell } from '@/components/AppShell';
import { Welcome } from '@/sections/Welcome';
import { Dashboard } from '@/sections/Dashboard';
import { Assistant } from '@/sections/Assistant';
import { CostPlanner } from '@/sections/CostPlanner';
import { CareerNavigator } from '@/sections/CareerNavigator';
import { FamilyWorkspace } from '@/sections/FamilyWorkspace';
import { Simulator } from '@/sections/Simulator';
import { ActionPlan } from '@/sections/ActionPlan';
import type { SectionId } from '@/types';

function AppInner() {
  const [section, setSection] = useState<SectionId>('welcome');
  const { resetAll } = useStore();

  const handleReset = () => {
    if (confirm('Reset all demonstration data? This restores the original sample profile, costs, tasks, skills, decisions, and scenarios, and clears chat history.')) {
      resetAll();
      setSection('dashboard');
    }
  };

  if (section === 'welcome') {
    return <Welcome onEnter={setSection} />;
  }

  return (
    <AppShell active={section} onNavigate={setSection} onReset={handleReset}>
      {section === 'dashboard' && <Dashboard onNavigate={setSection} />}
      {section === 'assistant' && <Assistant onNavigate={setSection} />}
      {section === 'cost' && <CostPlanner />}
      {section === 'career' && <CareerNavigator />}
      {section === 'family' && <FamilyWorkspace />}
      {section === 'simulator' && <Simulator />}
      {section === 'plan' && <ActionPlan />}
    </AppShell>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
