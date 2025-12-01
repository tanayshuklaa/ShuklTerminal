"use client";

import { useEffect, useMemo, useState } from 'react';

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'NVDA', 'META', 'TSLA', 'NFLX'];

export default function TickerTape({ symbols = DEFAULT_SYMBOLS }) {
  const [quotes, setQuotes] = useState([]);

  const fetchQuotes = useMemo(
    () => async () => {
      try {
        const results = await Promise.all(
          symbols.map(async (symbol) => {
            const res = await fetch(`/api/stock/${symbol}`);
            if (!res.ok) throw new Error('quote failed');
            const data = await res.json();
            return { symbol, price: data?.c ?? null, change: data?.c && data?.pc ? data.c - data.pc : null };
          })
        );
        setQuotes(results.filter(Boolean));
      } catch (error) {
        console.error('Ticker tape error', error);
      }
    },
    [symbols]
  );

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 60000);
    return () => clearInterval(interval);
  }, [fetchQuotes]);

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {[...quotes, ...quotes].map((quote, idx) => {
          const changeColor = quote.change > 0 ? 'text-green-400' : quote.change < 0 ? 'text-red-400' : 'text-gray-200';
          const changeLabel = quote.change ? `${quote.change > 0 ? '+' : ''}${quote.change.toFixed(2)}` : '—';
          return (
            <div key={`${quote.symbol}-${idx}`} className="ticker-item">
              <span className="font-semibold">{quote.symbol}</span>
              <span className="ml-2">{quote.price ? quote.price.toFixed(2) : '—'}</span>
              <span className={`ml-2 ${changeColor}`}>{changeLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
