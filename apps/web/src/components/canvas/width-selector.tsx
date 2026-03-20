'use client';

import { STROKE_WIDTHS } from '@doodleshare/shared';

interface WidthSelectorProps {
  value: number;
  onChange: (width: number) => void;
}

const widths = [
  { label: 'S', value: STROKE_WIDTHS.thin },
  { label: 'M', value: STROKE_WIDTHS.medium },
  { label: 'L', value: STROKE_WIDTHS.thick },
];

export function WidthSelector({ value, onChange }: WidthSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      {widths.map(w => (
        <button
          key={w.label}
          onClick={() => onChange(w.value)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black text-xs font-black transition-all ${
            value === w.value
              ? 'bg-cm-purple text-white shadow-[2px_2px_0px_black] -translate-y-0.5'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          {w.label}
        </button>
      ))}
    </div>
  );
}
