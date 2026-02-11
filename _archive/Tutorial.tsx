import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type SubTestId, SUB_TESTS, type Question } from '../lib/types';
import { getTricksForSubTest } from '../data/tricks';
import TrickCard from './TrickCard';
import QuestionCard from './QuestionCard';
import Explanation from './Explanation';
import { getTutorialQuestions } from '../lib/questionPool';

interface TutorialProps {
  allQuestions: Question[];
  usedQuestionIds: string[];
  onQuestionUsed: (ids: string[]) => void;
  onSubTestScore: (subTestId: SubTestId, score: number) => void;
  onComplete: () => void;
  startSubTest?: number;
}

type TutorialScreen = 'what-you-see' | 'patterns' | 'worked-examples' | 'quick-check';

const Tutorial: React.FC<TutorialProps> = ({
  allQuestions,
  usedQuestionIds,
  onQuestionUsed,
  onSubTestScore,
  onComplete,
  startSubTest = 0,
}) => {
  const [currentSubTestIdx, setCurrentSubTestIdx] = useState(startSubTest);
  const [screen, setScreen] = useState<TutorialScreen>('what-you-see');
  const [workedExampleIdx, setWorkedExampleIdx] = useState(0);
  const [workedExampleStep, setWorkedExampleStep] = useState(0);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [needsRetry, setNeedsRetry] = useState(false);

  const subTest = SUB_TESTS[currentSubTestIdx];
  const tricks = getTricksForSubTest(subTest.id);

  const { examples, practice } = useMemo(() => {
    return getTutorialQuestions(allQuestions, subTest.id, usedQuestionIds);
  }, [allQuestions, subTest.id, usedQuestionIds]);

  useEffect(() => {
    if (examples.length > 0 || practice.length > 0) {
      const ids = [...examples.map(q => q.id), ...practice.map(q => q.id)];
      onQuestionUsed(ids);
    }
  }, [currentSubTestIdx]);

  const handleNextScreen = useCallback(() => {
    switch (screen) {
      case 'what-you-see':
        setScreen('patterns');
        break;
      case 'patterns':
        setScreen('worked-examples');
        setWorkedExampleIdx(0);
        setWorkedExampleStep(0);
        break;
      case 'worked-examples':
        setScreen('quick-check');
        setPracticeIdx(0);
        setPracticeScore(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        break;
      case 'quick-check':
        // Move to next sub-test or complete
        if (currentSubTestIdx < SUB_TESTS.length - 1) {
          setCurrentSubTestIdx(prev => prev + 1);
          setScreen('what-you-see');
          setWorkedExampleIdx(0);
          setWorkedExampleStep(0);
          setPracticeIdx(0);
          setPracticeScore(0);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setNeedsRetry(false);
        } else {
          onComplete();
        }
        break;
    }
  }, [screen, currentSubTestIdx, onComplete]);

  const handlePracticeAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === practice[practiceIdx]?.correctAnswer) {
      setPracticeScore(prev => prev + 1);
    }
  };

  const handlePracticeNext = () => {
    if (practiceIdx < practice.length - 1) {
      setPracticeIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // End of practice
      const score = practiceScore + (selectedAnswer === practice[practiceIdx]?.correctAnswer ? 0 : 0);
      const finalScore = practiceScore;
      onSubTestScore(subTest.id, finalScore);

      if (finalScore < 2 && !needsRetry) {
        setNeedsRetry(true);
      } else {
        handleNextScreen();
      }
    }
  };

  const handleRetry = () => {
    setScreen('patterns');
    setNeedsRetry(false);
    setPracticeIdx(0);
    setPracticeScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const renderWhatYouSee = () => (
    <motion.div
      key="what-you-see"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <span className="text-primary text-sm font-semibold">
          Sub-test {currentSubTestIdx + 1} of 8
        </span>
        <h2 className="text-2xl font-bold text-text mt-1">{subTest.name}</h2>
      </div>

      <div className="bg-bg-card rounded-lg p-6 w-full max-w-md text-center">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-2xl font-bold text-primary">{subTest.questionCount}</p>
            <p className="text-text-muted text-xs">questions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{subTest.timeMinutes}</p>
            <p className="text-text-muted text-xs">minutes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">{subTest.secondsPerQuestion}s</p>
            <p className="text-text-muted text-xs">per question</p>
          </div>
        </div>
        <p className="text-text-muted text-sm">
          You get <strong className="text-text">{subTest.secondsPerQuestion} seconds</strong> per question.
          {subTest.secondsPerQuestion <= 25 ? " That's fast — work quickly!" : " Take your time but stay focused."}
        </p>
      </div>

      <button
        onClick={handleNextScreen}
        className="px-8 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg transition-colors"
      >
        Show me the patterns →
      </button>
    </motion.div>
  );

  const renderPatterns = () => (
    <motion.div
      key="patterns"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex flex-col gap-4 w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-text">The Secret Patterns</h2>
        <p className="text-text-muted text-sm">{subTest.name}</p>
      </div>

      {tricks?.tricks.map((trick, i) => (
        <TrickCard key={i} trick={trick} index={i} />
      ))}

      <button
        onClick={handleNextScreen}
        className="mt-4 px-8 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg transition-colors self-center"
      >
        Watch me solve it →
      </button>
    </motion.div>
  );

  const renderWorkedExamples = () => {
    const example = examples[workedExampleIdx];
    if (!example) {
      return (
        <div className="text-center">
          <p className="text-text-muted">No examples available for this sub-test.</p>
          <button
            onClick={handleNextScreen}
            className="mt-4 px-8 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
          >
            Start practice →
          </button>
        </div>
      );
    }

    const steps = [
      "Look at the question carefully...",
      `The pattern here is: ${example.explanation}`,
      `So the answer is: ${String.fromCharCode(65 + example.correctAnswer)}`,
    ];

    return (
      <motion.div
        key={`worked-${workedExampleIdx}`}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="text-center">
          <span className="text-primary text-sm">
            Worked Example {workedExampleIdx + 1} of {examples.length}
          </span>
          <h2 className="text-xl font-bold text-text">Watch Me Solve It</h2>
        </div>

        <QuestionCard
          question={example}
          selectedAnswer={workedExampleStep >= 2 ? example.correctAnswer : null}
          onSelect={() => {}}
          showFeedback={workedExampleStep >= 2}
          disabled={true}
        />

        {/* Step-by-step reveal */}
        <div className="w-full max-w-lg space-y-2">
          {steps.slice(0, workedExampleStep + 1).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-bg-card rounded-lg border border-bg-hover"
            >
              <p className="text-text text-sm">
                <span className="text-primary font-bold">Step {i + 1}:</span> {step}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          {workedExampleStep < steps.length - 1 ? (
            <button
              onClick={() => setWorkedExampleStep(prev => prev + 1)}
              className="px-6 py-2 bg-bg-card border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Next step →
            </button>
          ) : workedExampleIdx < examples.length - 1 ? (
            <button
              onClick={() => {
                setWorkedExampleIdx(prev => prev + 1);
                setWorkedExampleStep(0);
              }}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg transition-colors"
            >
              Next example →
            </button>
          ) : (
            <button
              onClick={handleNextScreen}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg transition-colors"
            >
              Your turn — Quick Check →
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const renderQuickCheck = () => {
    if (needsRetry) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="text-4xl">📝</span>
          <h3 className="text-xl font-bold text-warning">
            Let's review the tricks again
          </h3>
          <p className="text-text-muted">
            You got {practiceScore}/3. You need at least 2/3 to move on.
            Let's review the patterns one more time.
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
          >
            Review patterns and try again
          </button>
        </motion.div>
      );
    }

    const currentQ = practice[practiceIdx];
    if (!currentQ) {
      return (
        <div className="text-center">
          <p className="text-text-muted">Moving on...</p>
          <button
            onClick={handleNextScreen}
            className="mt-4 px-8 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
          >
            Continue →
          </button>
        </div>
      );
    }

    return (
      <motion.div
        key={`practice-${practiceIdx}`}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col items-center gap-4 w-full"
      >
        <div className="text-center">
          <span className="text-primary text-sm">Quick Check — {subTest.name}</span>
          <p className="text-text-muted text-sm">
            Question {practiceIdx + 1} of {practice.length} — Score: {practiceScore}/{practiceIdx + (showFeedback ? 1 : 0)}
          </p>
        </div>

        <QuestionCard
          question={currentQ}
          questionNumber={practiceIdx + 1}
          totalQuestions={practice.length}
          selectedAnswer={selectedAnswer}
          onSelect={handlePracticeAnswer}
          showFeedback={showFeedback}
          disabled={showFeedback}
        />

        {showFeedback && (
          <Explanation
            show={true}
            isCorrect={selectedAnswer === currentQ.correctAnswer}
            explanation={currentQ.explanation}
            rule={'rule' in currentQ ? (currentQ as any).rule : undefined}
            onContinue={handlePracticeNext}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="py-6 px-4">
      {/* Sub-test progress */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex gap-1">
          {SUB_TESTS.map((st, i) => (
            <div
              key={st.id}
              className={`flex-1 h-1.5 rounded-full ${
                i < currentSubTestIdx
                  ? 'bg-success'
                  : i === currentSubTestIdx
                    ? 'bg-primary'
                    : 'bg-bg-hover'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {screen === 'what-you-see' && renderWhatYouSee()}
        {screen === 'patterns' && renderPatterns()}
        {screen === 'worked-examples' && renderWorkedExamples()}
        {screen === 'quick-check' && renderQuickCheck()}
      </AnimatePresence>
    </div>
  );
};

export default Tutorial;
