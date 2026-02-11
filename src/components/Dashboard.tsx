import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { UserProgress, SubTestId, SkillMastery } from '../lib/types';
import { SUB_TESTS } from '../lib/types';

interface DashboardProps {
  existingProgress: UserProgress | null;
  onStartNew: (name: string) => void;
  onSelectSkill: (subTestId: SubTestId) => void;
  onReset: () => void;
}

const BATTERIES = [
  { name: 'Non-Verbal Reasoning', subTests: ['figure-classification', 'figure-matrices'] as SubTestId[] },
  { name: 'Verbal Reasoning', subTests: ['verbal-classification', 'verbal-analogies'] as SubTestId[] },
  { name: 'Quantitative Reasoning', subTests: ['number-analogies', 'number-series'] as SubTestId[] },
  { name: 'Spatial Ability', subTests: ['figure-analysis', 'figure-recognition'] as SubTestId[] },
];

const TARGET_MASTERY = 80;

function getMasteryPct(mastery: SkillMastery): number {
  if (mastery.attempted === 0) return 0;
  return Math.round((mastery.correct / mastery.attempted) * 100);
}

function getBarColor(pct: number, attempted: number): string {
  if (attempted === 0) return 'bg-bg-hover';
  if (pct >= 80) return 'bg-success';
  if (pct >= 60) return 'bg-warning';
  return 'bg-danger';
}

function getBorderColor(pct: number, attempted: number): string {
  if (attempted === 0) return 'border-bg-hover';
  if (pct >= 80) return 'border-success/40';
  if (pct >= 60) return 'border-warning/40';
  return 'border-danger/40';
}

function getPctColor(pct: number, attempted: number): string {
  if (attempted === 0) return 'text-text-muted';
  if (pct >= 80) return 'text-success';
  if (pct >= 60) return 'text-warning';
  return 'text-danger';
}

const Dashboard: React.FC<DashboardProps> = ({
  existingProgress,
  onStartNew,
  onSelectSkill,
  onReset,
}) => {
  const [name, setName] = useState(existingProgress?.studentName || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSkillClick = (subTestId: SubTestId) => {
    if (!existingProgress && name.trim()) {
      onStartNew(name.trim());
    }
    onSelectSkill(subTestId);
  };

  const isReady = !!existingProgress || name.trim().length > 0;

  // Calculate overall stats
  const totalAnswered = existingProgress?.totalQuestionsAnswered || 0;
  const avgMastery = existingProgress
    ? Math.round(
        Object.values(existingProgress.skillMastery).reduce(
          (sum, m) => sum + (m.attempted > 0 ? (m.correct / m.attempted) * 100 : 0),
          0,
        ) / 8,
      )
    : 0;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 pt-4"
        >
          <h1 className="text-3xl font-bold text-text">CAT4 Level F</h1>
          <p className="text-primary text-lg font-semibold">Skill Dashboard</p>
          {existingProgress && (
            <p className="text-text-muted text-sm mt-1">
              Welcome back, <span className="text-primary font-semibold">{existingProgress.studentName}</span>
            </p>
          )}
        </motion.div>

        {/* Name input for new users */}
        {!existingProgress && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name to start"
              className="w-full px-4 py-3 bg-bg-card border-2 border-bg-hover rounded-lg text-text text-center text-lg focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />
          </motion.div>
        )}

        {/* Overall stats */}
        {existingProgress && totalAnswered > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex gap-3 justify-center"
          >
            <div className="px-4 py-2 bg-bg-card rounded-lg border border-bg-hover text-center">
              <div className="text-lg font-bold text-text">{totalAnswered}</div>
              <div className="text-xs text-text-muted">Questions</div>
            </div>
            <div className="px-4 py-2 bg-bg-card rounded-lg border border-bg-hover text-center">
              <div className={`text-lg font-bold ${avgMastery >= 80 ? 'text-success' : avgMastery >= 60 ? 'text-warning' : 'text-text'}`}>
                {avgMastery}%
              </div>
              <div className="text-xs text-text-muted">Avg Mastery</div>
            </div>
          </motion.div>
        )}

        {/* Battery sections */}
        <div className="flex flex-col gap-5">
          {BATTERIES.map((battery, bIdx) => (
            <motion.div
              key={battery.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: bIdx * 0.08 }}
            >
              <h3 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">
                {battery.name}
              </h3>
              <div className="flex flex-col gap-2">
                {battery.subTests.map(stId => {
                  const stInfo = SUB_TESTS.find(s => s.id === stId)!;
                  const mastery = existingProgress?.skillMastery[stId];
                  const pct = mastery ? getMasteryPct(mastery) : 0;
                  const attempted = mastery?.attempted || 0;
                  const streak = mastery?.currentStreak || 0;

                  return (
                    <motion.button
                      key={stId}
                      onClick={() => handleSkillClick(stId)}
                      disabled={!isReady}
                      className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                        !isReady
                          ? 'border-bg-hover bg-bg-card/50 opacity-50 cursor-not-allowed'
                          : `${getBorderColor(pct, attempted)} bg-bg-card hover:bg-bg-card/80 cursor-pointer`
                      }`}
                      whileHover={isReady ? { scale: 1.01 } : {}}
                      whileTap={isReady ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-text text-sm">{stInfo.name}</span>
                          <span className="text-text-muted text-xs ml-2">Part {stInfo.part}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {streak >= 3 && (
                            <span className="text-xs text-warning font-mono">{streak} streak</span>
                          )}
                          <span className={`text-sm font-bold font-mono ${getPctColor(pct, attempted)}`}>
                            {attempted > 0 ? `${pct}%` : '--'}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar with target line */}
                      <div className="relative h-2 bg-bg-hover rounded-full overflow-visible">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct, attempted)}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                        {/* Target line at 80% */}
                        <div
                          className="absolute top-[-2px] h-[calc(100%+4px)] w-0.5 bg-text-muted/40"
                          style={{ left: `${TARGET_MASTERY}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-text-muted text-xs">
                          {attempted > 0 ? `${attempted} practiced` : 'Not started'}
                        </span>
                        <span className="text-text-muted text-xs">Target: {TARGET_MASTERY}%</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reset button */}
        {existingProgress && (
          <div className="mt-8 text-center">
            {showResetConfirm ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-text-muted text-sm">Reset all progress?</span>
                <button
                  onClick={() => { onReset(); setShowResetConfirm(false); }}
                  className="px-4 py-1 bg-danger/20 border border-danger text-danger rounded-lg text-sm"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-1 bg-bg-card border border-bg-hover text-text-muted rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-text-muted text-xs hover:text-danger transition-colors"
              >
                Reset progress
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-text-muted text-xs mt-6 pb-4">
          AI-powered practice — questions generated by Gemini
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
