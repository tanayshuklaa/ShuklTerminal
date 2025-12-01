export default function NewsFeed({ items = [], loading }) {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Latest News</h3>
        <span className="badge">Real time</span>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="loading-pulse h-16 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No news found.</p>
      ) : (
        <div className="space-y-4">
          {items.map((article) => (
            <a
              key={`${article.id || article.datetime}-${article.headline}`}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-base">{article.headline}</h4>
                <span className="badge text-gray-200">{article.source}</span>
              </div>
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">{article.summary || article.category}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(article.datetime * 1000).toLocaleString()}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
