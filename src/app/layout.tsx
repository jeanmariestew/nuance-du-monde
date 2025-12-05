import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'
import AppFrame from '@/components/AppFrame'
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
      </body>
    </html>
  )
}

