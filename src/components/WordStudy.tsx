import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { verbalAnalogiesVocabulary } from '../data/vocabulary';

interface WordStudyProps {
  onStart: () => void;
  onBack: () => void;
}

const WordStudy: React.FC<WordStudyProps> = ({ onStart, onBack }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-text text-lg">Verbal Analogies — Word List</h3>
          <p className="text-text-muted text-xs">
            Study these words before you begin. Once you start, you cannot come back.
          </p>
        </div>
        <button onClick={onBack} className="text-text-muted hover:text-text text-sm">
          ← Dashboard
        </button>
      </div>

      {/* Word count */}
      <div className="mb-4 text-center">
        <span className="text-primary text-sm font-semibold">
          {verbalAnalogiesVocabulary.length} words to study
        </span>
      </div>

      {/* Word list */}
      <div className="flex flex-col gap-1.5 mb-6">
        {verbalAnalogiesVocabulary.map((item, i) => (
          <motion.div
            key={item.word}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 1) }}
            className="flex gap-3 p-2.5 rounded-lg bg-bg-card border border-bg-hover"
          >
            <span className="font-bold text-primary text-sm min-w-[120px] shrink-0">
              {item.word}
            </span>
            <span className="text-text text-sm">
              {item.meaning}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Start button */}
      <div className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-bg via-bg to-transparent">
        <div className="max-w-sm mx-auto flex flex-col gap-3">
          {!confirmed ? (
            <button
              onClick={() => setConfirmed(true)}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg text-lg transition-colors"
            >
              I'm ready — Start Practice
            </button>
          ) : (
            <div className="text-center">
              <p className="text-warning text-sm mb-3 font-semibold">
                Are you sure? You won't be able to see these words again during practice.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onStart}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark text-bg font-bold rounded-lg transition-colors"
                >
                  Yes, start now
                </button>
                <button
                  onClick={() => setConfirmed(false)}
                  className="px-6 py-3 bg-bg-card border border-bg-hover text-text-muted rounded-lg transition-colors"
                >
                  Keep studying
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordStudy;
