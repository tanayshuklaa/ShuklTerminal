import { NextResponse } from 'next/server';
import { getInsiderTransactions } from '../../../../lib/finnhub';

export const runtime = 'edge';
export const revalidate = 60;

export async function GET(_request, { params }) {
  const { symbol } = params;
  try {
    const data = await getInsiderTransactions(symbol);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Unable to fetch insider data' }, { status: 500 });
  }
}
