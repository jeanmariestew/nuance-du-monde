import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import AppFrame from '@/components/AppFrame'
import ConvertBubble from '@/components/ConvertBubble'
import { generateMetadata as getMetadata } from '@/lib/metadata'
import { CLIENT_RECOVERY_SCRIPT } from '@/lib/clientRecovery'

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
      <head>
        {/* ConvertBox — à placer avant </head> */}
        <Script id="convertbox-embed" strategy="beforeInteractive">
          {`!function(e,t){(e=t.createElement("script")).src="https://cdn.convertbox.com/convertbox/js/embed.js",e.id="app-convertbox-script",e.async=true,e.dataset.uuid="39641cb1-ce77-4754-baee-92a09f26b06c",document.getElementsByTagName("head")[0].appendChild(e)}(window,document);`}
        </Script>
      </head>
      <body className="font-sans">
        <Script id="ndm-client-recovery" strategy="beforeInteractive">
          {CLIENT_RECOVERY_SCRIPT}
        </Script>
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

