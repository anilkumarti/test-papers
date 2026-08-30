import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MP Patwari Mock Test 2026 | मध्यप्रदेश पटवारी ऑनलाइन टेस्ट',
  description: 'MP Patwari 2026 के लिए सर्वश्रेष्ठ ऑनलाइन मॉक टेस्ट। नवीनतम पाठ्यक्रम और MPESB परीक्षा पैटर्न के आधार पर तैयार प्रश्न। निःशुल्क अभ्यास करें।',
  keywords: 'MP Patwari Mock Test 2026, MP Patwari Online Test, MP Patwari Test Series, MPESB Patwari, मध्यप्रदेश पटवारी',
  openGraph: {
    title: 'MP Patwari Mock Test 2026',
    description: 'MPESB पटवारी परीक्षा 2026 की तैयारी के लिए उच्च गुणवत्ता के मॉक टेस्ट',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
