import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import StockOverviewCard from '../../components/StockOverviewCard';
import PriceChart from '../../components/PriceChart';
import InsiderTradesTable from '../../components/InsiderTradesTable';
import NewsFeed from '../../components/NewsFeed';
import RatingCard from '../../components/RatingCard';
import SignalCard from '../../components/SignalCard';
import { getQuote, getCompanyNews, getInsiderTransactions, getRecommendations } from '../../../lib/finnhub';
import { getYahooChart, getYahooFinancials } from '../../../lib/yahoo';

export const revalidate = 60;

async function loadData(symbol) {
  try {
    const [quote, insiderRaw, newsRaw, recommendationsRaw, financialsRaw, history] = await Promise.all([
      getQuote(symbol),
      getInsiderTransactions(symbol),
      getCompanyNews(symbol),
      getRecommendations(symbol),
      getYahooFinancials(symbol),
      getYahooChart(symbol, '6mo', '1d'),
    ]);

    return { quote, insiderRaw, newsRaw, recommendationsRaw, financialsRaw, history };
  } catch (error) {
    console.error(error);
    return {};
  }
}

function buildOverview(symbol, quote, financialsRaw) {
  if (!quote) return null;
  const finNode = financialsRaw?.quoteSummary?.result?.[0]?.financialData || {};
  const price = quote.c;
  const prevClose = quote.pc;
  const change = price && prevClose ? price - prevClose : null;
  const changePercent = change && prevClose ? (change / prevClose) * 100 : null;

  return {
    symbol,
    price,
    change,
    changePercent,
    high: quote.h,
    low: quote.l,
    open: quote.o,
    prevClose,
    fiftyTwoWeekHigh: finNode?.fiftyTwoWeekHigh?.raw,
    fiftyTwoWeekLow: finNode?.fiftyTwoWeekLow?.raw,
    marketCap: finNode?.marketCap?.raw,
  };
}

function deriveInsiderStats(insiderRaw) {
  const rows = insiderRaw?.data || [];
  const trimmed = rows.slice(0, 10);
  const buys = rows.filter((r) => r.change > 0).length;
  const sells = rows.filter((r) => r.change < 0).length;
  return { rows: trimmed, buys, sells };
}

function deriveAnalyst(recommendationsRaw) {
  const latest = Array.isArray(recommendationsRaw) ? recommendationsRaw[0] : {};
  return {
    buy: latest?.buy || 0,
    hold: latest?.hold || 0,
    sell: latest?.sell || 0,
    strongBuy: latest?.strongBuy || 0,
    strongSell: latest?.strongSell || 0,
  };
}

function computeSMA(history) {
  const result = history?.chart?.result?.[0];
  const closes = result?.indicators?.quote?.[0]?.close?.filter(Boolean) || [];
  if (closes.length < 50) return null;
  const last50 = closes.slice(-50);
  const sma = last50.reduce((sum, v) => sum + v, 0) / last50.length;
  const lastPrice = closes[closes.length - 1];
  return { sma, lastPrice };
}

function computeSignal({ insiderStats, analyst, smaResult }) {
  let score = 0;
  if (insiderStats.buys > insiderStats.sells) score += 1;
  if (analyst.buy + analyst.strongBuy > analyst.sell + analyst.strongSell) score += 1;
  if (smaResult?.lastPrice && smaResult?.sma) {
    score += smaResult.lastPrice > smaResult.sma ? 1 : -1;
  }
  if ((analyst.buy + analyst.strongBuy) >= analyst.hold) score += 1;

  const signal = score >= 3 ? 'BUY' : score <= 0 ? 'SELL' : 'HOLD';
  return { signal, score };
}

export default async function DashboardPage({ params }) {
  const symbol = params.symbol.toUpperCase();
  const { quote, insiderRaw, newsRaw, recommendationsRaw, financialsRaw, history } = await loadData(symbol);
  const overview = buildOverview(symbol, quote, financialsRaw);
  const insiderStats = deriveInsiderStats(insiderRaw);
  const analyst = deriveAnalyst(recommendationsRaw);
  const smaResult = computeSMA(history);
  const { signal, score } = computeSignal({ insiderStats, analyst, smaResult });
  const news = Array.isArray(newsRaw) ? newsRaw.slice(0, 6) : [];

  return (
    <main>
      <Navbar />
      <div className="container py-8 space-y-6">
        <div className="card p-4">
          <SearchBar initialSymbol={symbol} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <StockOverviewCard symbol={symbol} overview={overview} />
            <PriceChart symbol={symbol} />
            <div className="grid gap-6 md:grid-cols-2">
              <SignalCard signal={signal} score={score} />
              <RatingCard data={analyst} />
            </div>
          </div>
          <div className="space-y-6">
            <InsiderTradesTable data={insiderStats.rows} />
            <NewsFeed items={news} />
          </div>
        </div>
      </div>
    </main>
  );
}
