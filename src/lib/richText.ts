const RICH_TAG =
  /<\/?(?:b|strong|i|em|u|span|mark|ul|ol|li|br|p|div|font|h[1-6])\b/i;

const NAMED_COLORS = new Set([
  "black", "white", "red", "yellow", "green", "blue", "orange", "purple",
  "gray", "grey", "pink", "brown", "cyan", "magenta", "lime", "navy", "teal",
  "silver", "gold", "maroon", "olive", "fuchsia", "aqua", "tomato", "coral",
]);

export function hasRichText(value: string): boolean {
  return RICH_TAG.test(value || "");
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&");
}

export function stripRichTags(input: string): string {
  if (!input) return "";
  return decodeEntities(
    input
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  );
}

export function plainOf(line: string): string {
  return stripRichTags(line).replace(/\u00a0/g, " ").trim();
}

function sanitizeColor(value: string | null | undefined): string | null {
  if (!value) return null;
  const color = value.trim().replace(/!important/gi, "").trim();
  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) return color;
  const rgb = color.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(0|1|0?\.\d+))?\s*\)$/i
  );
  if (rgb) {
    const channels = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
    if (channels.every((n) => n <= 255)) return color.replace(/\s+/g, "");
  }
  if (NAMED_COLORS.has(color.toLowerCase())) return color.toLowerCase();
  return null;
}

function pickStyle(style: string, prop: string): string | null {
  const match = style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, "i"));
  return match ? match[1].trim() : null;
}

function styleFromAttrs(attrs: string): string | null {
  const style = /\bstyle\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
  const raw = style?.[2] || style?.[3] || "";
  const colorAttr = /\bcolor\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs);
  const color = sanitizeColor(colorAttr?.[2] || colorAttr?.[3] || colorAttr?.[4] || pickStyle(raw, "color"));
  const background = sanitizeColor(pickStyle(raw, "background-color"))
    || sanitizeColor(pickStyle(raw, "mso-highlight"))
    || sanitizeColor((pickStyle(raw, "background") || "").split(/\s+/)[0]);
  const parts: string[] = [];
  if (color) parts.push(`color:${color}`);
  if (background) parts.push(`background-color:${background}`);
  return parts.length ? parts.join(";") : null;
}

function readEntity(html: string, index: number): { length: number; next: number } | null {
  if (html[index] !== "&") return null;
  const semi = html.indexOf(";", index);
  if (semi === -1 || semi - index > 12) return null;
  const entity = html.slice(index, semi + 1);
  const decoded = decodeEntities(entity);
  if (decoded === entity) return null;
  return { length: decoded.length, next: semi + 1 };
}

function openTagName(tag: string): string {
  return (/^<\s*([a-z0-9]+)/i.exec(tag)?.[1] || "").toLowerCase();
}

export function htmlAfterPlainPrefix(html: string, plainOffset: number): string {
  if (plainOffset <= 0) return html;
  const open: string[] = [];
  let textCount = 0;
  let i = 0;

  while (i < html.length && textCount < plainOffset) {
    if (html[i] === "<") {
      const end = html.indexOf(">", i);
      if (end === -1) break;
      const tag = html.slice(i, end + 1);
      const name = openTagName(tag);
      const closing = /^<\s*\//.test(tag);
      const selfClosing = /\/>\s*$/.test(tag) || name === "br";
      if (name && closing) {
        for (let k = open.length - 1; k >= 0; k--) {
          if (openTagName(open[k]) === name) {
            open.splice(k, 1);
            break;
          }
        }
      } else if (name && !selfClosing) {
        open.push(tag);
      }
      i = end + 1;
      continue;
    }

    const entity = readEntity(html, i);
    if (entity) {
      textCount += entity.length;
      i = entity.next;
      continue;
    }

    textCount += 1;
    i += 1;
  }

  return open.join("") + html.slice(i);
}

export function richAfterLabel(line: string, plain: string, remainder: string): string {
  if (!remainder.trim()) return "";
  if (!hasRichText(line)) return remainder.trim();

  const plainFull = stripRichTags(line).replace(/\u00a0/g, " ");
  const leading = plainFull.length - plainFull.trimStart().length;
  const prefixLength = plain.length - remainder.length;
  const sliced = htmlAfterPlainPrefix(line, leading + prefixLength);
  const cleaned = sanitizeRichHtml(sliced, { lists: true }).trim();
  if (plainOf(cleaned) === remainder.trim()) return cleaned;
  return remainder.trim();
}

export function storedRichLine(line: string, plain: string): string {
  if (!hasRichText(line)) return plain;
  const cleaned = sanitizeRichHtml(line.trim(), { lists: true }).trim();
  return plainOf(cleaned) === plain ? cleaned : plain;
}

type SanitizeOptions = { lists?: boolean };

export function sanitizeRichHtml(input: string, options: SanitizeOptions = {}): string {
  if (!input || !hasRichText(input)) return input;
  const lists = options.lists ?? true;

  const src = input
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!\[if[\s\S]*?<!\[endif\]>/gi, "")
    .replace(/<\/?o:p[^>]*>/gi, "");

  const out: string[] = [];
  const stack: string[] = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9:]*)([^>]*)>/g;
  let last = 0;
  let match: RegExpExecArray | null;

  const closeUntil = (name: string) => {
    const index = stack.lastIndexOf(name);
    if (index === -1) return false;
    while (stack.length > index) {
      const top = stack.pop();
      if (top && top !== "*") out.push(`</${top}>`);
    }
    return true;
  };

  while ((match = re.exec(src))) {
    out.push(src.slice(last, match.index));
    last = match.index + match[0].length;
    const rawName = match[1].toLowerCase();
    const isClose = match[0].startsWith("</");
    const attrs = match[2] || "";
    const insideLi = stack.includes("li");

    if (rawName === "br") {
      out.push(insideLi ? " " : "\n");
      continue;
    }

    if (rawName === "b" || rawName === "strong" || rawName === "i" || rawName === "em" || rawName === "u") {
      const tag = rawName === "strong" ? "b" : rawName === "em" ? "i" : rawName;
      if (!isClose) {
        out.push(`<${tag}>`);
        stack.push(tag);
      } else {
        closeUntil(tag);
      }
      continue;
    }

    if (rawName === "span" || rawName === "mark" || rawName === "font") {
      if (!isClose) {
        const style = styleFromAttrs(attrs);
        if (style) {
          out.push(`<span style="${style}">`);
          stack.push("span");
        } else {
          stack.push("*");
        }
      } else {
        const index = Math.max(stack.lastIndexOf("span"), stack.lastIndexOf("*"));
        if (index !== -1) {
          while (stack.length > index) {
            const top = stack.pop();
            if (top && top !== "*") out.push(`</${top}>`);
          }
        }
      }
      continue;
    }

    if (rawName === "ul" || rawName === "ol" || rawName === "li") {
      if (!lists) {
        if (isClose && rawName === "li" && !insideLi) out.push("\n");
        continue;
      }
      if (rawName === "li") {
        if (!isClose) {
          out.push("<li>");
          stack.push("li");
        } else {
          closeUntil("li");
        }
      } else if (!isClose) {
        out.push("<ul>");
        stack.push("ul");
      } else {
        closeUntil("ul");
      }
      continue;
    }

    if (["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "tr"].includes(rawName)) {
      // Chrome wraps each new line in a <div> after the first text node.
      // The break belongs before that block, otherwise "Paris<div>Activités"
      // becomes "ParisActivités".
      if (!isClose && !insideLi && out.join("").length > 0 && !out.join("").endsWith("\n")) {
        out.push("\n");
      }
    }
  }

  out.push(src.slice(last));
  while (stack.length) {
    const top = stack.pop();
    if (top && top !== "*") out.push(`</${top}>`);
  }

  let html = out.join("");
  let previous = "";
  const empty = /<(b|i|u|span|li)(\s[^>]*)?>[\s\u00a0]*(?:&nbsp;)*\s*<\/\1>/gi;
  while (html !== previous) {
    previous = html;
    html = html.replace(empty, "");
  }

  return html
    .replace(/<ul>\s*<\/ul>/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function toItinerarySource(description: string): string {
  if (!hasRichText(description)) return description;
  return sanitizeRichHtml(description, { lists: true });
}

export function valueToEditorHtml(value: string, lists: boolean): string {
  if (!value) return "";
  if (!hasRichText(value)) return escapeHtml(value).replace(/\n/g, "<br>");
  return sanitizeRichHtml(value, { lists }).replace(/\n/g, "<br>");
}

export function editorHtmlToValue(html: string, options: SanitizeOptions): string {
  if (!html) return "";
  if (!hasRichText(html)) return html.replace(/\r\n/g, "\n");

  const lists = options.lists ?? false;
  const cleaned = sanitizeRichHtml(html, { lists });
  if (!hasRichText(cleaned)) {
    return stripRichTags(cleaned).replace(/\u00a0/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  }
  if (lists && /<ul\b/i.test(cleaned)) return cleaned.trim();
  if (lists) return cleaned.replace(/\n/g, "<br>").replace(/(?:<br>){3,}/gi, "<br><br>").trim();
  return cleaned.trim();
}

export function toggleBulletList(value: string): string {
  const sanitized = hasRichText(value) ? sanitizeRichHtml(value, { lists: true }) : value;
  if (/<ul\b/i.test(sanitized)) {
    const items = [...sanitized.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((item) => item[1].replace(/<br\s*\/?>/gi, " ").trim())
      .filter((item) => plainOf(item));
    const joined = items.join("\n");
    return hasRichText(joined) ? joined.replace(/\n/g, "<br>") : joined;
  }

  const linear = hasRichText(sanitized) ? sanitized.replace(/<br\s*\/?>/gi, "\n") : sanitized;
  const parts = linear
    .split("\n")
    .map((part) => part.replace(/^(?:\s|&nbsp;)*(?:[•·]|\*|–|—|-(?=\s))\s*/u, "").trim())
    .filter((part) => plainOf(part));
  if (parts.length === 0) return "<ul><li></li></ul>";
  return `<ul>${parts.map((part) => `<li>${part}</li>`).join("")}</ul>`;
}
