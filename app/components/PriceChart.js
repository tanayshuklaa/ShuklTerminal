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
  const [view, setView] = useState('line');

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
        const quote = candles?.indicators?.quote?.[0] || {};
        const opens = quote?.open || [];
        const highs = quote?.high || [];
        const lows = quote?.low || [];
        const closes = quote?.close || [];
        const items = timestamps
          .map((t, idx) => ({
            date: new Date(t * 1000),
            open: opens[idx],
            high: highs[idx],
            low: lows[idx],
            close: closes[idx],
          }))
          .filter((p) => Number.isFinite(p.close) && Number.isFinite(p.high) && Number.isFinite(p.low) && Number.isFinite(p.open));
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
        price: Number(d.close.toFixed(2)),
        open: Number(d.open.toFixed(2)),
        high: Number(d.high.toFixed(2)),
        low: Number(d.low.toFixed(2)),
        close: Number(d.close.toFixed(2)),
      })),
    [data]
  );

  const candleSvg = useMemo(() => {
    if (!formatted.length) return null;
    const width = 800;
    const height = 320;
    const padding = 20;
    const highs = formatted.map((d) => d.high);
    const lows = formatted.map((d) => d.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const scaleY = (value) => padding + ((max - value) / (max - min)) * (height - padding * 2);
    const step = width / formatted.length;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-80 w-full">
        <g stroke="#1f2937" strokeWidth="1">
          {[0.25, 0.5, 0.75].map((fraction) => {
            const y = padding + (height - padding * 2) * fraction;
            return <line key={fraction} x1={0} x2={width} y1={y} y2={y} />;
          })}
        </g>
        {formatted.map((point, idx) => {
          const x = idx * step + step / 2;
          const highY = scaleY(point.high);
          const lowY = scaleY(point.low);
          const openY = scaleY(point.open);
          const closeY = scaleY(point.close);
          const isUp = point.close >= point.open;
          const bodyTop = isUp ? closeY : openY;
          const bodyBottom = isUp ? openY : closeY;
          const bodyHeight = Math.max(2, bodyBottom - bodyTop);
          const color = isUp ? '#22c55e' : '#ef4444';

          return (
            <g key={idx}>
              <line x1={x} x2={x} y1={highY} y2={lowY} stroke={color} strokeWidth={1.5} />
              <rect
                x={x - step * 0.18}
                y={bodyTop}
                width={step * 0.36}
                height={bodyHeight}
                fill={color}
                opacity={0.85}
              >
                <title>
                  {`${point.label}\nOpen: $${point.open}\nHigh: $${point.high}\nLow: $${point.low}\nClose: $${point.close}`}
                </title>
              </rect>
            </g>
          );
        })}
      </svg>
    );
  }, [formatted]);

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
        <div className="flex items-center gap-2 text-xs">
          {[
            { key: 'line', label: 'Line' },
            { key: 'candle', label: 'Candlestick' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setView(option.key)}
              className={`rounded-md px-3 py-1 transition ${
                view === option.key ? 'bg-accent text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 w-full loading-pulse" />
      ) : error ? (
        <p className="text-sm text-red-300">{error}</p>
      ) : !formatted.length ? (
        <p className="text-sm text-gray-400">No chart data available.</p>
      ) : view === 'line' ? (
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
        candleSvg
      )}
    </div>
  );
}
