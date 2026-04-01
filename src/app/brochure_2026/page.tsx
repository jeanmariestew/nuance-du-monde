"use client";

import { useEffect } from "react";

// URL externe vers laquelle rediriger
const EXTERNAL_URL = "https://heyzine.com/flip-book/ba8c69ea9d.html";

export default function BrochurePage() {
  useEffect(() => {
    // Redirection vers le lien externe
    window.location.href = EXTERNAL_URL;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la brochure 2026...</p>
      </div>
    </div>
  );
}
