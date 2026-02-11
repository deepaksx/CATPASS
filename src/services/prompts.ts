import type { Difficulty, SubTestId } from '../lib/types';
import { verbalAnalogiesVocabulary } from '../data/vocabulary';

const DIFFICULTY_GUIDANCE: Record<Difficulty, string> = {
  easy: 'Simple, single-step reasoning. Common vocabulary/patterns. One clear rule.',
  medium: 'Two-step reasoning required. Less obvious patterns. Some distractors.',
  hard: 'Multi-step reasoning. Subtle patterns. Strong distractors that test deep understanding.',
};

export function getTextQuestionPrompt(subTestId: SubTestId, difficulty: Difficulty, count: number): string {
  const diffGuide = DIFFICULTY_GUIDANCE[difficulty];

  const typePrompts: Record<string, string> = {
    'verbal-classification': `Generate ${count} CAT4 Level F Verbal Classification questions for 13-15 year old students.

Each question shows 3 words that share a common characteristic. The student must choose which of 5 options also belongs to the group.

Difficulty: ${difficulty} — ${diffGuide}

Rules:
- The 3 given words must share ONE clear, specific connection (category, property, relationship)
- Exactly 1 of the 5 choices must fit that connection
- The 4 wrong choices should be plausible but NOT fit the specific connection
- Use age-appropriate vocabulary for 13-15 year olds
- Cover diverse categories: animals, science, geography, language, abstract concepts
- The prompt format: "Word1  Word2  Word3" (the 3 group words shown together)

Example:
{
  "prompt": "Mercury  Venus  Mars",
  "choices": ["Jupiter", "Moon", "Sun", "Pluto", "Asteroid"],
  "correctAnswer": 0,
  "explanation": "Mercury, Venus, and Mars are all planets in our solar system. Jupiter is also a planet. Moon is a satellite, Sun is a star, Pluto is a dwarf planet, and Asteroid is a small rocky body.",
  "rule": "Planets in our solar system"
}`,

    'verbal-analogies': (() => {
      const wordList = verbalAnalogiesVocabulary.map(w => `${w.word} — ${w.meaning}`).join('\n');
      return `Generate ${count} CAT4 Level F Verbal Analogies questions for 13-15 year old students.

Format: "A is to B as C is to ?" — the student picks the word that completes the analogy from 5 choices.

Difficulty: ${difficulty} — ${diffGuide}

CRITICAL REQUIREMENT — USE THESE WORDS:
You MUST use words from the following vocabulary list in every question. Each question's prompt words (A, B, C) AND the correct answer AND wrong choices should come from or directly relate to these words. The student has studied this exact word list, so the questions must test their knowledge of these specific words and their meanings.

VOCABULARY LIST:
${wordList}

Rules:
- Every question MUST feature words from the vocabulary list above
- The relationship between A→B must be the same type as C→answer
- Relationship types: synonyms, antonyms, part:whole, cause:effect, degree/intensity, category membership
- Exactly 1 of the 5 choices correctly completes the analogy
- Wrong choices should be other words from the vocabulary list that don't fit the relationship
- Test the student's understanding of these specific word meanings

Example:
{
  "prompt": "Ovation is to Silence as Expenditure is to ?",
  "choices": ["Savings", "Flourish", "Drought", "Permanent", "Abundant"],
  "correctAnswer": 0,
  "explanation": "Ovation (applause) and Silence are antonyms. Expenditure (spending) and Savings are also antonyms. The relationship is opposites.",
  "rule": "Antonyms (opposites)"
}`;
    })(),

    'number-analogies': `Generate ${count} CAT4 Level F Number Analogies questions for 13-15 year old students.

Format: Two number pairs follow the same rule. The student must find the number that completes a third pair.

Difficulty: ${difficulty} — ${diffGuide}

Rules:
- The operation connecting each pair must be identical (e.g., ×2, +5, square, etc.)
- Present as: "[A → B]  [C → D]  [E → ?]"
- Provide 5 numeric choices, only 1 correct
- Operations can include: add, subtract, multiply, divide, square, cube, double, halve, percentage
- For hard difficulty: two-step operations (e.g., ×2 then +1), or relationships between pairs

Example:
{
  "prompt": "[3 → 9]  [5 → 25]  [4 → ?]",
  "choices": ["8", "12", "16", "20", "24"],
  "correctAnswer": 2,
  "explanation": "Each number is squared: 3²=9, 5²=25, so 4²=16.",
  "rule": "Square the number"
}`,

    'number-series': `Generate ${count} CAT4 Level F Number Series questions for 13-15 year old students.

A sequence of numbers follows a pattern. The student must find the next number.

Difficulty: ${difficulty} — ${diffGuide}

Rules:
- The series must follow a clear, deterministic pattern
- Provide 5 numeric choices, only 1 correct
- Pattern types: constant addition/subtraction, multiplication, alternating operations, fibonacci-like, increasing/decreasing differences, interleaved sequences
- For hard: two interleaved series, or changing operations
- Show 5-7 numbers in the series

Example:
{
  "prompt": "2, 6, 18, 54, ?",
  "choices": ["108", "162", "72", "148", "126"],
  "correctAnswer": 1,
  "explanation": "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162.",
  "rule": "Multiply by 3"
}`,
  };

  const base = typePrompts[subTestId];
  if (!base) return '';

  return `${base}

Return a JSON array of ${count} question objects. Each object must have these exact fields:
- "prompt": string (the question text)
- "choices": string[] (exactly 5 choices)
- "correctAnswer": number (0-4 index of correct choice)
- "explanation": string (clear explanation of why the answer is correct)
- "rule": string (the underlying rule/pattern)

IMPORTANT: Return ONLY valid JSON array. No markdown, no code blocks, just the array.`;
}

export function getFigureClassificationPrompt(difficulty: Difficulty, count: number): string {
  return `Generate ${count} CAT4 Level F Figure Classification questions as JSON.

In Figure Classification, 3 figures share a common rule. The student picks which of 5 choices also follows that rule.

Difficulty: ${difficulty} — ${DIFFICULTY_GUIDANCE[difficulty]}

Each figure is described as a ShapeConfig object with these fields:
- "shapeType": one of "circle", "triangle", "square", "pentagon", "hexagon", "star", "arrow", "cross", "diamond"
- "fill": one of "solid", "empty", "striped-horizontal", "striped-vertical", "striped-diagonal", "dotted"
- "rotation": number (degrees, optional, default 0)
- "size": one of "small", "medium", "large" (optional, default "medium")
- "innerShape": one of "circle", "triangle", "square", "pentagon", "hexagon", "star", "arrow", "cross", "diamond", "dot", "none" (optional)
- "borderStyle": one of "solid", "dashed", "double", "thick", "thin" (optional, default "solid")
- "count": number (how many of this shape, optional, default 1)

Rules for generating:
- The 3 figures must share exactly ONE clear visual rule (same shape, same fill, same size, same border, etc.)
- The correct choice (1 of 5) must also follow this rule
- The 4 wrong choices should NOT follow the rule but look plausible
- For easy: single property rule (all circles, all solid fill)
- For medium: two properties (all solid triangles) or transformed property (all rotated 90°)
- For hard: combination of properties or subtle rules

Return a JSON array of ${count} objects, each with:
- "rule": string (the classification rule)
- "figures": ShapeConfig[] (exactly 3 figures that follow the rule)
- "choices": ShapeConfig[] (exactly 5 choices, one correct)
- "correctAnswer": number (0-4 index)
- "explanation": string

IMPORTANT: Return ONLY valid JSON array. No markdown, no code blocks.`;
}

export function getFigureMatrixPrompt(difficulty: Difficulty, count: number): string {
  return `Generate ${count} CAT4 Level F Figure Matrix questions as JSON.

A figure matrix is a grid (2x2 or 3x3) where shapes follow rules across rows and columns. One cell is missing and the student must pick the correct shape.

Each shape is a ShapeConfig:
- "shapeType": one of "circle", "triangle", "square", "pentagon", "hexagon", "star", "arrow", "cross", "diamond"
- "fill": one of "solid", "empty", "striped-horizontal", "striped-vertical", "striped-diagonal", "dotted"
- "rotation": number (degrees, optional)
- "size": one of "small", "medium", "large" (optional)
- "innerShape": one of "circle", "triangle", "square", "pentagon", "hexagon", "star", "arrow", "cross", "diamond", "dot", "none" (optional)
- "borderStyle": one of "solid", "dashed", "double", "thick", "thin" (optional)

Rules:
- For easy: 2x2 grid, single row rule (same shape changes fill across row)
- For medium: 3x3 grid, clear row rule
- For hard: 3x3 grid with both row AND column rules

Return JSON array of ${count} objects:
- "gridSize": 2 or 3
- "cells": ShapeConfig[] (${difficulty === 'easy' ? '4' : '9'} cells in row-major order, the missing cell should be null)
- "missingIndex": number (index of null cell, 0-based)
- "choices": ShapeConfig[] (exactly 5 choices)
- "correctAnswer": number (0-4)
- "rowRule": string
- "colRule": string (optional, for 3x3 grids)
- "explanation": string

IMPORTANT: Return ONLY valid JSON array. No markdown, no code blocks.`;
}

export function getFigureAnalysisPrompt(difficulty: Difficulty, count: number): string {
  return `Generate ${count} CAT4 Level F Figure Analysis (Paper Folding) questions as JSON.

In paper folding: a square piece of paper is folded one or more times, then a hole is punched. The student must determine what the paper looks like when unfolded.

Fold directions: "left", "right", "top", "bottom", "diagonal-tl", "diagonal-tr"
Punch position: {x, y} where x and y are 0-1 (0=left/top, 1=right/bottom)

Rules:
- For easy: 1 fold, punch in obvious position
- For medium: 2 folds, requiring careful tracking
- For hard: 2-3 folds, off-center punch

Each choice is an array of punch positions (PunchPosition[]) representing where the holes appear when unfolded.

Return JSON array of ${count} objects:
- "folds": string[] (fold directions in order)
- "punchPosition": {"x": number, "y": number} (where hole is punched, 0-1 range)
- "choices": PunchPosition[][] (5 choices, each an array of {x,y} positions)
- "correctAnswer": number (0-4)
- "explanation": string

IMPORTANT:
- The correct answer must be mathematically correct — each fold mirrors the punch position
- A fold "left" means folding the right half onto the left
- A fold "top" means folding the bottom half onto the top
- After unfolding, holes appear at the original punch AND its mirror positions for each fold
- Return ONLY valid JSON array. No markdown, no code blocks.`;
}

export function getFigureRecognitionPrompt(difficulty: Difficulty, count: number): string {
  return `Generate ${count} CAT4 Level F Figure Recognition questions as JSON.

In figure recognition, students are shown a simple target shape and must find where it's hidden within a complex figure made of overlapping lines and shapes.

For the target shape, provide an SVG path string (d attribute).
For the complex figure, provide complete SVG content (the inner content of an SVG element, 200x200 viewBox).
The complex figure MUST contain the exact target shape somewhere within it.

Rules:
- For easy: target is a simple shape (triangle, rectangle), complex figure has few overlapping elements
- For medium: target has moderate complexity, more overlapping lines
- For hard: target is subtle, many overlapping and distracting shapes

Each choice highlights a different region. Provide 5 choices with labels (A-E).

Return JSON array of ${count} objects:
- "targetShape": string (SVG path d attribute for the target)
- "complexFigure": string (SVG content for the complex figure, 200x200 viewBox)
- "targetLocation": {"x": number, "y": number} (center of where target appears)
- "choices": [{"label": "A", "highlighted": "SVG content highlighting region A"}, ...] (5 choices)
- "correctAnswer": number (0-4)
- "explanation": string

IMPORTANT: Return ONLY valid JSON array. No markdown, no code blocks.`;
}
