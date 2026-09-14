'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ConvertBubbleProps {
  projectId: string;
}

// Durée pendant laquelle on surveille les ajouts au <body> après le chargement
// du widget, pour capter ses éléments même s'il les ajoute de façon différée
// (iframe, chargement asynchrone...). Volontairement courte pour ne pas risquer
// de capturer, bien plus tard, des éléments ajoutés par React lui-même.
const OBSERVE_WINDOW_MS = 4000;

/**
 * Bulle ConvertBubble, ré-évaluée à chaque changement de route.
 *
 * Le layout racine ne remonte pas lors d'une navigation client-side (<Link>),
 * donc un simple <script strategy="afterInteractive"> ne s'exécute qu'au premier
 * chargement complet de la page. On utilise ici usePathname() pour relancer le
 * fetch à chaque navigation (le ciblage des pages reste décidé côté ConvertBubble).
 *
 * Le script du widget ne fait qu'ajouter des éléments, jamais en retirer : sans
 * nettoyage explicite, la bulle resterait affichée sur toutes les pages suivantes
 * une fois apparue une première fois. On la retire donc nous-mêmes au changement
 * de route, en ne ciblant que ce que *nous* avons vu s'ajouter à <body> pendant
 * une courte fenêtre après le chargement (pas un observer permanent, pour ne pas
 * interférer avec les éléments que React gère lui-même).
 */
export default function ConvertBubble({ projectId }: ConvertBubbleProps) {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const injected: Element[] = [];
    let observer: MutationObserver | null = null;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;

    const stopObserving = () => {
      observer?.disconnect();
      observer = null;
      if (stopTimer) clearTimeout(stopTimer);
    };

    (async () => {
      try {
        const res = await fetch(
          `https://app.convertbubble.net/hooks/project/getHtmlData?project_id=${projectId}&embed=0`
        );
        const data = await res.json();
        if (cancelled || !data.status) return;

        observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof Element) injected.push(node);
            });
          }
        });
        observer.observe(document.body, { childList: true });
        stopTimer = setTimeout(stopObserving, OBSERVE_WINDOW_MS);

        document.body.appendChild(document.createRange().createContextualFragment(data.data));
      } catch {
        // Widget non-critique : on échoue silencieusement.
      }
    })();

    return () => {
      cancelled = true;
      stopObserving();
      injected.forEach((el) => el.remove());
    };
  }, [pathname, projectId]);

  return null;
}
