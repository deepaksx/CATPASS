import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubTestId } from '../lib/types';
import { getTricksForSubTest } from '../data/tricks';
import TrickCard from './TrickCard';

interface TrickSheetProps {
  subTestId: SubTestId;
  show: boolean;
  onClose: () => void;
}

const TrickSheet: React.FC<TrickSheetProps> = ({ subTestId, show, onClose }) => {
  const tricks = getTricksForSubTest(subTestId);

  return (
    <AnimatePresence>
      {show && tricks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-bg rounded-xl border border-bg-hover max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary">{tricks.title}</h3>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {tricks.tricks.map((trick, i) => (
                <TrickCard key={i} trick={trick} index={i} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrickSheet;
