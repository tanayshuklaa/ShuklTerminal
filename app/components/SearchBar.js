'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ initialSymbol = '' }) {
  const router = useRouter();
  const [symbol, setSymbol] = useState(initialSymbol);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    router.push(`/dashboard/${symbol.trim().toUpperCase()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-3">
      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Search ticker (AAPL, TSLA, MSFT...)"
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <button
        type="submit"
        className="rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/40"
      >
        Go
      </button>
    </form>
  );
}
