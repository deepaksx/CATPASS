import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { type Question, type SubTestId, SUB_TESTS } from '../lib/types';
import { getMockExamQuestions } from '../lib/questionPool';
import { calculateExamResult, type ExamResult } from '../lib/scoring';
import { useTimer } from '../hooks/useTimer';
import Timer from './Timer';
import QuestionCard from './QuestionCard';
import SubTestTransition from './SubTestTransition';
import ScoreReport from './ScoreReport';
import MistakeReview from './MistakeReview';

interface MockExamProps {
  allQuestions: Question[];
  usedQuestionIds: string[];
  onQuestionUsed: (ids: string[]) => void;
  onComplete: (scores: Record<SubTestId, { correct: number; total: number }>) => void;
  onBackToHome: () => void;
  onDrillWeakest: (subTestId: SubTestId) => void;
}

type ExamState = 'transition' | 'testing' | 'break' | 'score-report' | 'review-mistakes';

const MockExam: React.FC<MockExamProps> = ({
  allQuestions,
  usedQuestionIds,
  onQuestionUsed,
  onComplete,
  onBackToHome,
  onDrillWeakest,
}) => {
  const examQuestions = useMemo(() => {
    const qs = getMockExamQuestions(allQuestions, usedQuestionIds);
    const allIds = Object.values(qs).flat().map(q => q.id);
    onQuestionUsed(allIds);
    return qs;
  }, []);

  const [state, setState] = useState<ExamState>('transition');
  const [currentSubTestIdx, setCurrentSubTestIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);

  const subTest = SUB_TESTS[currentSubTestIdx];
  const currentQuestions = examQuestions[subTest?.id] || [];
  const currentQuestion = currentQuestions[currentQIdx];

  const timer = useTimer({
    initialSeconds: subTest ? subTest.timeMinutes * 60 : 0,
    autoStart: false,
    onTimeUp: () => moveToNextSubTest(),
  });

  const moveToNextSubTest = useCallback(() => {
    timer.pause();

    // Check if we need a break between parts
    const currentPart = SUB_TESTS[currentSubTestIdx]?.part;
    const nextPart = SUB_TESTS[currentSubTestIdx + 1]?.part;

    if (currentSubTestIdx < SUB_TESTS.length - 1) {
      setCurrentSubTestIdx(prev => prev + 1);
      setCurrentQIdx(0);
      setSelectedAnswer(null);

      if (currentPart !== nextPart) {
        setState('break');
      } else {
        setState('transition');
      }
    } else {
      // Exam complete - calculate scores
      finishExam();
    }
  }, [currentSubTestIdx, timer]);

  const finishExam = () => {
    const scores: Record<SubTestId, { correct: number; total: number }> = {} as any;

    SUB_TESTS.forEach(st => {
      const qs = examQuestions[st.id] || [];
      let correct = 0;
      qs.forEach(q => {
        if (answers[q.id] === q.correctAnswer) correct++;
      });
      scores[st.id] = { correct, total: qs.length };
    });

    const examResult = calculateExamResult(scores);
    setResult(examResult);
    setState('score-report');
    onComplete(scores);
  };

  const handleStartSubTest = () => {
    setState('testing');
    timer.reset(subTest.timeMinutes * 60);
    timer.start();
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (currentQuestion) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: index }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQIdx < currentQuestions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
      const nextQ = currentQuestions[currentQIdx + 1];
      setSelectedAnswer(nextQ ? (answers[nextQ.id] ?? null) : null);
    } else {
      moveToNextSubTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIdx > 0) {
      setCurrentQIdx(prev => prev - 1);
      const prevQ = currentQuestions[currentQIdx - 1];
      setSelectedAnswer(prevQ ? (answers[prevQ.id] ?? null) : null);
    }
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  // Find weakest sub-test for drill
  const weakestSubTest = useMemo(() => {
    if (!result) return SUB_TESTS[0].id;
    let worst: SubTestId = SUB_TESTS[0].id;
    let worstPct = 100;
    result.batteries.forEach(b => {
      if (b.percentage < worstPct) {
        worstPct = b.percentage;
        worst = b.subTests[0];
      }
    });
    return worst;
  }, [result]);

  // Build mistakes list
  const mistakes = useMemo(() => {
    const list: { question: Question; userAnswer: number; subTestId: SubTestId }[] = [];
    SUB_TESTS.forEach(st => {
      (examQuestions[st.id] || []).forEach(q => {
        const userAns = answers[q.id];
        if (userAns !== undefined && userAns !== q.correctAnswer) {
          list.push({ question: q, userAnswer: userAns, subTestId: st.id });
        }
        // Also include unanswered
        if (userAns === undefined) {
          list.push({ question: q, userAnswer: -1, subTestId: st.id });
        }
      });
    });
    return list;
  }, [answers, examQuestions]);

  if (state === 'score-report' && result) {
    return (
      <ScoreReport
        result={result}
        onReviewMistakes={() => setState('review-mistakes')}
        onRetakeWorst={() => onDrillWeakest(weakestSubTest)}
        onFinish={onBackToHome}
      />
    );
  }

  if (state === 'review-mistakes') {
    return (
      <MistakeReview
        mistakes={mistakes}
        onRetakeWorst={() => onDrillWeakest(weakestSubTest)}
        onFinish={onBackToHome}
      />
    );
  }

  if (state === 'transition' || state === 'break') {
    return (
      <SubTestTransition
        subTest={subTest}
        subTestNumber={currentSubTestIdx + 1}
        totalSubTests={SUB_TESTS.length}
        isBreak={state === 'break'}
        onReady={handleStartSubTest}
      />
    );
  }

  // Testing state
  return (
    <div className="py-4 px-4 max-w-2xl mx-auto">
      {/* Exam header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-text-muted text-xs">
            Part {subTest.part} — {subTest.name}
          </span>
          <p className="text-text text-sm font-semibold">
            Question {currentQIdx + 1} of {currentQuestions.length}
          </p>
        </div>
        <Timer
          formattedTime={timer.formattedTime}
          percentage={timer.percentage}
          isWarning={timer.isWarning}
          isDanger={timer.isDanger}
          large
        />
      </div>

      {/* Progress */}
      <div className="mb-4 h-1 bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((currentQIdx + 1) / currentQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      {currentQuestion && (
        <motion.div
          key={`${currentSubTestIdx}-${currentQIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQIdx + 1}
            totalQuestions={currentQuestions.length}
            selectedAnswer={selectedAnswer}
            onSelect={handleSelectAnswer}
            showFeedback={false}
            disabled={false}
            flagged={flagged.has(currentQuestion.id)}
            onFlag={toggleFlag}
          />
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQIdx === 0}
          className="px-4 py-2 bg-bg-card border border-bg-hover text-text-muted rounded-lg disabled:opacity-30"
        >
          ← Previous
        </button>

        <button
          onClick={handleNextQuestion}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
        >
          {currentQIdx < currentQuestions.length - 1 ? 'Next →' : 'Finish sub-test →'}
        </button>
      </div>

      {/* Question dots navigation */}
      <div className="flex flex-wrap gap-1 justify-center mt-4">
        {currentQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentQIdx(i);
              setSelectedAnswer(answers[q.id] ?? null);
            }}
            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
              i === currentQIdx
                ? 'bg-primary text-bg'
                : answers[q.id] !== undefined
                  ? flagged.has(q.id)
                    ? 'bg-warning/30 text-warning border border-warning'
                    : 'bg-success/30 text-success'
                  : 'bg-bg-hover text-text-muted'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MockExam;
