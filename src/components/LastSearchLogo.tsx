interface LastSearchLogoProps {
  className?: string;
}

// The LastSearch mark: a magnifying glass whose lens holds a check —
// verified search, drawn literally. Stroke-only, one accent color.
export function LastSearchLogo({ className = "w-4 h-4" }: LastSearchLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className={className}
      fill="none"
    >
      <circle cx="17" cy="17" r="10.5" stroke="#F97316" strokeWidth="3" />
      <line x1="25" y1="25" x2="33.5" y2="33.5" stroke="#F97316" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M12.5 17.5 L15.8 20.8 L22 13.8" stroke="#F97316" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
