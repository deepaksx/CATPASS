import { type SubTestId, SUB_TESTS } from './types';

export interface BatteryScore {
  name: string;
  subTests: SubTestId[];
  correct: number;
  total: number;
  percentage: number;
}

export interface ExamResult {
  totalCorrect: number;
  totalQuestions: number;
  percentage: number;
  batteries: BatteryScore[];
  estimatedSAS: number;
  estimatedStanine: number;
  estimatedPercentile: number;
}

const BATTERIES: { name: string; subTests: SubTestId[] }[] = [
  { name: 'Non-Verbal Reasoning', subTests: ['figure-classification', 'figure-matrices'] },
  { name: 'Verbal Reasoning', subTests: ['verbal-classification', 'verbal-analogies'] },
  { name: 'Quantitative Reasoning', subTests: ['number-analogies', 'number-series'] },
  { name: 'Spatial Ability', subTests: ['figure-analysis', 'figure-recognition'] },
];

export function calculateExamResult(
  scores: Record<SubTestId, { correct: number; total: number }>
): ExamResult {
  let totalCorrect = 0;
  let totalQuestions = 0;

  const batteries: BatteryScore[] = BATTERIES.map(battery => {
    let bCorrect = 0;
    let bTotal = 0;
    battery.subTests.forEach(stId => {
      const s = scores[stId];
      if (s) {
        bCorrect += s.correct;
        bTotal += s.total;
      }
    });
    totalCorrect += bCorrect;
    totalQuestions += bTotal;
    return {
      name: battery.name,
      subTests: battery.subTests,
      correct: bCorrect,
      total: bTotal,
      percentage: bTotal > 0 ? Math.round((bCorrect / bTotal) * 100) : 0,
    };
  });

  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const estimatedSAS = percentageToSAS(percentage);
  const estimatedStanine = sasToStanine(estimatedSAS);
  const estimatedPercentile = sasToPercentile(estimatedSAS);

  return {
    totalCorrect,
    totalQuestions,
    percentage,
    batteries,
    estimatedSAS,
    estimatedStanine,
    estimatedPercentile,
  };
}

function percentageToSAS(pct: number): number {
  // Approximate SAS mapping: 50% ≈ 100 SAS (average), scale roughly
  // SAS range: 69-141, mean 100, SD 15
  if (pct >= 98) return 141;
  if (pct >= 95) return 135;
  if (pct >= 90) return 128;
  if (pct >= 85) return 122;
  if (pct >= 80) return 118;
  if (pct >= 75) return 114;
  if (pct >= 70) return 110;
  if (pct >= 65) return 106;
  if (pct >= 60) return 103;
  if (pct >= 55) return 100;
  if (pct >= 50) return 97;
  if (pct >= 45) return 94;
  if (pct >= 40) return 91;
  if (pct >= 35) return 87;
  if (pct >= 30) return 83;
  if (pct >= 25) return 79;
  if (pct >= 20) return 75;
  return 69;
}

function sasToStanine(sas: number): number {
  if (sas >= 127) return 9;
  if (sas >= 119) return 8;
  if (sas >= 112) return 7;
  if (sas >= 104) return 6;
  if (sas >= 97) return 5;
  if (sas >= 89) return 4;
  if (sas >= 81) return 3;
  if (sas >= 74) return 2;
  return 1;
}

function sasToPercentile(sas: number): number {
  if (sas >= 141) return 99;
  if (sas >= 135) return 98;
  if (sas >= 130) return 96;
  if (sas >= 125) return 93;
  if (sas >= 120) return 89;
  if (sas >= 115) return 84;
  if (sas >= 110) return 75;
  if (sas >= 105) return 63;
  if (sas >= 100) return 50;
  if (sas >= 95) return 37;
  if (sas >= 90) return 25;
  if (sas >= 85) return 16;
  if (sas >= 80) return 9;
  if (sas >= 75) return 5;
  return 2;
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-success';
  if (percentage >= 60) return 'text-warning';
  return 'text-danger';
}

export function getScoreBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-success/20 border-success/40';
  if (percentage >= 60) return 'bg-warning/20 border-warning/40';
  return 'bg-danger/20 border-danger/40';
}

export function getScoreMessage(percentage: number): string {
  if (percentage >= 80) return "Strong — you'll do great here";
  if (percentage >= 60) return 'Solid — a few more practice rounds would help';
  return 'Focus area — review the tricks and drill more';
}

export function getDrillMessage(percentage: number): { message: string; action: string } {
  if (percentage < 60) {
    return {
      message: "Let's review the tricks",
      action: 'Review tricks then try 5 more questions',
    };
  }
  if (percentage <= 80) {
    return {
      message: 'Good progress! A few more to lock it in',
      action: '3 more questions',
    };
  }
  return {
    message: "You've got this! Moving on.",
    action: 'Continue to next sub-test',
  };
}

export function allocateDrillTime(
  diagnosticScores: Record<SubTestId, number>
): Record<SubTestId, { minutes: number; questionCount: number }> {
  const allocation: Record<string, { minutes: number; questionCount: number }> = {};

  SUB_TESTS.forEach(st => {
    const score = diagnosticScores[st.id] || 0;
    if (score <= 1) {
      allocation[st.id] = { minutes: 8, questionCount: 14 };
    } else if (score === 2) {
      allocation[st.id] = { minutes: 5, questionCount: 9 };
    } else {
      allocation[st.id] = { minutes: 2, questionCount: 4 };
    }
  });

  return allocation as Record<SubTestId, { minutes: number; questionCount: number }>;
}
