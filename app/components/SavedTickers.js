"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'shukla-terminal:saved-tickers';

export default function SavedTickers({ currentSymbol }) {
  const router = useRouter();
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const persist = (items) => {
    setSaved(items);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  };

  const saveCurrent = () => {
    if (!currentSymbol) return;
    const ticker = currentSymbol.toUpperCase();
    if (saved.includes(ticker)) return;
    const next = [...saved, ticker].slice(-25);
    persist(next);
  };

  const removeTicker = (ticker) => {
    const next = saved.filter((t) => t !== ticker);
    persist(next);
  };

  const openTicker = (ticker) => {
    router.push(`/dashboard/${ticker}`);
  };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Saved tickers</p>
          <p className="text-lg font-semibold">Quick access</p>
        </div>
        <button
          onClick={saveCurrent}
          className="rounded-md bg-accent/80 px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent"
        >
          Save {currentSymbol}
        </button>
      </div>

      {saved.length === 0 ? (
        <p className="text-sm text-gray-400">No saved tickers yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {saved.map((ticker) => (
            <div key={ticker} className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm">
              <button onClick={() => openTicker(ticker)} className="font-semibold hover:text-accent transition">
                {ticker}
              </button>
              <button onClick={() => removeTicker(ticker)} className="text-gray-400 hover:text-red-400" aria-label="Remove">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
