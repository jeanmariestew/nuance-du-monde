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
 * fetch à chaque navigation, et on retire la bulle précédente avant chaque essai
 * pour qu'elle ne reste pas affichée sur des pages où elle ne devrait pas l'être
 * (le ciblage des pages reste décidé côté ConvertBubble).
 */
export default function ConvertBubble({ projectId }: ConvertBubbleProps) {
  const pathname = usePathname();

  useEffect(() => {
    const containerId = `convertbubble-${projectId}-container`;
    let cancelled = false;

    document.getElementById(containerId)?.remove();

    (async () => {
      try {
        const res = await fetch(
          `https://app.convertbubble.net/hooks/project/getHtmlData?project_id=${projectId}&embed=0`
        );
        const data = await res.json();
        if (cancelled || !data.status) return;

        const container = document.createElement('div');
        container.id = containerId;
        container.appendChild(document.createRange().createContextualFragment(data.data));
        document.body.appendChild(container);
      } catch {
        // Widget non-critique : on échoue silencieusement.
      }
    })();

    return () => {
      cancelled = true;
      document.getElementById(containerId)?.remove();
    };
  }, [pathname, projectId]);

  return null;
}
