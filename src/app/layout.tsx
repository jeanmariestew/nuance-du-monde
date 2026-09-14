import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'
import AppFrame from '@/components/AppFrame'
import ConvertBubble from '@/components/ConvertBubble'
import { generateMetadata as getMetadata } from '@/lib/metadata'

const archivo = Archivo({ subsets: ['latin'], weight: ['300','400','500','700'], variable: '--font-roboto' })

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata('page', 'home');
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${archivo.variable}`}>
      <body className="font-sans">
        <AppFrame>
          {children}
        </AppFrame>
        {/* Bulle ConvertBubble - "Voyageurs Regroupés à Dates Fixes" (project 314) */}
        {/* Le ciblage des pages (5 destinations) est géré côté ConvertBubble */}
        <ConvertBubble projectId="314" />
      </body>
    </html>
  )
}

