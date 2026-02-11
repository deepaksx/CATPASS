import { useState, useCallback } from 'react';
import type { Phase, SubTestId } from './lib/types';
import { getDefaultSkillMastery } from './lib/types';
import { useProgress } from './hooks/useProgress';
import { useSessionTimer } from './hooks/useTimer';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import AIPractice from './components/AIPractice';

function App() {
  const {
    progress,
    initProgress,
    updateSkillMastery,
    resetProgress,
  } = useProgress();

  const [phase, setPhase] = useState<Phase>('dashboard');
  const [activeSkill, setActiveSkill] = useState<SubTestId | null>(null);
  const sessionTimer = useSessionTimer();

  const handleStartNew = useCallback((name: string) => {
    initProgress(name);
  }, [initProgress]);

  const handleSelectSkill = useCallback((subTestId: SubTestId) => {
    setActiveSkill(subTestId);
    setPhase('practice');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setPhase('dashboard');
    setActiveSkill(null);
  }, []);

  const handleReset = useCallback(() => {
    resetProgress();
    setPhase('dashboard');
    setActiveSkill(null);
  }, [resetProgress]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {phase === 'practice' && activeSkill && (
        <TopBar
          phase={`Practice: ${activeSkill.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}`}
          sessionSeconds={sessionTimer.seconds}
          onBack={handleBackToDashboard}
        />
      )}

      {phase === 'dashboard' && (
        <Dashboard
          existingProgress={progress}
          onStartNew={handleStartNew}
          onSelectSkill={handleSelectSkill}
          onReset={handleReset}
        />
      )}

      {phase === 'practice' && activeSkill && (
        <AIPractice
          subTestId={activeSkill}
          mastery={progress?.skillMastery[activeSkill] || getDefaultSkillMastery()}
          onUpdateMastery={updateSkillMastery}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
