import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';

export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="container py-12 space-y-10">
        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="text-accent text-sm font-semibold">Bloomberg-style dashboard</p>
            <h1 className="text-4xl font-bold leading-tight">Free, Real-Time Stock Intelligence</h1>
            <p className="text-gray-300 text-lg">
              Search any ticker to view live quotes, analyst sentiment, insider trading, price history, and curated news powered by Finnhub and Yahoo Finance.
            </p>
            <div className="card p-4">
              <SearchBar />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <Feature title="Edge cached" desc="API routes cache for 60s on Vercel" />
              <Feature title="Shukla Terminal" desc="Branded, pro-grade market cockpit" />
              <Feature title="Live data" desc="Finnhub quotes, insider trades, and news" />
              <Feature title="Charts" desc="Yahoo Finance price history with ranges" />
            </div>
          </div>
          <div className="card p-6 space-y-4 border-accent/20">
            <p className="text-sm text-gray-400">Quick examples</p>
            <div className="space-y-3">
              {['AAPL', 'MSFT', 'TSLA', 'NVDA'].map((ticker) => (
                <a
                  key={ticker}
                  href={`/dashboard/${ticker}`}
                  className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10 transition"
                >
                  <div>
                    <p className="font-semibold">{ticker}</p>
                    <p className="text-xs text-gray-400">Open dashboard</p>
                  </div>
                  <span className="badge">View</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div>
      <p className="font-semibold text-white">{title}</p>
      <p className="text-gray-400 text-xs mt-1">{desc}</p>
    </div>
  );
}
