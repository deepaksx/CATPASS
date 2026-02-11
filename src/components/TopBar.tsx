import React from 'react';
import Timer from './Timer';
import { formatSessionTime } from '../hooks/useTimer';

interface TopBarProps {
  phase: string;
  sessionSeconds: number;
  subTestTimer?: {
    formattedTime: string;
    percentage: number;
    isWarning: boolean;
    isDanger: boolean;
  };
  progress?: {
    current: number;
    total: number;
  };
  onBack?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  phase,
  sessionSeconds,
  subTestTimer,
  progress,
  onBack,
}) => {
  const progressPercent = progress
    ? (progress.current / progress.total) * 100
    : 0;

  return (
    <div className="sticky top-0 z-50 bg-bg/95 backdrop-blur border-b border-bg-hover">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="text-text-muted hover:text-text transition-colors text-sm"
              >
                ← Back
              </button>
            )}
            <span className="text-primary font-semibold text-sm">{phase}</span>
          </div>

          <div className="flex items-center gap-4">
            {subTestTimer && (
              <Timer
                formattedTime={subTestTimer.formattedTime}
                percentage={subTestTimer.percentage}
                isWarning={subTestTimer.isWarning}
                isDanger={subTestTimer.isDanger}
                large
              />
            )}
            <div className="text-text-muted text-xs font-mono">
              {formatSessionTime(sessionSeconds)} / 3:00:00
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {progress && (
          <div className="mt-1 h-1 bg-bg-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
