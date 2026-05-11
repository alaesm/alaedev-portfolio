import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import { QueryProvider } from '@/shared/tanstack/providers';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Said Medjahed Alaeddine — AlaeDev',
  description:
    'Information Systems Graduate. Freelance Software Developer. AI Enthusiast. Based in Tlemcen, Algeria. Building production web & mobile systems since 2024.',
  keywords: ['developer', 'freelance', 'software', 'Algeria', 'AI', 'web', 'mobile'],
  authors: [{ name: 'Said Medjahed Alaeddine', url: 'https://www.alaedev.me' }],
  openGraph: {
    title: 'Said Medjahed Alaeddine — AlaeDev',
    description: 'Freelance software developer based in Tlemcen, Algeria.',
    url: 'https://www.alaedev.me',
    siteName: 'AlaeDev',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlaeDev — Said Medjahed Alaeddine',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
