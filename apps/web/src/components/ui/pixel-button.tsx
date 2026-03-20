'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'blue';
}

export function PixelButton({ children, className = '', variant = 'default', ...props }: PixelButtonProps) {
  const variantClass =
    variant === 'primary' ? 'cm-button-primary' :
    variant === 'blue' ? 'cm-button-blue' : '';

  return (
    <button
      className={`cm-button ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
