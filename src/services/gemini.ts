import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import type {
  SubTestId,
  Difficulty,
  Question,
  TextQuestion,
  FigureClassificationQuestion,
  FigureMatrixQuestion,
  FigureAnalysisQuestion,
  FigureRecognitionQuestion,
  ShapeConfig,
} from '../lib/types';
import {
  getTextQuestionPrompt,
  getFigureClassificationPrompt,
  getFigureMatrixPrompt,
  getFigureAnalysisPrompt,
  getFigureRecognitionPrompt,
} from './prompts';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const MODEL = 'gemini-2.0-flash';

// Rate limiting: track request timestamps
const requestTimestamps: number[] = [];
const MAX_RPM = 14; // Stay under 15 RPM limit (gemini-2.0-flash allows 15 RPM)

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  // Remove timestamps older than 60s
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > 60000) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_RPM) {
    const waitMs = 60000 - (now - requestTimestamps[0]) + 500;
    await new Promise(resolve => setTimeout(resolve, waitMs));
  }
  requestTimestamps.push(Date.now());
}

// Zod schemas for validation
const textQuestionSchema = z.object({
  prompt: z.string(),
  choices: z.array(z.string()).length(5),
  correctAnswer: z.number().min(0).max(4),
  explanation: z.string(),
  rule: z.string().optional(),
});

const shapeConfigSchema = z.object({
  shapeType: z.enum(['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'star', 'arrow', 'cross', 'diamond']),
  fill: z.enum(['solid', 'empty', 'striped-horizontal', 'striped-vertical', 'striped-diagonal', 'dotted']),
  rotation: z.number().optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  innerShape: z.enum(['circle', 'triangle', 'square', 'pentagon', 'hexagon', 'star', 'arrow', 'cross', 'diamond', 'dot', 'none']).optional(),
  borderStyle: z.enum(['solid', 'dashed', 'double', 'thick', 'thin']).optional(),
  count: z.number().optional(),
});

const figureClassificationSchema = z.object({
  rule: z.string(),
  figures: z.array(shapeConfigSchema).length(3),
  choices: z.array(shapeConfigSchema).length(5),
  correctAnswer: z.number().min(0).max(4),
  explanation: z.string(),
});

const figureMatrixSchema = z.object({
  gridSize: z.union([z.literal(2), z.literal(3)]),
  cells: z.array(shapeConfigSchema.nullable()),
  missingIndex: z.number(),
  choices: z.array(shapeConfigSchema).length(5),
  correctAnswer: z.number().min(0).max(4),
  rowRule: z.string(),
  colRule: z.string().optional(),
  explanation: z.string(),
});

const punchPositionSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

const figureAnalysisSchema = z.object({
  folds: z.array(z.enum(['left', 'right', 'top', 'bottom', 'diagonal-tl', 'diagonal-tr'])),
  punchPosition: punchPositionSchema,
  choices: z.array(z.array(punchPositionSchema)).length(5),
  correctAnswer: z.number().min(0).max(4),
  explanation: z.string(),
});

const figureRecognitionSchema = z.object({
  targetShape: z.string(),
  complexFigure: z.string(),
  targetLocation: z.object({ x: z.number(), y: z.number() }),
  choices: z.array(z.object({ label: z.string(), highlighted: z.string() })).length(5),
  correctAnswer: z.number().min(0).max(4),
  explanation: z.string(),
});

async function callGemini(prompt: string): Promise<string> {
  await waitForRateLimit();

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.9,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');
    return text;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      throw new Error('Rate limit reached. Please wait a minute and try again.');
    }
    if (msg.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API key.');
    }
    throw new Error('Failed to generate question. Please try again.');
  }
}

function parseJsonArray(text: string): unknown[] {
  // Clean up potential markdown code blocks
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error('Expected JSON array');
  }
  return parsed;
}

let questionCounter = 0;
function nextId(prefix: string): string {
  questionCounter += 1;
  return `ai-${prefix}-${Date.now()}-${questionCounter}`;
}

// ── Text Questions (verbal + number) ───────────────────────────────────

const TEXT_SUB_TESTS: SubTestId[] = [
  'verbal-classification',
  'verbal-analogies',
  'number-analogies',
  'number-series',
];

export function isTextSubTest(subTestId: SubTestId): boolean {
  return TEXT_SUB_TESTS.includes(subTestId);
}

export async function generateTextQuestions(
  subTestId: SubTestId,
  difficulty: Difficulty,
  count: number = 3,
): Promise<TextQuestion[]> {
  const prompt = getTextQuestionPrompt(subTestId, difficulty, count);
  const raw = await callGemini(prompt);
  const arr = parseJsonArray(raw);

  const questions: TextQuestion[] = [];
  for (const item of arr) {
    const parsed = textQuestionSchema.safeParse(item);
    if (parsed.success) {
      questions.push({
        type: subTestId as TextQuestion['type'],
        id: nextId(subTestId),
        difficulty,
        prompt: parsed.data.prompt,
        choices: parsed.data.choices,
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation,
        rule: parsed.data.rule,
      });
    }
  }
  return questions;
}

// ── Figure Classification ──────────────────────────────────────────────

export async function generateFigureClassificationQuestions(
  difficulty: Difficulty,
  count: number = 3,
): Promise<FigureClassificationQuestion[]> {
  const prompt = getFigureClassificationPrompt(difficulty, count);
  const raw = await callGemini(prompt);
  const arr = parseJsonArray(raw);

  const questions: FigureClassificationQuestion[] = [];
  for (const item of arr) {
    const parsed = figureClassificationSchema.safeParse(item);
    if (parsed.success) {
      questions.push({
        type: 'figure-classification',
        id: nextId('fc'),
        difficulty,
        rule: parsed.data.rule,
        figures: parsed.data.figures as ShapeConfig[],
        choices: parsed.data.choices as ShapeConfig[],
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation,
      });
    }
  }
  return questions;
}

// ── Figure Matrices ────────────────────────────────────────────────────

export async function generateFigureMatrixQuestions(
  difficulty: Difficulty,
  count: number = 3,
): Promise<FigureMatrixQuestion[]> {
  const prompt = getFigureMatrixPrompt(difficulty, count);
  const raw = await callGemini(prompt);
  const arr = parseJsonArray(raw);

  const questions: FigureMatrixQuestion[] = [];
  for (const item of arr) {
    const parsed = figureMatrixSchema.safeParse(item);
    if (parsed.success) {
      questions.push({
        type: 'figure-matrices',
        id: nextId('fm'),
        difficulty,
        gridSize: parsed.data.gridSize,
        cells: parsed.data.cells as (ShapeConfig | null)[],
        missingIndex: parsed.data.missingIndex,
        choices: parsed.data.choices as ShapeConfig[],
        correctAnswer: parsed.data.correctAnswer,
        rowRule: parsed.data.rowRule,
        colRule: parsed.data.colRule,
        explanation: parsed.data.explanation,
      });
    }
  }
  return questions;
}

// ── Figure Analysis (Paper Folding) ────────────────────────────────────

export async function generateFigureAnalysisQuestions(
  difficulty: Difficulty,
  count: number = 3,
): Promise<FigureAnalysisQuestion[]> {
  const prompt = getFigureAnalysisPrompt(difficulty, count);
  const raw = await callGemini(prompt);
  const arr = parseJsonArray(raw);

  const questions: FigureAnalysisQuestion[] = [];
  for (const item of arr) {
    const parsed = figureAnalysisSchema.safeParse(item);
    if (parsed.success) {
      questions.push({
        type: 'figure-analysis',
        id: nextId('fa'),
        difficulty,
        folds: parsed.data.folds,
        punchPosition: parsed.data.punchPosition,
        choices: parsed.data.choices,
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation,
      });
    }
  }
  return questions;
}

// ── Figure Recognition ─────────────────────────────────────────────────

export async function generateFigureRecognitionQuestions(
  difficulty: Difficulty,
  count: number = 3,
): Promise<FigureRecognitionQuestion[]> {
  const prompt = getFigureRecognitionPrompt(difficulty, count);
  const raw = await callGemini(prompt);
  const arr = parseJsonArray(raw);

  const questions: FigureRecognitionQuestion[] = [];
  for (const item of arr) {
    const parsed = figureRecognitionSchema.safeParse(item);
    if (parsed.success) {
      questions.push({
        type: 'figure-recognition',
        id: nextId('fr'),
        difficulty,
        targetShape: parsed.data.targetShape,
        complexFigure: parsed.data.complexFigure,
        targetLocation: parsed.data.targetLocation,
        choices: parsed.data.choices,
        correctAnswer: parsed.data.correctAnswer,
        explanation: parsed.data.explanation,
      });
    }
  }
  return questions;
}

// ── Unified generator ──────────────────────────────────────────────────

export async function generateQuestions(
  subTestId: SubTestId,
  difficulty: Difficulty,
  count: number = 3,
): Promise<Question[]> {
  switch (subTestId) {
    case 'verbal-classification':
    case 'verbal-analogies':
    case 'number-analogies':
    case 'number-series':
      return generateTextQuestions(subTestId, difficulty, count);
    case 'figure-classification':
      return generateFigureClassificationQuestions(difficulty, count);
    case 'figure-matrices':
      return generateFigureMatrixQuestions(difficulty, count);
    case 'figure-analysis':
      return generateFigureAnalysisQuestions(difficulty, count);
    case 'figure-recognition':
      return generateFigureRecognitionQuestions(difficulty, count);
    default:
      throw new Error(`Unknown sub-test: ${subTestId}`);
  }
}
