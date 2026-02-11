import React from 'react';
import type { Question } from '../lib/types';
import AnswerChoices from './AnswerChoices';
import FigureClassificationQ from './svg/FigureClassificationQ';
import FigureMatrixQ from './svg/FigureMatrixQ';
import PaperFoldingQ from './svg/PaperFoldingQ';
import FigureRecognitionQ from './svg/FigureRecognitionQ';

interface QuestionCardProps {
  question: Question;
  questionNumber?: number;
  totalQuestions?: number;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  showFeedback?: boolean;
  disabled?: boolean;
  flagged?: boolean;
  onFlag?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelect,
  showFeedback = false,
  disabled = false,
  flagged = false,
  onFlag,
}) => {
  const renderVisualQuestion = () => {
    switch (question.type) {
      case 'figure-classification':
        return (
          <FigureClassificationQ
            question={question}
            selectedAnswer={selectedAnswer}
            onSelect={onSelect}
            showFeedback={showFeedback}
            disabled={disabled}
          />
        );
      case 'figure-matrices':
        return (
          <FigureMatrixQ
            question={question}
            selectedAnswer={selectedAnswer}
            onSelect={onSelect}
            showFeedback={showFeedback}
            disabled={disabled}
          />
        );
      case 'figure-analysis':
        return (
          <PaperFoldingQ
            question={question}
            selectedAnswer={selectedAnswer}
            onSelect={onSelect}
            showFeedback={showFeedback}
            disabled={disabled}
          />
        );
      case 'figure-recognition':
        return (
          <FigureRecognitionQ
            question={question}
            selectedAnswer={selectedAnswer}
            onSelect={onSelect}
            showFeedback={showFeedback}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  const isVisual = ['figure-classification', 'figure-matrices', 'figure-analysis', 'figure-recognition'].includes(question.type);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question header */}
      <div className="flex items-center justify-between mb-4">
        {questionNumber && totalQuestions && (
          <span className="text-text-muted text-sm">
            Question {questionNumber} of {totalQuestions}
          </span>
        )}
        {onFlag && (
          <button
            onClick={onFlag}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              flagged
                ? 'border-warning text-warning bg-warning/10'
                : 'border-bg-hover text-text-muted hover:border-warning hover:text-warning'
            }`}
          >
            {flagged ? '⚑ Flagged' : '⚐ Flag'}
          </button>
        )}
      </div>

      {isVisual ? (
        renderVisualQuestion()
      ) : (
        <>
          {/* Text-based question prompt */}
          <div className="mb-6">
            <p className="text-lg font-medium text-text leading-relaxed">
              {(question as any).prompt}
            </p>
          </div>

          {/* Text answer choices */}
          <AnswerChoices
            choices={(question as any).choices}
            selectedAnswer={selectedAnswer}
            correctAnswer={showFeedback ? question.correctAnswer : undefined}
            onSelect={onSelect}
            showFeedback={showFeedback}
            disabled={disabled}
          />
        </>
      )}
    </div>
  );
};

export default QuestionCard;
