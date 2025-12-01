const FINNHUB_BASE = 'https://finnhub.io/api/v1';

function withToken(path, params = {}) {
  const url = new URL(`${FINNHUB_BASE}${path}`);
  const token = process.env.FINNHUB_API_KEY || '';
  url.searchParams.set('token', token);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

export async function getQuote(symbol) {
  try {
    const res = await fetch(withToken('/quote', { symbol }), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Quote request failed');
    return res.json();
  } catch (error) {
    console.error('Finnhub quote error', error);
    return null;
  }
}

export async function getRecommendations(symbol) {
  try {
    const res = await fetch(withToken('/stock/recommendation', { symbol }), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Recommendation request failed');
    return res.json();
  } catch (error) {
    console.error('Finnhub recommendation error', error);
    return [];
  }
}

export async function getInsiderTransactions(symbol) {
  try {
    const res = await fetch(withToken('/stock/insider-transactions', { symbol }), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Insider request failed');
    return res.json();
  } catch (error) {
    console.error('Finnhub insider error', error);
    return { data: [] };
  }
}

export async function getCompanyNews(symbol) {
  try {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    const res = await fetch(
      withToken('/company-news', { symbol, from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }),
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('News request failed');
    return res.json();
  } catch (error) {
    console.error('Finnhub news error', error);
    return [];
  }
}
