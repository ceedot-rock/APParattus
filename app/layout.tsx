import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'APParattus | Launch faster on Vercel',
  description:
    'A polished starter experience for APParattus: strategy, launch operations, and product systems for teams that move fast.',
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
