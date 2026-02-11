import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  formattedTime: string;
  percentage?: number;
  isWarning?: boolean;
  isDanger?: boolean;
  label?: string;
  large?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  formattedTime,
  percentage = 100,
  isWarning = false,
  isDanger = false,
  label,
  large = false,
}) => {
  const colorClass = isDanger
    ? 'text-danger'
    : isWarning
      ? 'text-warning'
      : 'text-text';

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-text-muted text-sm">{label}</span>}
      <motion.span
        className={`font-mono font-bold ${colorClass} ${large ? 'text-3xl' : 'text-lg'}`}
        animate={isDanger ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        {formattedTime}
      </motion.span>
    </div>
  );
};

export default Timer;
