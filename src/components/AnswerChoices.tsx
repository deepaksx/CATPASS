import React from 'react';
import { motion } from 'framer-motion';

interface AnswerChoicesProps {
  choices: string[];
  selectedAnswer: number | null;
  correctAnswer?: number;
  onSelect: (index: number) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

const AnswerChoices: React.FC<AnswerChoicesProps> = ({
  choices,
  selectedAnswer,
  correctAnswer,
  onSelect,
  showFeedback = false,
  disabled = false,
}) => {
  const labels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex flex-col gap-2 w-full">
      {choices.map((choice, i) => {
        let bgClass = 'bg-bg-card border-bg-hover hover:border-text-muted hover:bg-bg-hover';
        let textClass = 'text-text';

        if (selectedAnswer === i && !showFeedback) {
          bgClass = 'bg-primary/20 border-primary';
          textClass = 'text-primary';
        }

        if (showFeedback && correctAnswer !== undefined) {
          if (i === correctAnswer) {
            bgClass = 'bg-success/20 border-success';
            textClass = 'text-success';
          } else if (i === selectedAnswer && i !== correctAnswer) {
            bgClass = 'bg-danger/20 border-danger';
            textClass = 'text-danger';
          } else {
            bgClass = 'bg-bg-card border-bg-hover opacity-50';
          }
        }

        return (
          <motion.button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors min-h-[60px] text-left ${bgClass} ${
              disabled && !showFeedback ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            initial={showFeedback && i === correctAnswer ? { scale: 0.95 } : {}}
            animate={showFeedback && i === correctAnswer ? { scale: 1 } : {}}
          >
            <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
              selectedAnswer === i ? 'border-current bg-current/10' : 'border-text-muted'
            } ${textClass}`}>
              {labels[i]}
            </span>
            <span className={`text-base ${textClass}`}>{choice}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default AnswerChoices;
