import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nuance du monde votre spécialiste du voyage sur mesure',
  description: 'Créez avec nous votre voyage sur mesure, partout dans le monde. Nous vous faisons vivre des expériences authentiques et confortables, et ce, au meilleur prix du marché.',
  keywords: 'voyage sur mesure, agence de voyage, destinations, circuits, voyages en groupe, voyages individuels',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

