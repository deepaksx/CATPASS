import type { SubTestTricks, SubTestId } from '../lib/types';

export const allTricks: SubTestTricks[] = [
  {
    subTestId: 'figure-classification',
    title: 'Figure Classification Tricks',
    tricks: [
      {
        icon: '🔢',
        title: 'COUNT THE SIDES',
        description: 'All shapes might be pentagons, or all have the same number of sides. Count carefully — a star has 10 edges!',
      },
      {
        icon: '🎨',
        title: 'CHECK THE SHADING',
        description: 'Look at fill patterns: solid (black), empty (white), striped, or dotted. All three figures often share the same shading.',
      },
      {
        icon: '🪞',
        title: 'LOOK FOR SYMMETRY',
        description: 'Do all figures have a vertical or horizontal axis of symmetry? Asymmetric shapes stand out.',
      },
      {
        icon: '🔍',
        title: 'COUNT INTERNAL ELEMENTS',
        description: 'Count shapes inside each figure — dots, small circles, lines. The number inside often matches across all three.',
      },
      {
        icon: '🔄',
        title: 'CHECK ROTATION',
        description: 'Figures might all point the same direction or share the same orientation. A rotated answer might be the odd one out.',
      },
    ],
  },
  {
    subTestId: 'figure-matrices',
    title: 'Figure Matrices Tricks',
    tricks: [
      {
        icon: '➡️',
        title: 'ROW RULE',
        description: 'Look across each row: what changes from left to right? Rotation? Added element? Colour flip? The same change applies to every row.',
      },
      {
        icon: '⬇️',
        title: 'COLUMN RULE',
        description: 'Look down each column: the same transformation should apply going top to bottom.',
      },
      {
        icon: '🔀',
        title: 'COMBINATION',
        description: 'Sometimes BOTH a row rule AND a column rule apply at the same time. Check both directions.',
      },
      {
        icon: '🔄',
        title: 'COMMON TRANSFORMATIONS',
        description: '90° rotation, reflection, element addition/removal, colour inversion (black↔white), size change. Try these first.',
      },
      {
        icon: '❌',
        title: 'ELIMINATION',
        description: "If stuck, test each answer choice against BOTH the row and column patterns. Wrong answers usually break at least one rule.",
      },
    ],
  },
  {
    subTestId: 'verbal-classification',
    title: 'Verbal Classification Tricks',
    tricks: [
      {
        icon: '📦',
        title: 'FIND THE CATEGORY',
        description: "What's the TIGHTEST group all 3 words fit into? Don't pick a word that's only loosely related.",
      },
      {
        icon: '⚠️',
        title: 'AVOID TRAPS',
        description: "One wrong answer is always a word that's related but from a DIFFERENT category. 'Jupiter' is related to 'Zeus' but it's Roman, not Greek.",
      },
      {
        icon: '✅',
        title: 'TEST EACH OPTION',
        description: 'Mentally say: "Is [word] a type of [category]?" If it doesn\'t fit perfectly, it\'s wrong.',
      },
      {
        icon: '🎯',
        title: 'SPECIFICITY',
        description: 'The category is usually MORE SPECIFIC than you think. Not just "animals" but "marine mammals". Not just "instruments" but "woodwinds".',
      },
    ],
  },
  {
    subTestId: 'verbal-analogies',
    title: 'Verbal Analogies Tricks',
    tricks: [
      {
        icon: '🏷️',
        title: 'NAME THE RELATIONSHIP',
        description: 'Before looking at answers, say the relationship out loud: "is a part of", "is the opposite of", "is used by".',
      },
      {
        icon: '📝',
        title: 'BUILD A SENTENCE',
        description: '"A is to B" → make a sentence like "A pen is used to write". Then apply the SAME sentence: "A knife is used to ___".',
      },
      {
        icon: '↔️',
        title: 'WATCH FOR DIRECTION',
        description: '"big→small" is DIFFERENT from "small→big". Make sure your answer follows the same direction as the original pair.',
      },
      {
        icon: '📋',
        title: 'COMMON RELATIONSHIPS',
        description: 'Opposites, synonyms, part→whole, tool→user, cause→effect, degree (warm→hot), worker→workplace, young→adult.',
      },
    ],
  },
  {
    subTestId: 'number-analogies',
    title: 'Number Analogies Tricks',
    tricks: [
      {
        icon: '➕',
        title: 'TRY SIMPLE OPERATIONS FIRST',
        description: 'Start with ×2, ÷2, +10, -5, square (n²), square root (√n). Simple rules are the most common.',
      },
      {
        icon: '✔️',
        title: 'CHECK BOTH PAIRS',
        description: 'The operation MUST work identically on BOTH given pairs. If it only works for one pair, keep looking.',
      },
      {
        icon: '🔗',
        title: 'MULTI-STEP OPERATIONS',
        description: 'If simple operations don\'t work, try combos: "×2 then +1", "square then -1", "n²+1".',
      },
      {
        icon: '⚡',
        title: 'COMMON LEVEL F OPERATIONS',
        description: 'Square roots (√), cubes (n³), n²+1, n²-1, n(n+1), ÷3, ÷4. These appear very frequently.',
      },
    ],
  },
  {
    subTestId: 'number-series',
    title: 'Number Series Tricks',
    tricks: [
      {
        icon: '➖',
        title: 'WRITE THE DIFFERENCES',
        description: 'Subtract each number from the next. If differences are constant (e.g., always +3), it\'s arithmetic.',
      },
      {
        icon: '➗',
        title: 'CHECK RATIOS',
        description: 'Divide each number by the previous. If ratios are constant (e.g., always ×2), it\'s geometric.',
      },
      {
        icon: '📐',
        title: 'DIFFERENCES OF DIFFERENCES',
        description: "If first differences aren't constant, take differences of THOSE. If second differences are constant, the pattern is quadratic.",
      },
      {
        icon: '🔀',
        title: 'ALTERNATING SEQUENCES',
        description: 'Look at odd positions and even positions separately. Two interleaved sequences is a common Level F trick.',
      },
      {
        icon: '⚡',
        title: 'COMMON PATTERNS',
        description: 'Increasing differences (+1,+2,+3), perfect squares, cubes, Fibonacci, ×2+1, prime numbers, triangular numbers.',
      },
    ],
  },
  {
    subTestId: 'figure-analysis',
    title: 'Figure Analysis (Paper Folding) Tricks',
    tricks: [
      {
        icon: '📌',
        title: 'TRACK ONE CORNER',
        description: 'Pick a corner of the paper and mentally follow it through each fold. This helps you track which layers are where.',
      },
      {
        icon: '🔄',
        title: 'UNFOLD IN REVERSE',
        description: 'Undo the LAST fold first, then the previous one. Work backwards from the punch to find all hole positions.',
      },
      {
        icon: '✖️',
        title: 'HOLES MULTIPLY',
        description: 'One punch through 2 layers = 2 holes when unfolded. Through 4 layers = 4 holes. Count layers to predict hole count.',
      },
      {
        icon: '🪞',
        title: 'SYMMETRY IS KEY',
        description: 'Holes mirror across each fold line. Vertical fold = holes are symmetric left-right. Horizontal fold = symmetric top-bottom.',
      },
      {
        icon: '❌',
        title: 'ELIMINATION BY COUNTING',
        description: 'Count the expected total holes first, then immediately rule out answers with the wrong number of holes.',
      },
    ],
  },
  {
    subTestId: 'figure-recognition',
    title: 'Figure Recognition Tricks',
    tricks: [
      {
        icon: '📏',
        title: 'EXACT MATCH',
        description: 'The target shape must be the EXACT same size, rotation, and proportions. No stretching, no flipping, no resizing.',
      },
      {
        icon: '✏️',
        title: 'TRACE THE EDGES',
        description: "Mentally trace the outline of the target shape, then scan the complex figure for that exact outline. Don't get distracted by extra lines.",
      },
      {
        icon: '🔍',
        title: 'START WITH DISTINCTIVE FEATURES',
        description: 'Find the most UNIQUE part of the target shape (an unusual angle, a notch). Search for that feature first in the complex figure.',
      },
      {
        icon: '🚫',
        title: 'IGNORE DISTRACTORS',
        description: 'The complex figure has many overlapping lines designed to confuse you. Focus only on the lines that could form the target shape.',
      },
    ],
  },
];

export function getTricksForSubTest(subTestId: SubTestId): SubTestTricks | undefined {
  return allTricks.find(t => t.subTestId === subTestId);
}
