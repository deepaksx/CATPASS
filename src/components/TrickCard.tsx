import React from 'react';
import { motion } from 'framer-motion';
import type { TrickItem } from '../lib/types';

interface TrickCardProps {
  trick: TrickItem;
  index: number;
}

const TrickCard: React.FC<TrickCardProps> = ({ trick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 p-3 bg-bg-card rounded-lg border border-bg-hover"
    >
      <span className="text-2xl flex-shrink-0">{trick.icon}</span>
      <div>
        <h4 className="font-bold text-primary text-sm">{trick.title}</h4>
        <p className="text-text-muted text-sm mt-1">{trick.description}</p>
      </div>
    </motion.div>
  );
};

export default TrickCard;
