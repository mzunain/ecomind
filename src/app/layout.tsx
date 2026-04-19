import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoMind - AI Carbon Footprint Analyzer',
  description: 'Understand and reduce your personal carbon footprint with the power of Google Gemini AI. Get personalised, actionable recommendations based on your lifestyle.',
  keywords: ['carbon footprint', 'sustainability', 'AI', 'Google Gemini', 'climate action', 'earth day'],
  openGraph: {
    title: 'EcoMind - AI Carbon Footprint Analyzer',
    description: 'Powered by Google Gemini. Describe your lifestyle, get a personalised CO2 analysis.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
