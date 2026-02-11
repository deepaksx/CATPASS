import React from 'react';
import type { FigureAnalysisQuestion, FoldDirection } from '../../lib/types';

interface Props {
  question: FigureAnalysisQuestion;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

const PAPER_SIZE = 160;
const HOLE_RADIUS = 7;

function renderFoldSequence(
  folds: FoldDirection[],
  punchPosition: { x: number; y: number }
) {
  const steps: React.ReactNode[] = [];

  // Step 1: Original paper
  steps.push(
    <div key="original" className="flex flex-col items-center">
      <svg width={PAPER_SIZE} height={PAPER_SIZE} viewBox="0 0 100 100">
        <rect x={5} y={5} width={90} height={90} fill="white" stroke="black" strokeWidth={2} />
        <text x={50} y={55} textAnchor="middle" fontSize={10} fill="gray">Paper</text>
      </svg>
      <span className="text-xs text-text-muted mt-1">Start</span>
    </div>
  );

  // Show each fold
  let currentW = 90;
  let currentH = 90;
  let offsetX = 5;
  let offsetY = 5;

  folds.forEach((fold, idx) => {
    switch (fold) {
      case 'right':
      case 'left':
        currentW = currentW / 2;
        if (fold === 'right') offsetX = offsetX + currentW;
        break;
      case 'top':
      case 'bottom':
        currentH = currentH / 2;
        if (fold === 'bottom') offsetY = offsetY + currentH;
        break;
      case 'diagonal-tl':
      case 'diagonal-tr':
        currentW = currentW * 0.7;
        currentH = currentH * 0.7;
        break;
    }

    const foldLabel = {
      right: 'Fold right →',
      left: '← Fold left',
      top: 'Fold up ↑',
      bottom: 'Fold down ↓',
      'diagonal-tl': 'Fold ↖',
      'diagonal-tr': 'Fold ↗',
    }[fold];

    steps.push(
      <div key={`arrow-${idx}`} className="flex items-center">
        <span className="text-primary text-lg">→</span>
      </div>
    );

    const isLastFold = idx === folds.length - 1;
    const punchX = offsetX + punchPosition.x * currentW;
    const punchY = offsetY + punchPosition.y * currentH;

    steps.push(
      <div key={`fold-${idx}`} className="flex flex-col items-center">
        <svg width={PAPER_SIZE} height={PAPER_SIZE} viewBox="0 0 100 100">
          <rect
            x={offsetX}
            y={offsetY}
            width={currentW}
            height={currentH}
            fill="#f0f0f0"
            stroke="black"
            strokeWidth={2}
          />
          {/* Fold line indicator */}
          {(fold === 'right' || fold === 'left') && (
            <line
              x1={offsetX}
              y1={offsetY}
              x2={offsetX}
              y2={offsetY + currentH}
              stroke="blue"
              strokeWidth={1}
              strokeDasharray="4,2"
            />
          )}
          {(fold === 'top' || fold === 'bottom') && (
            <line
              x1={offsetX}
              y1={offsetY}
              x2={offsetX + currentW}
              y2={offsetY}
              stroke="blue"
              strokeWidth={1}
              strokeDasharray="4,2"
            />
          )}
          {/* Punch hole on last fold */}
          {isLastFold && (
            <circle
              cx={punchX}
              cy={punchY}
              r={HOLE_RADIUS}
              fill="black"
              stroke="black"
              strokeWidth={1}
            />
          )}
        </svg>
        <span className="text-xs text-text-muted mt-1">{foldLabel}</span>
        {isLastFold && <span className="text-xs text-primary">● Punch here</span>}
      </div>
    );
  });

  return steps;
}

function renderUnfoldedPaper(holes: { x: number; y: number }[], highlight?: string) {
  return (
    <svg width={PAPER_SIZE} height={PAPER_SIZE} viewBox="0 0 100 100">
      <rect x={5} y={5} width={90} height={90} fill="white" stroke="black" strokeWidth={2} />
      {/* Grid lines for reference */}
      <line x1={50} y1={5} x2={50} y2={95} stroke="#ddd" strokeWidth={0.5} />
      <line x1={5} y1={50} x2={95} y2={50} stroke="#ddd" strokeWidth={0.5} />
      {/* Holes */}
      {holes.map((hole, i) => (
        <circle
          key={i}
          cx={5 + hole.x * 90}
          cy={5 + hole.y * 90}
          r={HOLE_RADIUS}
          fill="black"
        />
      ))}
    </svg>
  );
}

const PaperFoldingQ: React.FC<Props> = ({
  question,
  selectedAnswer,
  onSelect,
  showFeedback = false,
  disabled = false,
}) => {
  const labels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Fold sequence */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {renderFoldSequence(question.folds, question.punchPosition)}
      </div>

      <div className="w-full h-px bg-bg-hover" />

      {/* Question */}
      <p className="text-text-muted text-sm text-center">
        What does the paper look like when unfolded?
      </p>

      {/* Answer choices */}
      <div className="flex gap-3 flex-wrap justify-center">
        {question.choices.map((holes, i) => {
          let borderClass = 'border-2 border-bg-hover';
          if (selectedAnswer === i) {
            borderClass = 'border-2 border-primary';
          }
          if (showFeedback && selectedAnswer !== null) {
            if (i === question.correctAnswer) {
              borderClass = 'border-2 border-success ring-2 ring-success';
            } else if (i === selectedAnswer && i !== question.correctAnswer) {
              borderClass = 'border-2 border-danger ring-2 ring-danger';
            }
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${borderClass} ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-text-muted'
              }`}
            >
              {renderUnfoldedPaper(holes)}
              <span className="text-sm font-bold text-text-muted">{labels[i]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaperFoldingQ;
