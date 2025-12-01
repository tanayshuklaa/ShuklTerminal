const categories = [
  { key: 'strongBuy', label: 'Strong Buy', color: 'bg-green-500' },
  { key: 'buy', label: 'Buy', color: 'bg-emerald-400' },
  { key: 'hold', label: 'Hold', color: 'bg-yellow-400' },
  { key: 'sell', label: 'Sell', color: 'bg-orange-400' },
  { key: 'strongSell', label: 'Strong Sell', color: 'bg-red-500' },
];

export default function RatingCard({ data = {} }) {
  const total = categories.reduce((sum, cat) => sum + (data[cat.key] || 0), 0);
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analyst Recommendation</h3>
        <span className="badge">Finnhub</span>
      </div>
      <div className="space-y-3">
        {categories.map((cat) => {
          const value = data[cat.key] || 0;
          const pct = total ? Math.round((value / total) * 100) : 0;
          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>{cat.label}</span>
                <span className="text-gray-400">{value} ({pct}%)</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`${cat.color} h-2`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
