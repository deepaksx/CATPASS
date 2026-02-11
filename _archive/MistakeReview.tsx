import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { type Question, type SubTestId, SUB_TESTS } from '../lib/types';
import QuestionCard from './QuestionCard';

interface MistakeReviewProps {
  mistakes: {
    question: Question;
    userAnswer: number;
    subTestId: SubTestId;
  }[];
  onRetakeWorst: () => void;
  onFinish: () => void;
}

const MistakeReview: React.FC<MistakeReviewProps> = ({
  mistakes,
  onRetakeWorst,
  onFinish,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Group by sub-test
  const grouped = SUB_TESTS.reduce((acc, st) => {
    const stMistakes = mistakes.filter(m => m.subTestId === st.id);
    if (stMistakes.length > 0) {
      acc.push({ subTest: st, mistakes: stMistakes });
    }
    return acc;
  }, [] as { subTest: typeof SUB_TESTS[0]; mistakes: typeof mistakes }[]);

  // Flatten for navigation
  const flatMistakes = grouped.flatMap(g => g.mistakes);

  if (flatMistakes.length === 0) {
    return (
      <div className="py-6 px-4 max-w-lg mx-auto text-center">
        <span className="text-4xl block mb-4">🎉</span>
        <h2 className="text-2xl font-bold text-success mb-2">Perfect Score!</h2>
        <p className="text-text-muted mb-6">You got every question right!</p>
        <button
          onClick={onFinish}
          className="px-8 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
        >
          Finish
        </button>
      </div>
    );
  }

  const current = flatMistakes[currentIdx];
  const currentSubTestName = SUB_TESTS.find(st => st.id === current.subTestId)?.name || '';

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-text">Review Mistakes</h2>
        <p className="text-text-muted text-sm">
          {currentIdx + 1} of {flatMistakes.length} mistakes — {currentSubTestName}
        </p>
        <div className="mt-2 h-1.5 bg-bg-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-danger rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / flatMistakes.length) * 100}%` }}
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
          selectedAnswer={current.userAnswer}
          onSelect={() => {}}
          showFeedback={true}
          disabled={true}
        />

        <div className="mt-4 p-4 bg-bg-card rounded-lg border border-bg-hover">
          <div className="flex items-start gap-2">
            <span className="text-danger">✗</span>
            <div>
              <p className="text-text text-sm">
                <span className="text-text-muted">Your answer:</span>{' '}
                <span className="text-danger font-semibold">
                  {String.fromCharCode(65 + current.userAnswer)}
                </span>
              </p>
              <p className="text-text text-sm">
                <span className="text-text-muted">Correct answer:</span>{' '}
                <span className="text-success font-semibold">
                  {String.fromCharCode(65 + current.question.correctAnswer)}
                </span>
              </p>
              <p className="text-text-muted text-sm mt-2">
                {current.question.explanation}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 bg-bg-card border border-bg-hover text-text-muted rounded-lg disabled:opacity-30"
        >
          ← Previous
        </button>

        {currentIdx < flatMistakes.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
          >
            Next →
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onRetakeWorst}
              className="px-4 py-2 bg-bg-card border border-primary text-primary rounded-lg text-sm"
            >
              Drill weakest area
            </button>
            <button
              onClick={onFinish}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Summary by sub-test */}
      <div className="mt-8 p-4 bg-bg-card rounded-lg border border-bg-hover">
        <h4 className="font-bold text-text text-sm mb-2">Mistakes by sub-test:</h4>
        <div className="grid grid-cols-2 gap-2">
          {grouped.map(g => (
            <div key={g.subTest.id} className="flex justify-between text-sm">
              <span className="text-text-muted">{g.subTest.name}</span>
              <span className="text-danger font-bold">{g.mistakes.length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MistakeReview;
