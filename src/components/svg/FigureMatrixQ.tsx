import React from 'react';
import type { FigureMatrixQuestion } from '../../lib/types';
import ShapeRenderer, { ShapeCard } from './ShapeRenderer';

interface Props {
  question: FigureMatrixQuestion;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

const FigureMatrixQ: React.FC<Props> = ({
  question,
  selectedAnswer,
  onSelect,
  showFeedback = false,
  disabled = false,
}) => {
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const gridCols = question.gridSize;
  const cellSize = question.gridSize === 2 ? 90 : 70;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Matrix grid */}
      <div
        className="inline-grid gap-1 bg-gray-600 p-1 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
        }}
      >
        {question.cells.map((cell, i) => (
          <div
            key={i}
            className={`bg-white rounded flex items-center justify-center ${
              i === question.missingIndex ? 'bg-gray-200' : ''
            }`}
            style={{ width: cellSize, height: cellSize }}
          >
            {i === question.missingIndex ? (
              <span className="text-3xl text-gray-400 font-bold">?</span>
            ) : cell ? (
              <svg width={cellSize - 10} height={cellSize - 10} viewBox="0 0 100 100">
                <ShapeRenderer config={cell} cx={50} cy={50} />
              </svg>
            ) : null}
          </div>
        ))}
      </div>

      <div className="w-full h-px bg-bg-hover" />

      {/* Answer choices */}
      <div>
        <p className="text-text-muted text-sm mb-3 text-center">
          Which figure completes the pattern?
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
                <ShapeCard
                  config={choice}
                  size={cellSize - 10}
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

export default FigureMatrixQ;
