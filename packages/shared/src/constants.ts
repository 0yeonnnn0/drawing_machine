import type { DrawTool } from './types';

// Drawing color palette (12 colors)
export const PALETTE_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#ff914d',
  '#ffde59', '#7ed957', '#5ce1e6', '#4a90e2',
  '#cb6ce6', '#ff66c4', '#804000', '#808080',
] as const;

// Cursor colors for participants
export const CURSOR_COLORS = [
  '#5ce1e6', // cm-blue
  '#ff66c4', // cm-pink
  '#7ed957', // cm-green
  '#ff914d', // cm-orange
  '#cb6ce6', // cm-purple
  '#ffde59', // cm-yellow
  '#ff0000', // red
  '#4a90e2', // blue
] as const;

// Stroke width presets
export const STROKE_WIDTHS = {
  thin: 2,
  medium: 5,
  thick: 10,
} as const;

// Tools
export const DRAW_TOOLS: { id: DrawTool; label: string }[] = [
  { id: 'pen', label: 'Pen' },
  { id: 'eraser', label: 'Eraser' },
  { id: 'text', label: 'Text' },
  { id: 'image', label: 'Image' },
];

// --- Korean nickname generator ---
const ADJECTIVES = [
  '행복한', '용감한', '빛나는', '귀여운', '멋진',
  '신나는', '따뜻한', '활발한', '재빠른', '영리한',
  '씩씩한', '다정한', '깜찍한', '든든한', '기발한',
  '느긋한', '유쾌한', '상냥한', '대담한', '포근한',
];

const NOUNS = [
  '고양이', '강아지', '토끼', '여우', '곰',
  '펭귄', '부엉이', '다람쥐', '코끼리', '기린',
  '별', '달', '구름', '바람', '파도',
  '붓', '연필', '팔레트', '캔버스', '물감',
];

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}
