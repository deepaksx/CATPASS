import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplanationProps {
  show: boolean;
  isCorrect: boolean;
  explanation: string;
  rule?: string;
  trickReference?: string;
  onContinue: () => void;
}

const Explanation: React.FC<ExplanationProps> = ({
  show,
  isCorrect,
  explanation,
  rule,
  trickReference,
  onContinue,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`w-full p-4 rounded-lg border-2 ${
            isCorrect
              ? 'bg-success/10 border-success/30'
              : 'bg-danger/10 border-danger/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">
              {isCorrect ? '✓' : '✗'}
            </span>
            <div className="flex-1">
              <p className={`font-bold mb-1 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className="text-text text-sm">{explanation}</p>
              {rule && (
                <p className="text-text-muted text-xs mt-1">
                  <span className="font-semibold">Pattern:</span> {rule}
                </p>
              )}
              {trickReference && !isCorrect && (
                <p className="text-primary text-xs mt-1">
                  Remember: {trickReference}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onContinue}
            className="mt-3 w-full py-2 px-4 bg-primary hover:bg-primary-dark text-bg font-semibold rounded-lg transition-colors"
          >
            Continue
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Explanation;
