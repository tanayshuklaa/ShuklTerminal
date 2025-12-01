import './globals.css';

export const metadata = {
  title: 'Bloomberg-Style Stock Dashboard',
  description: 'Free stock intelligence dashboard powered by Finnhub and Yahoo Finance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
