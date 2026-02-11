import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type Question, type SubTestId, SUB_TESTS } from '../lib/types';
import { getQuestionsForSubTest } from '../lib/questionPool';
import { allocateDrillTime, getDrillMessage } from '../lib/scoring';
import QuestionCard from './QuestionCard';
import Explanation from './Explanation';
import TrickSheet from './TrickSheet';
import { useTimer } from '../hooks/useTimer';
import Timer from './Timer';

interface DrillSessionProps {
  allQuestions: Question[];
  usedQuestionIds: string[];
  diagnosticScores: Record<SubTestId, number>;
  onQuestionUsed: (ids: string[]) => void;
  onDrillScore: (subTestId: SubTestId, correct: number, total: number) => void;
  onComplete: () => void;
}

const DrillSession: React.FC<DrillSessionProps> = ({
  allQuestions,
  usedQuestionIds,
  diagnosticScores,
  onQuestionUsed,
  onDrillScore,
  onComplete,
}) => {
  const allocation = useMemo(() => allocateDrillTime(diagnosticScores), [diagnosticScores]);

  // Sort sub-tests by diagnostic score (weakest first)
  const orderedSubTests = useMemo(() => {
    return [...SUB_TESTS].sort(
      (a, b) => (diagnosticScores[a.id] || 0) - (diagnosticScores[b.id] || 0)
    );
  }, [diagnosticScores]);

  const [currentSubTestIdx, setCurrentSubTestIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [showTricks, setShowTricks] = useState(false);
  const [showDrillResult, setShowDrillResult] = useState(false);
  const [extraQuestions, setExtraQuestions] = useState<Question[]>([]);
  const [inExtraRound, setInExtraRound] = useState(false);

  const currentSubTest = orderedSubTests[currentSubTestIdx];
  const alloc = allocation[currentSubTest?.id];

  const timer = useTimer({
    initialSeconds: (alloc?.minutes || 5) * 60,
    autoStart: true,
    onTimeUp: () => {
      if (!showDrillResult) {
        finishCurrentDrill();
      }
    },
  });

  // Load questions for current sub-test
  useMemo(() => {
    if (!currentSubTest) return;
    const qs = getQuestionsForSubTest(
      allQuestions,
      currentSubTest.id,
      usedQuestionIds,
      alloc?.questionCount || 10,
      true
    );
    setQuestions(qs);
    setCurrentQIdx(0);
    setCorrect(0);
    setTotal(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowDrillResult(false);
    setInExtraRound(false);
    onQuestionUsed(qs.map(q => q.id));
    timer.reset((alloc?.minutes || 5) * 60);
    timer.start();
  }, [currentSubTestIdx]);

  const currentQuestion = inExtraRound
    ? extraQuestions[currentQIdx]
    : questions[currentQIdx];

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    const isCorrect = index === currentQuestion?.correctAnswer;
    if (isCorrect) setCorrect(prev => prev + 1);
    setTotal(prev => prev + 1);
  };

  const finishCurrentDrill = () => {
    setShowDrillResult(true);
    timer.pause();
    onDrillScore(currentSubTest.id, correct, total);
  };

  const handleContinue = () => {
    const maxQ = inExtraRound ? extraQuestions.length : questions.length;
    if (currentQIdx < maxQ - 1) {
      setCurrentQIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      finishCurrentDrill();
    }
  };

  const handleNextSubTest = () => {
    if (currentSubTestIdx < orderedSubTests.length - 1) {
      setCurrentSubTestIdx(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleExtraQuestions = (count: number) => {
    const extra = getQuestionsForSubTest(
      allQuestions,
      currentSubTest.id,
      [...usedQuestionIds, ...questions.map(q => q.id)],
      count,
      true
    );
    setExtraQuestions(extra);
    setInExtraRound(true);
    setCurrentQIdx(0);
    setCorrect(0);
    setTotal(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowDrillResult(false);
    onQuestionUsed(extra.map(q => q.id));
    timer.reset(3 * 60);
    timer.start();
  };

  if (!currentSubTest) {
    onComplete();
    return null;
  }

  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const drillMsg = getDrillMessage(percentage);

  if (showDrillResult) {
    return (
      <div className="py-6 px-4 max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-xl font-bold text-text mb-2">{currentSubTest.name}</h2>
          <div className={`text-4xl font-bold mb-2 ${
            percentage >= 80 ? 'text-success' : percentage >= 60 ? 'text-warning' : 'text-danger'
          }`}>
            {correct}/{total} ({percentage}%)
          </div>
          <p className="text-text-muted mb-6">{drillMsg.message}</p>

          {percentage < 80 && !inExtraRound && (
            <div className="flex flex-col gap-3 mb-4">
              <button
                onClick={() => setShowTricks(true)}
                className="px-6 py-2 bg-bg-card border border-primary text-primary rounded-lg"
              >
                Review the tricks
              </button>
              <button
                onClick={() => handleExtraQuestions(percentage < 60 ? 5 : 3)}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
              >
                {drillMsg.action}
              </button>
            </div>
          )}

          <button
            onClick={handleNextSubTest}
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
          >
            {currentSubTestIdx < orderedSubTests.length - 1
              ? 'Next sub-test →'
              : 'Complete Phase 2 →'}
          </button>
        </motion.div>

        <TrickSheet
          subTestId={currentSubTest.id}
          show={showTricks}
          onClose={() => setShowTricks(false)}
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      {/* Drill header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-text">{currentSubTest.name}</h3>
          <p className="text-text-muted text-xs">
            Sub-test {currentSubTestIdx + 1} of {orderedSubTests.length}
            {diagnosticScores[currentSubTest.id] <= 1 && ' — Focus area'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-sm font-mono font-bold ${
            percentage >= 80 ? 'text-success' : percentage >= 60 ? 'text-warning' : 'text-danger'
          }`}>
            {correct}/{total} ({total > 0 ? percentage : '--'}%)
          </span>
          <Timer
            formattedTime={timer.formattedTime}
            isWarning={timer.isWarning}
            isDanger={timer.isDanger}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-1 bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{
            width: `${((currentQIdx + 1) / (inExtraRound ? extraQuestions.length : questions.length)) * 100}%`,
          }}
        />
      </div>

      {currentQuestion ? (
        <motion.div
          key={`${currentSubTestIdx}-${currentQIdx}-${inExtraRound}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
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
      ) : (
        <div className="text-center text-text-muted">
          <p>No more questions available.</p>
          <button onClick={finishCurrentDrill} className="mt-4 px-6 py-2 bg-primary text-bg rounded-lg">
            See results
          </button>
        </div>
      )}

      {/* Floating tricks button */}
      <button
        onClick={() => setShowTricks(true)}
        className="fixed bottom-4 left-4 px-3 py-2 bg-bg-card border border-primary text-primary rounded-lg text-sm hover:bg-primary/10 z-40"
      >
        Show tricks
      </button>

      <TrickSheet
        subTestId={currentSubTest.id}
        show={showTricks}
        onClose={() => setShowTricks(false)}
      />
    </div>
  );
};

export default DrillSession;
