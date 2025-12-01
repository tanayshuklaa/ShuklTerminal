import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b border-white/5 bg-surface/80 backdrop-blur sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="rounded bg-accent px-2 py-1 text-xs font-black text-white">LIVE</span>
          <span>Shukla Terminal</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-300">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/dashboard/AAPL" className="hover:text-white transition">AAPL</Link>
          <Link href="/dashboard/MSFT" className="hover:text-white transition">MSFT</Link>
        </nav>
      </div>
    </header>
  );
}
