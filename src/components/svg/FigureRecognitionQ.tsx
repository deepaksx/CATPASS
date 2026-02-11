import React, { useMemo } from 'react';
import type { FigureRecognitionQuestion } from '../../lib/types';

interface Props {
  question: FigureRecognitionQuestion;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

type TargetShapeId = string;

function getTargetPath(shape: TargetShapeId): string {
  switch (shape) {
    case 'L-shape':
      return 'M 0 0 L 30 0 L 30 10 L 10 10 L 10 30 L 0 30 Z';
    case 'T-shape':
      return 'M 0 0 L 30 0 L 30 10 L 20 10 L 20 30 L 10 30 L 10 10 L 0 10 Z';
    case 'Z-shape':
      return 'M 0 0 L 20 0 L 20 10 L 30 10 L 30 30 L 10 30 L 10 20 L 0 20 Z';
    case 'arrow-right':
      return 'M 0 8 L 20 8 L 20 0 L 35 15 L 20 30 L 20 22 L 0 22 Z';
    case 'cross':
      return 'M 10 0 L 20 0 L 20 10 L 30 10 L 30 20 L 20 20 L 20 30 L 10 30 L 10 20 L 0 20 L 0 10 L 10 10 Z';
    case 'triangle':
      return 'M 15 0 L 30 30 L 0 30 Z';
    case 'parallelogram':
      return 'M 10 0 L 35 0 L 25 25 L 0 25 Z';
    case 'bracket':
      return 'M 0 0 L 20 0 L 20 8 L 8 8 L 8 22 L 20 22 L 20 30 L 0 30 Z';
    case 'step':
      return 'M 0 15 L 15 15 L 15 0 L 30 0 L 30 15 L 30 30 L 15 30 L 0 30 Z';
    case 'hook':
      return 'M 5 0 L 15 0 L 15 20 L 25 20 L 25 30 L 0 30 L 0 20 L 5 20 Z';
    default:
      return 'M 0 0 L 30 0 L 30 30 L 0 30 Z';
  }
}

function generateComplexFigure(seed: number, targetPath: string, targetLoc: { x: number; y: number }): React.ReactNode {
  const lines: React.ReactNode[] = [];
  const rng = mulberry32(seed);

  // Generate random background lines
  for (let i = 0; i < 25; i++) {
    const x1 = rng() * 200;
    const y1 = rng() * 200;
    const x2 = rng() * 200;
    const y2 = rng() * 200;
    lines.push(
      <line
        key={`line-${i}`}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="black" strokeWidth={1.5}
      />
    );
  }

  // Generate random shapes for distraction
  for (let i = 0; i < 8; i++) {
    const cx = rng() * 180 + 10;
    const cy = rng() * 180 + 10;
    const r = 10 + rng() * 20;
    const sides = Math.floor(rng() * 4) + 3;
    const pts = Array.from({ length: sides }, (_, j) => {
      const angle = (j / sides) * Math.PI * 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
    lines.push(
      <polygon
        key={`poly-${i}`}
        points={pts}
        fill="none"
        stroke="black"
        strokeWidth={1.5}
      />
    );
  }

  // Add the target shape at the specified location
  const tx = targetLoc.x * 170 + 5;
  const ty = targetLoc.y * 170 + 5;
  lines.push(
    <g key="target" transform={`translate(${tx}, ${ty})`}>
      <path d={targetPath} fill="none" stroke="black" strokeWidth={1.5} />
    </g>
  );

  return lines;
}

// Simple seeded random
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const FigureRecognitionQ: React.FC<Props> = ({
  question,
  selectedAnswer,
  onSelect,
  showFeedback = false,
  disabled = false,
}) => {
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const targetPath = getTargetPath(question.targetShape);
  const seed = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < question.id.length; i++) {
      hash = ((hash << 5) - hash) + question.id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }, [question.id]);

  const complexBg = useMemo(
    () => generateComplexFigure(seed, targetPath, question.targetLocation),
    [seed, targetPath, question.targetLocation]
  );

  // Generate 5 highlighted areas for choices
  const choiceAreas = useMemo(() => {
    const rng = mulberry32(seed + 100);
    const areas: { x: number; y: number }[] = [];

    // Correct answer position
    const correctIdx = question.correctAnswer;
    for (let i = 0; i < 5; i++) {
      if (i === correctIdx) {
        areas.push({
          x: question.targetLocation.x * 170 + 5,
          y: question.targetLocation.y * 170 + 5,
        });
      } else {
        areas.push({
          x: rng() * 150 + 10,
          y: rng() * 150 + 10,
        });
      }
    }
    return areas;
  }, [seed, question]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-start gap-6 flex-wrap justify-center">
        {/* Target shape */}
        <div className="flex flex-col items-center">
          <span className="text-text-muted text-sm mb-2">Find this shape:</span>
          <div className="bg-white rounded-lg p-3">
            <svg width={80} height={80} viewBox="-5 -5 40 40">
              <path d={targetPath} fill="none" stroke="black" strokeWidth={2} />
            </svg>
          </div>
        </div>

        {/* Complex figure */}
        <div className="flex flex-col items-center">
          <span className="text-text-muted text-sm mb-2">In this figure:</span>
          <div className="bg-white rounded-lg p-2">
            <svg width={200} height={200} viewBox="0 0 200 200">
              {complexBg}
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-bg-hover" />

      {/* Answer choices - highlighted regions */}
      <p className="text-text-muted text-sm text-center">
        Which highlighted area contains the target shape?
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {choiceAreas.map((area, i) => {
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
              <div className="bg-white rounded">
                <svg width={90} height={90} viewBox="0 0 200 200">
                  {complexBg}
                  <rect
                    x={area.x - 5}
                    y={area.y - 5}
                    width={45}
                    height={45}
                    fill="rgba(56, 189, 248, 0.15)"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    rx={3}
                  />
                </svg>
              </div>
              <span className="text-sm font-bold text-text-muted">{labels[i]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FigureRecognitionQ;
