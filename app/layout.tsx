import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import TabNav from '@/components/TabNav';

export const metadata: Metadata = {
  title: 'PROMPT//FORGE',
  description: 'AI prompt engineering system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <TabNav />
          <main style={{ flex: 1, padding: '32px 0' }}>
            <div className="content-wrapper">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
