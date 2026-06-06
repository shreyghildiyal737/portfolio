"use client";

export function PrintButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className={className}
      aria-label="Print or export as PDF"
    >
      Print / PDF
    </button>
  );
}
