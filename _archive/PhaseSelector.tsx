import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { type UserProgress, type SubTestId, SUB_TESTS } from '../lib/types';

interface PhaseSelectorProps {
  existingProgress: UserProgress | null;
  onStartNew: (name: string) => void;
  onResume: () => void;
  onSelectPhase: (phase: number) => void;
  onQuickPractice: (subTestId: SubTestId) => void;
}

const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  existingProgress,
  onStartNew,
  onResume,
  onSelectPhase,
  onQuickPractice,
}) => {
  const [name, setName] = useState(existingProgress?.studentName || '');

  const phases = [
    {
      num: 1,
      title: 'Phase 1: Learn the Patterns',
      time: '60 min',
      desc: 'Master the tricks for all 8 question types',
      completed: existingProgress?.phase1.completed,
      locked: false,
    },
    {
      num: 2,
      title: 'Phase 2: Smart Drill',
      time: '60 min',
      desc: 'Adaptive practice that targets your weak spots',
      completed: existingProgress?.phase2.completed,
      locked: !existingProgress?.phase1.completed,
    },
    {
      num: 3,
      title: 'Phase 3: Mock Exam',
      time: '60 min',
      desc: 'Full timed test under real exam conditions',
      completed: existingProgress?.phase3.completed,
      locked: false,
    },
  ];

  const handleStart = (phaseNum: number) => {
    if (!existingProgress && name.trim()) {
      onStartNew(name.trim());
    }
    onSelectPhase(phaseNum);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">
            CAT4 Level F
          </h1>
          <p className="text-primary text-xl font-semibold">
            Exam Cracker
          </p>
          <p className="text-text-muted mt-2">
            Master the test in 3 hours
          </p>
        </div>

        {/* Name input */}
        {!existingProgress && (
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-bg-card border-2 border-bg-hover rounded-lg text-text text-center text-lg focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />
          </div>
        )}

        {/* Welcome back */}
        {existingProgress && (
          <div className="mb-6 text-center">
            <p className="text-text-muted">
              Welcome back, <span className="text-primary font-semibold">{existingProgress.studentName}</span>
            </p>
            <button
              onClick={onResume}
              className="mt-2 px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-semibold rounded-lg transition-colors"
            >
              Resume where I left off
            </button>
          </div>
        )}

        {/* Phase buttons */}
        <div className="flex flex-col gap-3">
          {phases.map(phase => (
            <motion.button
              key={phase.num}
              onClick={() => handleStart(phase.num)}
              disabled={phase.locked || (!existingProgress && !name.trim())}
              className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                phase.locked
                  ? 'border-bg-hover bg-bg-card/50 opacity-50 cursor-not-allowed'
                  : phase.completed
                    ? 'border-success/40 bg-success/5 hover:bg-success/10 cursor-pointer'
                    : 'border-bg-hover bg-bg-card hover:border-primary hover:bg-primary/5 cursor-pointer'
              }`}
              whileHover={!phase.locked ? { scale: 1.01 } : {}}
              whileTap={!phase.locked ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text">{phase.title}</h3>
                  <p className="text-text-muted text-sm mt-1">{phase.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-sm">{phase.time}</span>
                  {phase.completed && (
                    <span className="text-success text-xl">✓</span>
                  )}
                  {phase.locked && (
                    <span className="text-text-muted text-lg">🔒</span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quick Practice */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-muted mb-3 text-center uppercase tracking-wide">
            Quick Practice
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {SUB_TESTS.map(st => (
              <button
                key={st.id}
                onClick={() => {
                  if (!existingProgress && name.trim()) {
                    onStartNew(name.trim());
                  }
                  onQuickPractice(st.id);
                }}
                disabled={!existingProgress && !name.trim()}
                className="p-3 rounded-lg border border-bg-hover bg-bg-card text-left hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="text-sm font-medium text-text">{st.name}</span>
                <span className="text-xs text-text-muted block mt-0.5">
                  Part {st.part} · {st.questionCount} Qs
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-xs mt-8">
          168 questions across 8 sub-tests — just like the real exam
        </p>
      </motion.div>
    </div>
  );
};

export default PhaseSelector;
