import './globals.css';
import dynamic from 'next/dynamic';

const TickerTape = dynamic(() => import('./components/TickerTape'), { ssr: false });

export const metadata = {
  title: 'Shukla Terminal | Real-Time Stock Dashboard',
  description: 'Real-time stock intelligence dashboard powered by Finnhub and Yahoo Finance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen">
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <TickerTape />
        </div>
      </body>
    </html>
  );
}
