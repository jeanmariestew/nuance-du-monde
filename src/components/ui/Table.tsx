import React from "react";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={(
          "w-full text-left border-collapse [&_th]:text-sm [&_td]:text-sm " +
          "[&_th]:border-b [&_th]:border-neutral-200 [&_th]:px-3 [&_th]:py-2 " +
          "[&_td]:border-b [&_td]:border-neutral-100 [&_td]:px-3 [&_td]:py-2 " +
          (className || "")
        ).trim()}
        {...props}
      />
    </div>
  );
}

export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}
export function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function Tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} />;
}
export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={("text-neutral-500 font-semibold " + (className || "")).trim()} {...props} />;
}
export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={("align-middle " + (className || "")).trim()} {...props} />;
}

export default { Table, THead, TBody, Tr, Th, Td };
