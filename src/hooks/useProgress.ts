import { useState, useCallback, useEffect } from 'react';
import type { UserProgress, SubTestId, Difficulty } from '../lib/types';
import { getDefaultProgress } from '../lib/types';
import { saveProgress, loadProgress, clearProgress } from '../lib/storage';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(() => loadProgress());

  useEffect(() => {
    if (progress) {
      saveProgress(progress);
    }
  }, [progress]);

  const initProgress = useCallback((name: string) => {
    const p = getDefaultProgress(name);
    setProgress(p);
    saveProgress(p);
  }, []);

  const updateSkillMastery = useCallback((subTestId: SubTestId, wasCorrect: boolean) => {
    setProgress(prev => {
      if (!prev) return prev;
      const mastery = { ...prev.skillMastery[subTestId] };
      mastery.attempted += 1;
      if (wasCorrect) {
        mastery.correct += 1;
        mastery.currentStreak += 1;
        if (mastery.currentStreak > mastery.bestStreak) {
          mastery.bestStreak = mastery.currentStreak;
        }
      } else {
        mastery.currentStreak = 0;
      }
      const updated: UserProgress = {
        ...prev,
        skillMastery: { ...prev.skillMastery, [subTestId]: mastery },
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const getRecommendedDifficulty = useCallback((subTestId: SubTestId): Difficulty => {
    if (!progress) return 'easy';
    const mastery = progress.skillMastery[subTestId];
    if (mastery.attempted === 0) return 'easy';
    const pct = (mastery.correct / mastery.attempted) * 100;
    if (pct >= 80 && mastery.currentStreak >= 3) return 'hard';
    if (pct >= 60) return 'medium';
    return 'easy';
  }, [progress]);

  const getMasteryPercentage = useCallback((subTestId: SubTestId): number => {
    if (!progress) return 0;
    const mastery = progress.skillMastery[subTestId];
    if (mastery.attempted === 0) return 0;
    return Math.round((mastery.correct / mastery.attempted) * 100);
  }, [progress]);

  const resetProgress = useCallback(() => {
    clearProgress();
    setProgress(null);
  }, []);

  return {
    progress,
    initProgress,
    updateSkillMastery,
    getRecommendedDifficulty,
    getMasteryPercentage,
    resetProgress,
  };
}
