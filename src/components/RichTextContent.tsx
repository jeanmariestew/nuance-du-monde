import { hasRichText, sanitizeRichHtml } from "@/lib/richText";

const listClass =
  "[&_b]:font-bold [&_strong]:font-bold [&_ul]:my-1 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_li]:leading-relaxed";

export default function RichTextContent({
  value,
  className,
  as = "div",
}: {
  value: string;
  className?: string;
  as?: "div" | "span";
}) {
  const Tag = /<ul\b/i.test(value) ? "div" : as;
  return (
    <Tag
      className={[className, listClass].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(value, { lists: true }) }}
    />
  );
}

export function RichOrPlain({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  if (!hasRichText(value)) {
    return <div className={className}>{value}</div>;
  }
  return <RichTextContent value={value} className={className?.replace("whitespace-pre-line", "").trim()} />;
}
