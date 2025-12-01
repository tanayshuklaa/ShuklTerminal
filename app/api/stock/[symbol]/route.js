import { NextResponse } from 'next/server';
import { getQuote } from '../../../../lib/finnhub';
import { getYahooChart, getYahooFinancials } from '../../../../lib/yahoo';

export const runtime = 'edge';
export const revalidate = 60;

const intervalForRange = {
  '1d': '5m',
  '1w': '30m',
  '1mo': '1d',
  '3mo': '1d',
  '6mo': '1wk',
  '1y': '1wk',
};

export async function GET(request, { params }) {
  const { symbol } = params;
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '1mo';
  const interval = intervalForRange[range] || '1d';

  try {
    const [quote, financials, chart] = await Promise.all([
      getQuote(symbol),
      getYahooFinancials(symbol),
      getYahooChart(symbol, range, interval),
    ]);

    return NextResponse.json({ quote, financials, chart, range, interval }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to fetch stock data' }, { status: 500 });
  }
}
