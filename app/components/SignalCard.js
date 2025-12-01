const colors = {
  BUY: 'bg-green-500/20 text-green-300 border-green-500/40',
  HOLD: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40',
  SELL: 'bg-red-500/20 text-red-300 border-red-500/40',
};

export default function SignalCard({ signal = 'HOLD', score }) {
  const color = colors[signal] || colors.HOLD;
  return (
    <div className={`card p-6 border ${color} flex flex-col gap-2`}>
      <p className="text-sm text-gray-300">Model Signal</p>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{signal}</h3>
        <div className="badge">Score {score}</div>
      </div>
      <p className="text-sm text-gray-400">
        Score is computed from insider flows, analyst sentiment, and the 50-day simple moving average.
      </p>
    </div>
  );
}
