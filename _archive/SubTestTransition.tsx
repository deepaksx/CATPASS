import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { SubTestInfo } from '../lib/types';

interface SubTestTransitionProps {
  subTest: SubTestInfo;
  subTestNumber: number;
  totalSubTests: number;
  isBreak?: boolean;
  onReady: () => void;
}

const SubTestTransition: React.FC<SubTestTransitionProps> = ({
  subTest,
  subTestNumber,
  totalSubTests,
  isBreak = false,
  onReady,
}) => {
  const [countdown, setCountdown] = useState(isBreak ? 10 : 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onReady();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onReady]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {isBreak ? (
          <>
            <span className="text-4xl mb-4 block">😮‍💨</span>
            <h2 className="text-2xl font-bold text-text mb-2">Take a breath!</h2>
            <p className="text-text-muted mb-4">
              Part {subTest.part} starts in {countdown} seconds
            </p>
          </>
        ) : (
          <>
            <span className="text-primary text-sm font-semibold">
              Sub-test {subTestNumber} of {totalSubTests}
            </span>
            <h2 className="text-2xl font-bold text-text mt-2 mb-1">
              {subTest.name}
            </h2>
            <div className="flex justify-center gap-6 my-4">
              <div>
                <p className="text-2xl font-bold text-primary">{subTest.questionCount}</p>
                <p className="text-text-muted text-xs">questions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{subTest.timeMinutes}</p>
                <p className="text-text-muted text-xs">minutes</p>
              </div>
            </div>
            <p className="text-text-muted text-sm mb-4">
              Starting in {countdown}...
            </p>
          </>
        )}

        <button
          onClick={onReady}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
        >
          Start now
        </button>
      </motion.div>
    </div>
  );
};

export default SubTestTransition;
