'use client';

import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ranges = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1mo' },
  { label: '3M', value: '3mo' },
  { label: '6M', value: '6mo' },
  { label: '1Y', value: '1y' },
];

export default function PriceChart({ symbol }) {
  const [range, setRange] = useState('1mo');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/api/stock/${symbol}?range=${range}`);
        if (!res.ok) throw new Error('Unable to load chart');
        const json = await res.json();
        const candles = json?.chart?.chart?.result?.[0];
        const timestamps = candles?.timestamp || [];
        const prices = candles?.indicators?.quote?.[0]?.close || [];
        const items = timestamps.map((t, idx) => ({
          date: new Date(t * 1000),
          price: prices[idx],
        })).filter((p) => p.price);
        if (active) setData(items);
      } catch (err) {
        console.error(err);
        if (active) setError('Chart unavailable');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [symbol, range]);

  const formatted = useMemo(
    () =>
      data.map((d) => ({
        label: d.date.toLocaleDateString(),
        price: Number(d.price.toFixed(2)),
      })),
    [data]
  );

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Price History</h3>
        <div className="flex items-center gap-2 text-xs">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`rounded-md px-3 py-1 transition ${
                range === r.value ? 'bg-accent text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 w-full loading-pulse" />
      ) : error ? (
        <p className="text-sm text-red-300">{error}</p>
      ) : formatted.length ? (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={formatted} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af' }} hide={formatted.length > 60} />
            <YAxis domain={['dataMin', 'dataMax']} tick={{ fill: '#9ca3af' }} />
            <Tooltip
              formatter={(value) => [`$${value}`, 'Price']}
              labelFormatter={(label) => label}
              contentStyle={{ background: '#11182b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
            />
            <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="url(#colorPrice)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-sm text-gray-400">No chart data available.</p>
      )}
    </div>
  );
}
