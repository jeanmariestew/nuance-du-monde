"use client";

import { useEffect, useState } from "react";
import { recoverClientError } from "@/lib/clientRecovery";

const wrap: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  textAlign: "center",
  fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  background: "#fff",
  color: "#111",
};

const button: React.CSSProperties = {
  marginTop: "16px",
  border: 0,
  borderRadius: "999px",
  background: "#111",
  color: "#fff",
  padding: "12px 20px",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

export default function ClientErrorFallback({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    if (error.digest) {
      setGaveUp(true);
      return;
    }
    if (!recoverClientError()) setGaveUp(true);
  }, [error]);

  if (!gaveUp) {
    return (
      <div style={wrap}>
        <p>Chargement de la page…</p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div>
        <p>Cette page n&apos;a pas pu s&apos;afficher.</p>
        <button type="button" style={button} onClick={() => window.location.reload()}>
          Recharger
        </button>
      </div>
    </div>
  );
}
