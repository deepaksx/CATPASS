import type { Question, SubTestId, Difficulty } from './types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getQuestionsForSubTest(
  allQuestions: Question[],
  subTestId: SubTestId,
  usedIds: string[],
  count: number,
  balanceDifficulty = true
): Question[] {
  const typeMap: Record<SubTestId, string> = {
    'figure-classification': 'figure-classification',
    'figure-matrices': 'figure-matrices',
    'verbal-classification': 'verbal-classification',
    'verbal-analogies': 'verbal-analogies',
    'number-analogies': 'number-analogies',
    'number-series': 'number-series',
    'figure-analysis': 'figure-analysis',
    'figure-recognition': 'figure-recognition',
  };

  const available = allQuestions.filter(
    q => q.type === typeMap[subTestId] && !usedIds.includes(q.id)
  );

  if (!balanceDifficulty) {
    return shuffleArray(available).slice(0, count);
  }

  // Balance difficulty: roughly equal easy/medium/hard
  const easy = shuffleArray(available.filter(q => q.difficulty === 'easy'));
  const medium = shuffleArray(available.filter(q => q.difficulty === 'medium'));
  const hard = shuffleArray(available.filter(q => q.difficulty === 'hard'));

  const perDifficulty = Math.ceil(count / 3);
  const selected: Question[] = [
    ...easy.slice(0, perDifficulty),
    ...medium.slice(0, perDifficulty),
    ...hard.slice(0, perDifficulty),
  ].slice(0, count);

  // Interleave: easy, medium, hard pattern
  const result: Question[] = [];
  const groups: Question[][] = [
    easy.slice(0, perDifficulty),
    medium.slice(0, perDifficulty),
    hard.slice(0, perDifficulty),
  ];

  let idx = 0;
  while (result.length < count && result.length < selected.length) {
    for (const group of groups) {
      if (idx < group.length && result.length < count) {
        result.push(group[idx]);
      }
    }
    idx++;
  }

  return result;
}

export function getTutorialQuestions(
  allQuestions: Question[],
  subTestId: SubTestId,
  usedIds: string[]
): { examples: Question[]; practice: Question[] } {
  const typeMap: Record<SubTestId, string> = {
    'figure-classification': 'figure-classification',
    'figure-matrices': 'figure-matrices',
    'verbal-classification': 'verbal-classification',
    'verbal-analogies': 'verbal-analogies',
    'number-analogies': 'number-analogies',
    'number-series': 'number-series',
    'figure-analysis': 'figure-analysis',
    'figure-recognition': 'figure-recognition',
  };

  const available = allQuestions.filter(
    q => q.type === typeMap[subTestId] && !usedIds.includes(q.id)
  );

  const easy = shuffleArray(available.filter(q => q.difficulty === 'easy'));
  const medium = shuffleArray(available.filter(q => q.difficulty === 'medium'));

  // 3 worked examples (easy)
  const examples = easy.slice(0, 3);
  // 3 practice questions (mix of easy and medium)
  const practice = [...easy.slice(3, 5), ...medium.slice(0, 1)];

  return { examples: examples.slice(0, 3), practice: practice.slice(0, 3) };
}

export function getDiagnosticQuestions(
  allQuestions: Question[],
  usedIds: string[]
): Record<SubTestId, Question[]> {
  const subTestIds: SubTestId[] = [
    'figure-classification', 'figure-matrices',
    'verbal-classification', 'verbal-analogies',
    'number-analogies', 'number-series',
    'figure-analysis', 'figure-recognition',
  ];

  const result: Record<string, Question[]> = {};
  subTestIds.forEach(stId => {
    result[stId] = getQuestionsForSubTest(allQuestions, stId, usedIds, 3, true);
  });

  return result as Record<SubTestId, Question[]>;
}

export function getMockExamQuestions(
  allQuestions: Question[],
  usedIds: string[]
): Record<SubTestId, Question[]> {
  const subTestCounts: Record<SubTestId, number> = {
    'figure-classification': 24,
    'figure-matrices': 24,
    'verbal-classification': 24,
    'verbal-analogies': 24,
    'number-analogies': 18,
    'number-series': 18,
    'figure-analysis': 18,
    'figure-recognition': 18,
  };

  const result: Record<string, Question[]> = {};
  (Object.keys(subTestCounts) as SubTestId[]).forEach(stId => {
    result[stId] = getQuestionsForSubTest(
      allQuestions, stId, usedIds, subTestCounts[stId], true
    );
  });

  return result as Record<SubTestId, Question[]>;
}
