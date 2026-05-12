"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "La brochure est-elle gratuite ?",
      answer: "Oui, la brochure est entièrement gratuite pour les professionnels du voyage agréés.",
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison sont généralement de 5 à 7 jours ouvrables après validation de votre commande.",
    },
    {
      question: "Les tarifs sont-ils indiqués dans la brochure ?",
      answer: "Non, les tarifs ne sont pas indiqués dans la brochure pour vous permettre de personnaliser vos offres.",
    },
    {
      question: "Puis-je commander des brochures pour un événement ?",
      answer: "Oui, vous pouvez commander des quantités supplémentaires pour vos événements et salons professionnels.",
    },
    {
      question: "Comment fonctionne l'accès numérique ?",
      answer: "L'accès numérique se fait via les QR codes intégrés ou directement depuis notre plateforme en ligne.",
    },
  ]

  return (
    <section className="bg-white py-20 px-6 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-[#1e293b] text-center mb-12">
          QUESTIONS FRÉQUENTES
        </h2>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#f5f1eb] rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-[#1e293b] font-medium text-sm">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#64748b] transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-[#64748b] text-sm">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="#commander"
            className="inline-block bg-[#c4a74a] text-white font-medium px-8 py-4 rounded-full hover:bg-[#b39740] transition-colors text-sm uppercase tracking-wide"
          >
            Recevoir mes brochures
          </Link>
        </div>
      </div>
    </section>
  )
}
