'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ConvertBubbleProps {
  projectId: string;
}

/**
 * Bulle ConvertBubble, ré-évaluée à chaque changement de route.
 *
 * Le widget est isolé dans son propre conteneur. Au changement de page, on retire
 * uniquement ce conteneur : un observateur sur tout le body retirait aussi des
 * nœuds ajoutés par React et faisait planter la page.
 */
export default function ConvertBubble({ projectId }: ConvertBubbleProps) {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let holder: HTMLDivElement | null = null;

    (async () => {
      try {
        const res = await fetch(
          `https://app.convertbubble.net/hooks/project/getHtmlData?project_id=${projectId}&embed=0`
        );
        const data = await res.json();
        if (cancelled || !data.status || typeof data.data !== "string") return;

        holder = document.createElement("div");
        holder.setAttribute("data-convertbubble", projectId);
        holder.appendChild(document.createRange().createContextualFragment(data.data));
        document.body.appendChild(holder);
      } catch {
        // Widget non-critique : on échoue silencieusement.
      }
    })();

    return () => {
      cancelled = true;
      holder?.remove();
      holder = null;
    };
  }, [pathname, projectId]);

  return null;
}
