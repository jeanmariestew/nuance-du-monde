"use client";

const fieldClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[--color-primary] focus:outline-none focus:ring-2 focus:ring-[--color-primary]";

type Props = {
  prices: string[];
  onChange: (prices: string[]) => void;
};

export default function FitPaxPricesEditor({ prices, onChange }: Props) {
  const fields = prices.length > 0 ? prices : [""];

  function update(index: number, value: string) {
    onChange(fields.map((price, i) => (i === index ? value : price)));
  }

  function add() {
    onChange([...fields, ""]);
  }

  function remove(index: number) {
    const next = fields.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [""]);
  }

  return (
    <div className="grid gap-3">
      {fields.map((price, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={price}
            onChange={(e) => update(index, e.target.value)}
            placeholder="Ex. 2 PAX : 2 490 CAD / personne"
            className={fieldClass}
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="shrink-0 text-sm text-red-600 hover:underline"
            >
              Retirer
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="h-10 w-fit rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Ajouter un champ
      </button>
    </div>
  );
}
