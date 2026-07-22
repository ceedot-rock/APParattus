import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'APParattus | Launch planning, without the spreadsheet',
  description:
    'Turn a raw idea into a sequenced release: milestones with owners and dates, risks tracked openly, and one shared view of where a launch actually stands.',
  metadataBase: new URL('https://app-arattus.vercel.app'),
  openGraph: {
    title: 'APParattus',
    description: 'A modern product launch operating system for fast-moving teams.',
    url: 'https://app-arattus.vercel.app',
    siteName: 'APParattus',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c111d',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
