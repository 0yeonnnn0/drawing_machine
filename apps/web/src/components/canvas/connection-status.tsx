'use client';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'reconnecting';
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  if (status === 'connected') return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div className="cm-card py-2 px-6 bg-cm-orange border-2 shadow-[4px_4px_0px_black] flex items-center gap-3">
        <span className="animate-pixel-blink w-3 h-3 rounded-full bg-black" />
        <span className="font-black text-xs uppercase tracking-wider">
          {status === 'reconnecting' ? 'RECONNECTING...' : 'DISCONNECTED'}
        </span>
      </div>
    </div>
  );
}
