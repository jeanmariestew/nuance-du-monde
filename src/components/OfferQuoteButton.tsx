"use client";

import { useState } from "react";
import QuoteRequestModal from "@/components/QuoteRequestModal";

export default function OfferQuoteButton({ circuit, className }: { circuit: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        Demander un devis
      </button>
      <QuoteRequestModal isOpen={isOpen} onClose={() => setIsOpen(false)} circuit={circuit} />
    </>
  );
}
