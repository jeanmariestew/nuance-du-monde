'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ConvertBubbleProps {
  projectId: string;
}

/**
 * Bulle ConvertBubble, ré-évaluée à chaque changement de route.
 *
 * Le layout racine ne remonte pas lors d'une navigation client-side (<Link>),
 * donc un simple <script strategy="afterInteractive"> ne s'exécute qu'au premier
 * chargement complet de la page. On utilise ici usePathname() pour relancer le
 * fetch à chaque navigation (le ciblage des pages reste décidé côté ConvertBubble).
 *
 * Le widget ne se contente pas forcément du fragment qu'on injecte : son propre
 * script peut ajouter d'autres éléments (bulle, iframe...) directement comme
 * enfants de <body>. On observe donc tout ce qui est ajouté à <body> tant qu'on
 * est sur la page, pour pouvoir tout retirer proprement au changement de route.
 */
export default function ConvertBubble({ projectId }: ConvertBubbleProps) {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const injected: Element[] = [];

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) injected.push(node);
        });
      }
    });
    observer.observe(document.body, { childList: true });

    (async () => {
      try {
        const res = await fetch(
          `https://app.convertbubble.net/hooks/project/getHtmlData?project_id=${projectId}&embed=0`
        );
        const data = await res.json();
        if (cancelled || !data.status) return;

        document.body.appendChild(document.createRange().createContextualFragment(data.data));
      } catch {
        // Widget non-critique : on échoue silencieusement.
      }
    })();

    return () => {
      cancelled = true;
      observer.disconnect();
      injected.forEach((el) => el.remove());
    };
  }, [pathname, projectId]);

  return null;
}
