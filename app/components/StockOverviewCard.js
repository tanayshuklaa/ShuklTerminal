export default function StockOverviewCard({ symbol, overview }) {
  if (!overview) {
    return (
      <div className="card p-6">
        <p className="text-sm text-gray-400">No overview available.</p>
      </div>
    );
  }

  const {
    price,
    change,
    changePercent,
    high,
    low,
    open,
    prevClose,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    marketCap,
  } = overview;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">{symbol}</p>
          <h2 className="text-3xl font-bold mt-1">${price?.toFixed(2) ?? '--'}</h2>
          <p className={`mt-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '▲' : '▼'} {change?.toFixed(2) ?? '--'} ({changePercent?.toFixed(2) ?? '--'}%)
          </p>
        </div>
        <div className="badge">Market Cap: {marketCap ? `$${(marketCap / 1_000_000_000).toFixed(2)}B` : 'N/A'}</div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <Metric label="Day High" value={high} prefix="$" />
        <Metric label="Day Low" value={low} prefix="$" />
        <Metric label="Open" value={open} prefix="$" />
        <Metric label="Prev Close" value={prevClose} prefix="$" />
        <Metric label="52W High" value={fiftyTwoWeekHigh} prefix="$" />
        <Metric label="52W Low" value={fiftyTwoWeekLow} prefix="$" />
      </div>
    </div>
  );
}

function Metric({ label, value, prefix }) {
  return (
    <div className="rounded-lg bg-white/5 p-3 border border-white/5">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-semibold mt-1">{value ? `${prefix ?? ''}${value.toFixed(2)}` : '—'}</p>
    </div>
  );
}
