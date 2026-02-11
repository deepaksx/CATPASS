export type SubTestId =
  | 'figure-classification'
  | 'figure-matrices'
  | 'verbal-classification'
  | 'verbal-analogies'
  | 'number-analogies'
  | 'number-series'
  | 'figure-analysis'
  | 'figure-recognition';

export type Phase = 'dashboard' | 'wordStudy' | 'practice';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SubTestInfo {
  id: SubTestId;
  name: string;
  part: number;
  questionCount: number;
  timeMinutes: number;
  secondsPerQuestion: number;
}

export const SUB_TESTS: SubTestInfo[] = [
  { id: 'figure-classification', name: 'Figure Classification', part: 1, questionCount: 24, timeMinutes: 10, secondsPerQuestion: 25 },
  { id: 'figure-matrices', name: 'Figure Matrices', part: 1, questionCount: 24, timeMinutes: 10, secondsPerQuestion: 25 },
  { id: 'verbal-classification', name: 'Verbal Classification', part: 2, questionCount: 24, timeMinutes: 8, secondsPerQuestion: 20 },
  { id: 'verbal-analogies', name: 'Verbal Analogies', part: 2, questionCount: 24, timeMinutes: 8, secondsPerQuestion: 20 },
  { id: 'number-analogies', name: 'Number Analogies', part: 2, questionCount: 18, timeMinutes: 10, secondsPerQuestion: 33 },
  { id: 'number-series', name: 'Number Series', part: 3, questionCount: 18, timeMinutes: 8, secondsPerQuestion: 27 },
  { id: 'figure-analysis', name: 'Figure Analysis', part: 3, questionCount: 18, timeMinutes: 9, secondsPerQuestion: 30 },
  { id: 'figure-recognition', name: 'Figure Recognition', part: 3, questionCount: 18, timeMinutes: 9, secondsPerQuestion: 30 },
];

export type ShapeType = 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star' | 'arrow' | 'cross' | 'diamond' | 'rectangle' | 'parallelogram' | 'semicircle' | 'oval';
export type FillType = 'solid' | 'empty' | 'gray' | 'striped-horizontal' | 'striped-vertical' | 'striped-diagonal' | 'dotted';
export type BorderStyle = 'solid' | 'dashed' | 'double' | 'thick' | 'thin';

export type LayerPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type LayerSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';

export interface FigureLayer {
  shape: ShapeType;
  size: LayerSize;
  position: LayerPosition;
  fill: FillType;
  rotation?: number;
  borderStyle?: BorderStyle;
}

export interface CompoundFigure {
  layers: FigureLayer[];
}

export interface ShapeConfig {
  shapeType: ShapeType;
  fill: FillType;
  rotation?: number;
  size?: 'small' | 'medium' | 'large';
  innerShape?: ShapeType | 'dot' | 'none';
  borderStyle?: BorderStyle;
  count?: number;
}

export interface FigureClassificationQuestion {
  type: 'figure-classification';
  id: string;
  difficulty: Difficulty;
  rule: string;
  figures: CompoundFigure[];
  choices: CompoundFigure[];
  correctAnswer: number; // 0-4
  explanation: string;
}

export interface MatrixTransform {
  type: 'rotation' | 'color-inversion' | 'element-addition' | 'size-change' | 'reflection';
  value: number | string;
}

export interface FigureMatrixQuestion {
  type: 'figure-matrices';
  id: string;
  difficulty: Difficulty;
  gridSize: 2 | 3;
  cells: (ShapeConfig | null)[];
  missingIndex: number;
  choices: ShapeConfig[];
  correctAnswer: number;
  rowRule: string;
  colRule?: string;
  explanation: string;
}

export type FoldDirection = 'left' | 'right' | 'top' | 'bottom' | 'diagonal-tl' | 'diagonal-tr';

export interface PunchPosition {
  x: number;
  y: number;
}

export interface FigureAnalysisQuestion {
  type: 'figure-analysis';
  id: string;
  difficulty: Difficulty;
  folds: FoldDirection[];
  punchPosition: PunchPosition;
  choices: PunchPosition[][];
  correctAnswer: number;
  explanation: string;
}

export interface FigureRecognitionQuestion {
  type: 'figure-recognition';
  id: string;
  difficulty: Difficulty;
  targetShape: string; // SVG path data for target
  complexFigure: string; // SVG content for complex figure
  targetLocation: { x: number; y: number };
  choices: { label: string; highlighted: string }[];
  correctAnswer: number;
  explanation: string;
}

export interface TextQuestion {
  type: 'verbal-classification' | 'verbal-analogies' | 'number-analogies' | 'number-series';
  id: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
  rule?: string;
}

export type Question =
  | FigureClassificationQuestion
  | FigureMatrixQuestion
  | FigureAnalysisQuestion
  | FigureRecognitionQuestion
  | TextQuestion;

export interface TrickItem {
  icon: string;
  title: string;
  description: string;
}

export interface SubTestTricks {
  subTestId: SubTestId;
  title: string;
  tricks: TrickItem[];
}

export interface WorkedExampleStep {
  text: string;
  highlight?: string;
}

export interface WorkedExample {
  question: Question;
  steps: WorkedExampleStep[];
}

export interface SkillMastery {
  attempted: number;
  correct: number;
  currentStreak: number;
  bestStreak: number;
  lastDifficulty: Difficulty;
}

export interface UserProgress {
  studentName: string;
  sessionStartTime: number;
  skillMastery: Record<SubTestId, SkillMastery>;
  totalQuestionsAnswered: number;
}

export function getDefaultSkillMastery(): SkillMastery {
  return { attempted: 0, correct: 0, currentStreak: 0, bestStreak: 0, lastDifficulty: 'easy' };
}

export function getDefaultProgress(name: string): UserProgress {
  const skillMastery = {} as Record<SubTestId, SkillMastery>;
  SUB_TESTS.forEach(st => {
    skillMastery[st.id] = getDefaultSkillMastery();
  });

  return {
    studentName: name,
    sessionStartTime: Date.now(),
    skillMastery,
    totalQuestionsAnswered: 0,
  };
}
