export default function InsiderTradesTable({ data = [], loading }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Insider Trading</h3>
        <span className="badge">All available</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="loading-pulse h-10 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400">No insider trades available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-gray-400">
              <tr className="text-left">
                <th className="py-2 pr-4">Insider</th>
                <th className="py-2 pr-4">Relation</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Shares</th>
                <th className="py-2 pr-4">Value</th>
                <th className="py-2 pr-4">Filing Date</th>
                <th className="py-2 pr-4">Transaction Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((row, idx) => (
                <tr key={`${row.name}-${idx}`} className="hover:bg-white/5 transition">
                  <td className="py-3 pr-4 font-medium">{row.name}</td>
                  <td className="py-3 pr-4 text-gray-300">{row.shareholder_group || row.relationship || '—'}</td>
                  <td className={`py-3 pr-4 ${row.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {row.change < 0 ? 'Sell' : 'Buy'}
                  </td>
                  <td className="py-3 pr-4">{row.change ? row.change.toLocaleString() : '—'}</td>
                  <td className="py-3 pr-4">{row.cost ? `$${row.cost.toLocaleString()}` : '—'}</td>
                  <td className="py-3 pr-4">{row.filingDate || '—'}</td>
                  <td className="py-3 pr-4">{row.transactionDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
