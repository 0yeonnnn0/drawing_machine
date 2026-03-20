'use client';

import { InputHTMLAttributes } from 'react';

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PixelInput({ className = '', ...props }: PixelInputProps) {
  return (
    <input
      type="text"
      className={`cm-input ${className}`}
      {...props}
    />
  );
}
