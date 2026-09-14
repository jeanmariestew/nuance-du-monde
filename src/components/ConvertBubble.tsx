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
 * Le script du widget peut ajouter ses propres éléments (bulle, iframe...)
 * directement comme enfants de <body>, pas seulement dans le fragment injecté.
 * On repère donc, juste avant/après notre propre insertion, les nouveaux enfants
 * directs de <body> pour pouvoir les retirer au changement de page suivant.
 * On évite volontairement un MutationObserver qui tournerait en continu : il
 * capturerait aussi des éléments gérés par React (portails, toasts, overlay de
 * dev Next.js), et les retirer nous-mêmes fait planter React au rendu suivant.
 */
export default function ConvertBubble({ projectId }: ConvertBubbleProps) {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let injected: Element[] = [];

    (async () => {
      try {
        const res = await fetch(
          `https://app.convertbubble.net/hooks/project/getHtmlData?project_id=${projectId}&embed=0`
        );
        const data = await res.json();
        if (cancelled || !data.status) return;

        const before = new Set(Array.from(document.body.children));
        document.body.appendChild(document.createRange().createContextualFragment(data.data));
        injected = Array.from(document.body.children).filter((el) => !before.has(el));
      } catch {
        // Widget non-critique : on échoue silencieusement.
      }
    })();

    return () => {
      cancelled = true;
      injected.forEach((el) => el.remove());
    };
  }, [pathname, projectId]);

  return null;
}
