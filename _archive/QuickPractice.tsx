import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type Question, type SubTestId, SUB_TESTS } from '../lib/types';
import { getQuestionsForSubTest } from '../lib/questionPool';
import { getDrillMessage } from '../lib/scoring';
import QuestionCard from './QuestionCard';
import Explanation from './Explanation';
import TrickSheet from './TrickSheet';

interface QuickPracticeProps {
  subTestId: SubTestId;
  allQuestions: Question[];
  usedQuestionIds: string[];
  onQuestionUsed: (ids: string[]) => void;
  onBack: () => void;
}

const BATCH_SIZE = 10;

const QuickPractice: React.FC<QuickPracticeProps> = ({
  subTestId,
  allQuestions,
  usedQuestionIds,
  onQuestionUsed,
  onBack,
}) => {
  const subTest = SUB_TESTS.find(st => st.id === subTestId)!;

  const [questions, setQuestions] = useState<Question[]>(() =>
    getQuestionsForSubTest(allQuestions, subTestId, usedQuestionIds, BATCH_SIZE, true)
  );
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newIds = questions.map(q => q.id).filter(id => !markedIds.has(id));
    if (newIds.length > 0) {
      onQuestionUsed(newIds);
      setMarkedIds(prev => {
        const next = new Set(prev);
        newIds.forEach(id => next.add(id));
        return next;
      });
    }
  }, [questions]);

  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [showTricks, setShowTricks] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQIdx];
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === currentQuestion?.correctAnswer) setCorrect(prev => prev + 1);
    setTotal(prev => prev + 1);
  };

  const handleContinue = () => {
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowResult(true);
    }
  };

  const remainingCount = allQuestions.filter(
    q => q.type === subTestId && !usedQuestionIds.includes(q.id) && !markedIds.has(q.id)
  ).length;

  const handleMoreQuestions = () => {
    const allUsed = [...usedQuestionIds, ...Array.from(markedIds)];
    const moreQs = getQuestionsForSubTest(allQuestions, subTestId, allUsed, BATCH_SIZE, true);
    if (moreQs.length === 0) return;
    setQuestions(moreQs);
    setCurrentQIdx(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResult(false);
  };

  if (showResult) {
    const drillMsg = getDrillMessage(percentage);
    return (
      <div className="py-6 px-4 max-w-lg mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <h2 className="text-xl font-bold text-text mb-2">{subTest.name}</h2>
          <div className={`text-4xl font-bold mb-2 ${
            percentage >= 80 ? 'text-success' : percentage >= 60 ? 'text-warning' : 'text-danger'
          }`}>
            {correct}/{total} ({percentage}%)
          </div>
          <p className="text-text-muted mb-6">{drillMsg.message}</p>

          <div className="flex flex-col gap-3">
            {percentage < 80 && (
              <button
                onClick={() => setShowTricks(true)}
                className="px-6 py-2 bg-bg-card border border-primary text-primary rounded-lg"
              >
                Review the tricks
              </button>
            )}
            {remainingCount > 0 && (
              <button
                onClick={handleMoreQuestions}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
              >
                Practice {Math.min(BATCH_SIZE, remainingCount)} more questions
              </button>
            )}
            {remainingCount === 0 && (
              <p className="text-text-muted text-sm">No more unused questions for this sub-test.</p>
            )}
            <button
              onClick={onBack}
              className="px-8 py-3 bg-bg-card border border-bg-hover hover:border-primary text-text font-bold rounded-lg"
            >
              Back to home
            </button>
          </div>
        </motion.div>

        <TrickSheet subTestId={subTestId} show={showTricks} onClose={() => setShowTricks(false)} />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-text">{subTest.name}</h3>
          <p className="text-text-muted text-xs">Quick Practice</p>
        </div>
        <span className={`text-sm font-mono font-bold ${
          percentage >= 80 ? 'text-success' : percentage >= 60 ? 'text-warning' : total === 0 ? 'text-text-muted' : 'text-danger'
        }`}>
          {correct}/{total} ({total > 0 ? `${percentage}%` : '--'})
        </span>
      </div>

      <div className="mb-6 h-1 bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((currentQIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {currentQuestion ? (
        <motion.div key={currentQIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQIdx + 1}
            totalQuestions={questions.length}
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
        <div className="text-center text-text-muted py-12">
          <p>No questions available for this sub-test.</p>
          <button onClick={onBack} className="mt-4 px-6 py-2 bg-primary text-bg rounded-lg font-bold">
            Back to home
          </button>
        </div>
      )}

      <button
        onClick={() => setShowTricks(true)}
        className="fixed bottom-4 left-4 px-3 py-2 bg-bg-card border border-primary text-primary rounded-lg text-sm hover:bg-primary/10 z-40"
      >
        Show tricks
      </button>

      <TrickSheet subTestId={subTestId} show={showTricks} onClose={() => setShowTricks(false)} />
    </div>
  );
};

export default QuickPractice;
