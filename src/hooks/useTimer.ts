import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialSeconds: number;
  autoStart?: boolean;
  onTimeUp?: () => void;
  countUp?: boolean;
}

interface UseTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
  formattedTime: string;
  percentage: number;
  isWarning: boolean;
  isDanger: boolean;
}

export function useTimer({
  initialSeconds,
  autoStart = false,
  onTimeUp,
  countUp = false,
}: UseTimerOptions): UseTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onTimeUpRef = useRef(onTimeUp);
  const initialRef = useRef(initialSeconds);

  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (countUp) {
          return prev + 1;
        }
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, countUp]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds?: number) => {
    const s = newSeconds ?? initialRef.current;
    setSeconds(s);
    initialRef.current = s;
    setIsRunning(false);
  }, []);

  const formatTime = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const percentage = countUp
    ? 0
    : initialRef.current > 0
      ? (seconds / initialRef.current) * 100
      : 0;

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    formattedTime: formatTime(seconds),
    percentage,
    isWarning: !countUp && percentage <= 30 && percentage > 10,
    isDanger: !countUp && percentage <= 10,
  };
}

export function useSessionTimer() {
  return useTimer({
    initialSeconds: 0,
    autoStart: true,
    countUp: true,
  });
}

export function formatSessionTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
