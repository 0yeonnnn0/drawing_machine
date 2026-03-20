import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f0f4f8]">
      <div className="cm-card w-full max-w-md flex flex-col gap-8 p-12 text-center">
        <div className="text-8xl font-black tracking-tighter">404</div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black uppercase">PAGE NOT FOUND</h2>
          <p className="font-bold text-sm opacity-40">The page you are looking for does not exist.</p>
        </div>
        <Link href="/" className="cm-button cm-button-primary self-center">
          GO HOME
        </Link>
      </div>
    </div>
  );
}
