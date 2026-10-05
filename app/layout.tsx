import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryClientProvider } from '@/providers/queryProvider';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Read IT - Forum',
  description: 'Forum for post and get intercat and with others',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col w-full items-center">
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
