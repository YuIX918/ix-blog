// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import '../styles/globals.css';
import ThemeProvider from '../components/ThemeProvider';
import Header from '../components/Header';
import BackToTopButton from '../components/BackToTopButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ix-blog.netlify.app'),
  title: 'Ⅸのだらだら録',
  description: '中の人が好きなことを好き勝手にやるブログです',
  openGraph: {
    title: 'Ⅸのだらだら録',
    description: '中の人が好きなことを好き勝手にやるブログです',
    url: 'https://ix-blog.netlify.app',
    siteName: 'Ⅸのだらだら録',
    images: [
      { url: '/images/ogp_default.png', width: 1200, height: 630, alt: 'Ⅸのだらだら録 OGP画像' },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ⅸのだらだら録',
    description: '中の人が好きなことを好き勝手にやるブログです',
    images: ['/images/ogp_default.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}