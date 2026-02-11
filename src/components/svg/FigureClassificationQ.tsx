import React from 'react';
import type { FigureClassificationQuestion } from '../../lib/types';
import CompoundFigureRenderer, { CompoundFigureCard } from './CompoundFigureRenderer';

interface Props {
  question: FigureClassificationQuestion;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

const FigureClassificationQ: React.FC<Props> = ({
  question,
  selectedAnswer,
  onSelect,
  showFeedback = false,
  disabled = false,
}) => {
  const labels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Three given figures */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-text-muted text-sm mr-2">Given figures:</span>
        <div className="flex gap-3">
          {question.figures.map((fig, i) => (
            <div key={i} className="bg-white rounded-lg p-1">
              <svg width={120} height={120} viewBox="0 0 100 100">
                <CompoundFigureRenderer figure={fig} />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-bg-hover" />

      {/* Five answer choices */}
      <div>
        <p className="text-text-muted text-sm mb-3 text-center">
          Which figure belongs with the group?
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          {question.choices.map((choice, i) => {
            let borderClass = '';
            if (showFeedback && selectedAnswer !== null) {
              if (i === question.correctAnswer) {
                borderClass = 'ring-2 ring-success';
              } else if (i === selectedAnswer && i !== question.correctAnswer) {
                borderClass = 'ring-2 ring-danger';
              }
            }
            return (
              <div key={i} className={borderClass + ' rounded-lg'}>
                <CompoundFigureCard
                  figure={choice}
                  selected={selectedAnswer === i}
                  onClick={() => onSelect(i)}
                  label={labels[i]}
                  disabled={disabled}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FigureClassificationQ;
