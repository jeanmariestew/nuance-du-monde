export const VRDF_TRAVEL_TYPE_SLUG = "voyageurs-regroupes-dates-fixes";

export function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function calendarDay(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

/** Prix le plus bas parmi les départs qui ne sont pas encore passés. */
export function lowestUpcomingDatePrice(
  dates: Array<{ departure_date?: unknown; price?: unknown }>,
  today = utcToday()
): number | null {
  let best: number | null = null;
  for (const date of dates) {
    const day = calendarDay(date.departure_date);
    if (!day || day < today) continue;
    if (date.price == null || date.price === "") continue;
    const price = typeof date.price === "number" ? date.price : Number(date.price);
    if (!Number.isFinite(price)) continue;
    if (best === null || price < best) best = price;
  }
  return best;
}
