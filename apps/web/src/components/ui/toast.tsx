'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface Toast {
  id: number;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const addToast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, addToast };
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="bg-black text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,0.3)] whitespace-nowrap"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
