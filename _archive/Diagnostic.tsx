import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type Question, type SubTestId, SUB_TESTS } from '../lib/types';
import { getDiagnosticQuestions } from '../lib/questionPool';
import QuestionCard from './QuestionCard';
import Explanation from './Explanation';

interface DiagnosticProps {
  allQuestions: Question[];
  usedQuestionIds: string[];
  onQuestionUsed: (ids: string[]) => void;
  onComplete: (scores: Record<SubTestId, number>) => void;
}

const Diagnostic: React.FC<DiagnosticProps> = ({
  allQuestions,
  usedQuestionIds,
  onQuestionUsed,
  onComplete,
}) => {
  const questions = useMemo(() => {
    const qs = getDiagnosticQuestions(allQuestions, usedQuestionIds);
    const allIds = Object.values(qs).flat().map(q => q.id);
    onQuestionUsed(allIds);
    return qs;
  }, []);

  const flatQuestions = useMemo(() => {
    const result: { subTestId: SubTestId; question: Question }[] = [];
    SUB_TESTS.forEach(st => {
      (questions[st.id] || []).forEach(q => {
        result.push({ subTestId: st.id, question: q });
      });
    });
    return result;
  }, [questions]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scores, setScores] = useState<Record<SubTestId, number>>(() => {
    const s: any = {};
    SUB_TESTS.forEach(st => { s[st.id] = 0; });
    return s;
  });

  const current = flatQuestions[currentIdx];

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === current.question.correctAnswer) {
      setScores(prev => ({
        ...prev,
        [current.subTestId]: prev[current.subTestId] + 1,
      }));
    }
  };

  const handleContinue = () => {
    if (currentIdx < flatQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete(scores);
    }
  };

  if (!current) {
    return <div className="text-center text-text-muted">Loading diagnostic...</div>;
  }

  const subTestName = SUB_TESTS.find(st => st.id === current.subTestId)?.name || '';

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-text">Diagnostic Test</h2>
        <p className="text-text-muted text-sm">
          {currentIdx + 1} of {flatQuestions.length} — {subTestName}
        </p>
        <div className="mt-2 h-1.5 bg-bg-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / flatQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <QuestionCard
          question={current.question}
          questionNumber={currentIdx + 1}
          totalQuestions={flatQuestions.length}
          selectedAnswer={selectedAnswer}
          onSelect={handleSelect}
          showFeedback={showFeedback}
          disabled={showFeedback}
        />
      </motion.div>

      {showFeedback && (
        <div className="mt-4">
          <Explanation
            show={true}
            isCorrect={selectedAnswer === current.question.correctAnswer}
            explanation={current.question.explanation}
            onContinue={handleContinue}
          />
        </div>
      )}
    </div>
  );
};

export default Diagnostic;
