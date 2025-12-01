const YAHOO_CHART = 'https://query1.finance.yahoo.com/v8/finance/chart';
const YAHOO_SUMMARY = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary';

export async function getYahooChart(symbol, range = '1mo', interval = '1d') {
  try {
    const url = `${YAHOO_CHART}/${symbol}?range=${range}&interval=${interval}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Yahoo chart request failed');
    return res.json();
  } catch (error) {
    console.error('Yahoo chart error', error);
    return null;
  }
}

export async function getYahooFinancials(symbol) {
  try {
    const url = `${YAHOO_SUMMARY}/${symbol}?modules=financialData`; 
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Yahoo financial request failed');
    return res.json();
  } catch (error) {
    console.error('Yahoo financial error', error);
    return null;
  }
}
