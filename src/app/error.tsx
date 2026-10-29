"use client";

import ClientErrorFallback from "@/components/ClientErrorFallback";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ClientErrorFallback error={error} />;
}
