import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubTestId, Difficulty, SkillMastery } from '../lib/types';
import { SUB_TESTS } from '../lib/types';
import { useQuestionBuffer } from '../hooks/useQuestionBuffer';
import QuestionCard from './QuestionCard';
import Explanation from './Explanation';
import TrickSheet from './TrickSheet';

interface AIPracticeProps {
  subTestId: SubTestId;
  mastery: SkillMastery;
  onUpdateMastery: (subTestId: SubTestId, wasCorrect: boolean) => void;
  onBack: () => void;
}

function getAdaptiveDifficulty(_mastery: SkillMastery): Difficulty {
  return 'hard';
}

const AIPractice: React.FC<AIPracticeProps> = ({
  subTestId,
  mastery,
  onUpdateMastery,
  onBack,
}) => {
  const subTest = SUB_TESTS.find(st => st.id === subTestId)!;
  const [difficulty, setDifficulty] = useState<Difficulty>(() => getAdaptiveDifficulty(mastery));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showTricks, setShowTricks] = useState(false);
  const [streak, setStreak] = useState(mastery.currentStreak);
  const [wrongStreak, setWrongStreak] = useState(0);

  const { currentQuestion, isLoading, error, nextQuestion, retry } = useQuestionBuffer(subTestId, difficulty);

  const handleSelect = useCallback((index: number) => {
    if (showFeedback || !currentQuestion) return;
    setSelectedAnswer(index);
    setShowFeedback(true);

    const wasCorrect = index === currentQuestion.correctAnswer;
    setSessionTotal(prev => prev + 1);
    if (wasCorrect) {
      setSessionCorrect(prev => prev + 1);
      setStreak(prev => prev + 1);
      setWrongStreak(0);
    } else {
      setStreak(0);
      setWrongStreak(prev => prev + 1);
    }

    onUpdateMastery(subTestId, wasCorrect);
  }, [showFeedback, currentQuestion, subTestId, onUpdateMastery]);

  const handleContinue = useCallback(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    nextQuestion();
  }, [nextQuestion]);

  const sessionPct = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const overallPct = mastery.attempted > 0 ? Math.round((mastery.correct / mastery.attempted) * 100) : 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="py-6 px-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-text">{subTest.name}</h3>
            <p className="text-text-muted text-xs">AI Practice — {difficulty}</p>
          </div>
          <button onClick={onBack} className="text-text-muted hover:text-text text-sm">
            ← Dashboard
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full mb-4"
          />
          <p className="text-text-muted text-sm">Generating questions...</p>
          <p className="text-text-muted text-xs mt-1">Powered by Gemini AI</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-6 px-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-text">{subTest.name}</h3>
          </div>
          <button onClick={onBack} className="text-text-muted hover:text-text text-sm">
            ← Dashboard
          </button>
        </div>

        <div className="text-center py-12">
          <p className="text-danger mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={retry}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
            >
              Try again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-bg-card border border-bg-hover text-text rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-text">{subTest.name}</h3>
          <p className="text-text-muted text-xs">
            AI Practice — {difficulty}
            {streak >= 3 && <span className="text-warning ml-2">{streak} streak!</span>}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className={`text-sm font-mono font-bold ${
              sessionPct >= 80 ? 'text-success' : sessionPct >= 60 ? 'text-warning' : sessionTotal === 0 ? 'text-text-muted' : 'text-danger'
            }`}>
              {sessionCorrect}/{sessionTotal}
            </span>
            <p className="text-text-muted text-xs">
              Mastery: <span className={overallPct >= 80 ? 'text-success' : overallPct >= 60 ? 'text-warning' : 'text-text-muted'}>
                {overallPct > 0 ? `${overallPct}%` : '--'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onSelect={handleSelect}
              showFeedback={showFeedback}
              disabled={showFeedback}
            />
            {showFeedback && (
              <div className="mt-4">
                <Explanation
                  show={true}
                  isCorrect={selectedAnswer === currentQuestion.correctAnswer}
                  explanation={currentQuestion.explanation}
                  rule={'rule' in currentQuestion ? (currentQuestion as any).rule : undefined}
                  onContinue={handleContinue}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!currentQuestion && !isLoading && (
        <div className="text-center py-12 text-text-muted">
          <p>No question available</p>
          <button
            onClick={retry}
            className="mt-4 px-6 py-2 bg-primary text-bg rounded-lg font-bold"
          >
            Generate more
          </button>
        </div>
      )}

      {/* Floating buttons */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between z-40 pointer-events-none">
        <button
          onClick={() => setShowTricks(true)}
          className="px-3 py-2 bg-bg-card border border-primary text-primary rounded-lg text-sm hover:bg-primary/10 pointer-events-auto"
        >
          Show tricks
        </button>
        <button
          onClick={onBack}
          className="px-3 py-2 bg-bg-card border border-bg-hover text-text-muted rounded-lg text-sm hover:border-primary hover:text-text pointer-events-auto"
        >
          ← Dashboard
        </button>
      </div>

      <TrickSheet subTestId={subTestId} show={showTricks} onClose={() => setShowTricks(false)} />
    </div>
  );
};

export default AIPractice;
