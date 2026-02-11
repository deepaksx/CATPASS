import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, SubTestId, Difficulty } from '../lib/types';
import { generateQuestions } from '../services/gemini';

const BATCH_SIZE = 3;
const REFILL_THRESHOLD = 1;

export function useQuestionBuffer(subTestId: SubTestId, difficulty: Difficulty) {
  const [buffer, setBuffer] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  const fetchQuestions = useCallback(async (diff: Difficulty) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsLoading(prev => prev); // Keep current loading state

    try {
      const newQuestions = await generateQuestions(subTestId, diff, BATCH_SIZE);
      if (!mountedRef.current) return;

      if (newQuestions.length === 0) {
        setError('Failed to generate questions. Please try again.');
      } else {
        setBuffer(prev => [...prev, ...newQuestions]);
        setError(null);
      }
    } catch (e) {
      if (!mountedRef.current) return;
      const msg = e instanceof Error ? e.message : 'Failed to generate questions';
      setError(msg);
    } finally {
      if (mountedRef.current) {
        fetchingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [subTestId]);

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;
    setBuffer([]);
    setCurrentIndex(0);
    setIsLoading(true);
    setError(null);
    fetchingRef.current = false;
    fetchQuestions(difficulty);

    return () => {
      mountedRef.current = false;
    };
  }, [subTestId, difficulty, fetchQuestions]);

  // Auto-refill when buffer runs low
  useEffect(() => {
    const remaining = buffer.length - currentIndex;
    if (remaining <= REFILL_THRESHOLD && remaining >= 0 && !fetchingRef.current && !error && buffer.length > 0) {
      fetchQuestions(difficulty);
    }
  }, [currentIndex, buffer.length, difficulty, error, fetchQuestions]);

  const currentQuestion = buffer[currentIndex] || null;

  const nextQuestion = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= buffer.length) {
        setIsLoading(true);
      }
      return next;
    });
  }, [buffer.length]);

  const retry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    fetchingRef.current = false;
    fetchQuestions(difficulty);
  }, [difficulty, fetchQuestions]);

  return {
    currentQuestion,
    isLoading: isLoading && !currentQuestion,
    isLoadingNext: isLoading && !!currentQuestion,
    error,
    nextQuestion,
    retry,
    questionsAnswered: currentIndex,
  };
}
