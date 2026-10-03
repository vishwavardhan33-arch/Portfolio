import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { profile } from '@/data/content';
import './globals.css';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: `${profile.name} | AI/ML Engineer`,
  description: profile.tagline,
  openGraph: { title: profile.name, description: profile.tagline, images: ['/images/og.png'], type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: 'AI/ML Engineer',
    alumniOf: 'IIT Delhi', url: site, sameAs: [profile.github, profile.linkedin] };
  return (
    <html lang="en" className={`${display.variable} ${inter.variable}`}>
      <body className="font-sans grain">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
