"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface ConvertBubbleProps {
  projectId: string;
}

function removeBubbleLeftovers() {
  document.querySelectorAll("[id^='leadbubble']").forEach((node) => node.remove());
  document.querySelectorAll("style").forEach((style) => {
    if (style.textContent?.includes("#leadbubble_")) style.remove();
  });
}

function placeWidget(html: string, holder: HTMLDivElement) {
  const fragment = document.createRange().createContextualFragment(html);
  const scripts = Array.from(fragment.querySelectorAll("script"));
  scripts.forEach((script) => script.remove());
  holder.replaceChildren();
  holder.appendChild(fragment);
  if (!holder.isConnected) document.body.appendChild(holder);

  for (const oldScript of scripts) {
    if ((oldScript.textContent || "").includes("validateConditionalUrl")) continue;
    const script = document.createElement("script");
    for (const attribute of oldScript.attributes) {
      script.setAttribute(attribute.name, attribute.value);
    }
    script.text = oldScript.textContent || "";
    holder.appendChild(script);
  }
}

/**
 * La bulle est montée dans un bloc à nous. Au changement de page, ce bloc
 * et les éléments qu'elle a posés sur la page sont retirés.
 */
export default function ConvertBubble({ projectId }: ConvertBubbleProps) {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const holder = document.createElement("div");
    holder.setAttribute("data-convertbubble", projectId);

    (async () => {
      try {
        const res = await fetch(
          `https://app.convertbubble.net/hooks/project/getHtmlData?project_id=${projectId}&embed=0`
        );
        const data = await res.json();
        if (cancelled || !data.status || typeof data.data !== "string") return;

        let html = data.data as string;
        if (html.includes("validateConditionalUrl")) {
          const check = await fetch(
            `https://app.convertbubble.net/hooks/project/validateConditionalUrl?project_id=${projectId}&embed=0&url=${encodeURIComponent(window.location.href)}`
          );
          const checkData = await check.json();
          if (cancelled || !checkData.status || typeof checkData.data !== "string") return;
          html = checkData.data;
        }

        if (cancelled) return;
        placeWidget(html, holder);
      } catch {
        // Widget non critique.
      }
    })();

    return () => {
      cancelled = true;
      holder.remove();
      removeBubbleLeftovers();
    };
  }, [pathname, projectId]);

  return null;
}
