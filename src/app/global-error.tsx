"use client";

import ClientErrorFallback from "@/components/ClientErrorFallback";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <ClientErrorFallback error={error} />
      </body>
    </html>
  );
}
