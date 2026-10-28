export const FIT_TRAVEL_TYPE_SLUG = "voyages-individuel";

function cleanPrice(value: unknown): string {
  if (value == null) return "";
  return String(value).replace(/\s+/g, " ").trim().slice(0, 255);
}

/** Liste libre de prix FIT. Les anciens groupes { pax, prices } sont aplatis. */
export function parseFitPaxPrices(value: unknown): string[] {
  let raw = value;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      raw = JSON.parse(trimmed);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];

  const prices: string[] = [];
  for (const item of raw) {
    if (typeof item === "string" || typeof item === "number") {
      const text = cleanPrice(item);
      if (text) prices.push(text);
      continue;
    }
    if (item && typeof item === "object" && Array.isArray((item as { prices?: unknown }).prices)) {
      for (const price of (item as { prices: unknown[] }).prices) {
        const text = cleanPrice(price);
        if (text) prices.push(text);
      }
    }
  }
  return prices;
}

export function serializeFitPaxPrices(value: unknown): string | null {
  const prices = parseFitPaxPrices(value);
  return prices.length ? JSON.stringify(prices) : null;
}
