import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import Script from 'next/script'
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
        {/* Bulle ConvertBubble - "Voyageurs Regroupés à Dates Fixes" (project 314) */}
        {/* Le ciblage des pages (5 destinations) est géré côté ConvertBubble */}
        <Script id="convertbubble-314" strategy="afterInteractive">{`(async function () {let dataHtml = await fetch('https://app.convertbubble.net/hooks/project/getHtmlData?project_id=314&embed=0');let dataHtmlJson = await dataHtml.json(); dataHtmlJson.status && document.querySelector('body').appendChild(document.createRange().createContextualFragment(dataHtmlJson.data));})();`}</Script>
      </body>
    </html>
  )
}

