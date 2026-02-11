import React from 'react';
import { motion } from 'framer-motion';
import type { ExamResult } from '../lib/scoring';
import { getScoreColor, getScoreBgColor, getScoreMessage } from '../lib/scoring';

interface ScoreReportProps {
  result: ExamResult;
  onReviewMistakes: () => void;
  onRetakeWorst: () => void;
  onFinish: () => void;
}

const ScoreReport: React.FC<ScoreReportProps> = ({
  result,
  onReviewMistakes,
  onRetakeWorst,
  onFinish,
}) => {
  return (
    <div className="py-6 px-4 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-2">
            {result.percentage >= 80 ? '🌟' : result.percentage >= 60 ? '👍' : '💪'}
          </span>
          <h2 className="text-2xl font-bold text-text">Mock Exam Complete!</h2>
        </div>

        {/* Overall score */}
        <div className="bg-bg-card rounded-xl p-6 mb-6 text-center border border-bg-hover">
          <p className="text-text-muted text-sm mb-1">Raw Score</p>
          <p className="text-4xl font-bold text-text">
            {result.totalCorrect} / {result.totalQuestions}
          </p>
          <p className={`text-2xl font-bold mt-1 ${getScoreColor(result.percentage)}`}>
            {result.percentage}%
          </p>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-bg-hover">
            <div>
              <p className="text-text-muted text-xs">Est. SAS</p>
              <p className="text-lg font-bold text-primary">{result.estimatedSAS}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Stanine</p>
              <p className="text-lg font-bold text-primary">{result.estimatedStanine}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Percentile</p>
              <p className="text-lg font-bold text-primary">{result.estimatedPercentile}th</p>
            </div>
          </div>
        </div>

        {/* Battery breakdown */}
        <div className="space-y-3 mb-6">
          {result.batteries.map(battery => (
            <div
              key={battery.name}
              className={`p-4 rounded-lg border ${getScoreBgColor(battery.percentage)}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-text text-sm">{battery.name}</h4>
                  <p className="text-text-muted text-xs mt-0.5">
                    {getScoreMessage(battery.percentage)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getScoreColor(battery.percentage)}`}>
                    {battery.percentage}%
                  </p>
                  <p className="text-text-muted text-xs">
                    {battery.correct}/{battery.total}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onReviewMistakes}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg"
          >
            Review my mistakes
          </button>
          <button
            onClick={onRetakeWorst}
            className="w-full py-3 bg-bg-card border border-primary text-primary hover:bg-primary/10 rounded-lg"
          >
            Drill my weakest area
          </button>
          <button
            onClick={onFinish}
            className="w-full py-2 text-text-muted hover:text-text text-sm"
          >
            Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScoreReport;
