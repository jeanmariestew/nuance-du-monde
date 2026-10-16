"use client";

import { useEffect, useRef } from "react";
import {
  editorHtmlToValue,
  escapeHtml,
  hasRichText,
  htmlAfterPlainPrefix,
  plainOf,
  stripRichTags,
  toggleBulletList,
  valueToEditorHtml,
} from "@/lib/richText";

interface RichTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  lists?: boolean;
  /** Plusieurs lignes collées deviennent une liste. Réservé aux champs d'inclusions. */
  autoList?: boolean;
  /** "selection" : la ligne ou la sélection courante. "field" : tout le champ. */
  listScope?: "field" | "selection";
}

function styleFromElement(el: HTMLElement): string | null {
  const raw = el.getAttribute("style") || "";
  const pick = (prop: string) => raw.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, "i"))?.[1]?.trim() || "";
  const color = el.style.color || el.getAttribute("color") || pick("color");
  const background = el.style.backgroundColor || pick("background-color") || pick("mso-highlight") || pick("background").split(/\s+/)[0];
  const probe = `<span style="${[color ? `color:${color}` : "", background ? `background-color:${background}` : ""].filter(Boolean).join(";")}"></span>`;
  const cleaned = probe.includes("style=\"\"") ? "" : probe;
  return cleaned ? cleaned.slice(cleaned.indexOf("style=\"") + 7, cleaned.lastIndexOf("\"")) : null;
}

function isSymbolBullet(el: HTMLElement): boolean {
  const font = `${el.style.fontFamily} ${el.getAttribute("style") || ""}`.toLowerCase();
  const text = (el.textContent || "").replace(/\u00a0/g, " ").trim();
  return /symbol|wingdings/.test(font) && text.length <= 2;
}

function stripLeadingBulletHtml(html: string): string {
  const plain = stripRichTags(html).replace(/\u00a0/g, " ");
  const match = /^\s*[•·\-*–—]\s+/.exec(plain);
  if (!match) return html;
  return htmlAfterPlainPrefix(html, match[0].length);
}

function domToHtml(node: Node, lists: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent || "");
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as HTMLElement;
  const tag = el.tagName;
  if (["SCRIPT", "STYLE", "META", "LINK", "TITLE"].includes(tag) || isSymbolBullet(el)) return "";

  const children = () => Array.from(el.childNodes).map((child) => domToHtml(child, lists)).join("");
  if (tag === "BR") return "\n";
  if (tag === "B" || tag === "STRONG") return `<b>${children()}</b>`;
  if (tag === "I" || tag === "EM") return `<i>${children()}</i>`;
  if (tag === "U") return `<u>${children()}</u>`;

  if (tag === "UL" || tag === "OL") {
    const items = Array.from(el.children).filter((child) => (child as HTMLElement).tagName === "LI");
    if (!lists) return items.map((item) => `${stripLeadingBulletHtml(inlineHtml(item as HTMLElement))}\n`).join("");
    return `<ul>${items.map((item) => `<li>${stripLeadingBulletHtml(inlineHtml(item as HTMLElement))}</li>`).join("")}</ul>`;
  }

  if (tag === "SPAN" || tag === "FONT" || tag === "MARK") {
    const inner = children();
    const style = styleFromElement(el);
    return style ? `<span style="${style}">${inner}</span>` : inner;
  }

  if (["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "TR"].includes(tag)) {
    const inner = stripLeadingBulletHtml(children()).trim();
    if (!plainOf(inner)) return "";
    return `${inner}\n`;
  }

  return children();
}

function inlineHtml(el: HTMLElement): string {
  return Array.from(el.childNodes)
    .map((child) => domToHtml(child, false))
    .join("")
    .replace(/\n+/g, " ")
    .trim();
}

function clipboardToValue(html: string, text: string, lists: boolean, autoList: boolean): string {
  let raw = text.replace(/\r\n/g, "\n");
  if (html && typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    raw = domToHtml(doc.body, lists).replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");
  }

  const lineCount = raw.split("\n").filter((line) => plainOf(line)).length;
  if (autoList && lineCount >= 2 && !/<ul\b/i.test(raw)) {
    return toggleBulletList(raw);
  }
  return editorHtmlToValue(hasRichText(raw) ? raw : raw, { lists });
}

export default function RichTextField({
  value,
  onChange,
  placeholder,
  minHeight = 120,
  lists = false,
  autoList = false,
  listScope = "field",
}: RichTextFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (editorHtmlToValue(el.innerHTML, { lists }) === (value || "")) return;
    el.innerHTML = valueToEditorHtml(value, lists) || "";
    el.dataset.empty = plainOf(el.innerText || "") ? "false" : "true";
  }, [value, lists]);

  function emitFromDom() {
    const el = ref.current;
    if (!el) return;
    el.dataset.empty = plainOf(el.innerText || "") ? "false" : "true";
    const next = editorHtmlToValue(el.innerHTML, { lists });
    if (next !== value) onChange(next);
  }

  function saveSelection() {
    const selection = window.getSelection();
    const el = ref.current;
    if (!selection || !el || selection.rangeCount === 0) return;
    if (el.contains(selection.anchorNode)) savedRange.current = selection.getRangeAt(0).cloneRange();
  }

  function restoreSelection() {
    const selection = window.getSelection();
    if (!selection || !savedRange.current) return;
    selection.removeAllRanges();
    selection.addRange(savedRange.current);
  }

  function keepFocus(event: React.MouseEvent) {
    event.preventDefault();
  }

  function run(command: string, arg?: string) {
    ref.current?.focus();
    restoreSelection();
    document.execCommand(command, false, arg);
    emitFromDom();
  }

  function applyHighlight(color: string) {
    ref.current?.focus();
    restoreSelection();
    const before = ref.current?.innerHTML;
    document.execCommand("hiliteColor", false, color);
    if (ref.current && ref.current.innerHTML === before) {
      document.execCommand("backColor", false, color);
    }
    emitFromDom();
  }

  function onPaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    const pasted = clipboardToValue(html, text, lists, autoList);
    document.execCommand("insertHTML", false, valueToEditorHtml(pasted, lists));
    emitFromDom();
  }

  function onToggleList() {
    if (listScope === "selection") {
      ref.current?.focus();
      restoreSelection();
      document.execCommand("insertUnorderedList");
      emitFromDom();
      return;
    }
    const next = toggleBulletList(value);
    onChange(next);
    if (ref.current) {
      ref.current.innerHTML = valueToEditorHtml(next, true);
      ref.current.dataset.empty = plainOf(ref.current.innerText || "") ? "false" : "true";
    }
  }

  return (
    <div className="mt-1">
      <div className="mb-1 flex flex-wrap items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 p-1">
        <button type="button" onMouseDown={keepFocus} onClick={() => run("bold")} className="h-7 min-w-7 rounded px-2 text-sm font-bold hover:bg-white" aria-label="Gras">
          B
        </button>
        <button type="button" onMouseDown={keepFocus} onClick={() => run("italic")} className="h-7 min-w-7 rounded px-2 font-serif text-sm hover:bg-white" aria-label="Italique">
          I
        </button>
        <label className="flex items-center gap-1 rounded px-1 text-xs text-neutral-600 hover:bg-white">
          Couleur
          <input
            type="color"
            aria-label="Couleur du texte"
            defaultValue="#111111"
            onPointerDown={saveSelection}
            onChange={(event) => run("foreColor", event.target.value)}
            className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>
        <label className="flex items-center gap-1 rounded px-1 text-xs text-neutral-600 hover:bg-white">
          Surlignage
          <input
            type="color"
            aria-label="Couleur de surlignage"
            defaultValue="#fff59d"
            onPointerDown={saveSelection}
            onChange={(event) => applyHighlight(event.target.value)}
            className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
          />
        </label>
        {lists && (
          <button type="button" onMouseDown={keepFocus} onClick={onToggleList} className="h-7 rounded px-2 text-xs font-medium hover:bg-white" aria-label="Liste à puces">
            • Liste
          </button>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        data-empty={value ? "false" : "true"}
        suppressContentEditableWarning
        onInput={emitFromDom}
        onBlur={() => {
          saveSelection();
          emitFromDom();
        }}
        onPaste={onPaste}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        style={{ minHeight }}
        className="rich-editor w-full whitespace-pre-wrap rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary] [&_ul]:list-disc [&_ul]:pl-5"
      />
    </div>
  );
}
