import { ReactNode } from 'react';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
}

export function PixelCard({ children, className = '' }: PixelCardProps) {
  return (
    <div className={`cm-card ${className}`}>
      {children}
    </div>
  );
}
