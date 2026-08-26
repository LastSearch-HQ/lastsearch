interface LastSearchLogoProps {
  className?: string;
}

// The LastSearch mark: a solid magnifier whose lens carries the check in
// negative space — verified search, one glyph, one color.
export function LastSearchLogo({ className = "w-4 h-4" }: LastSearchLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className={className}
      fill="none"
    >
      <circle cx="18" cy="18" r="14" fill="#F97316" />
      <line x1="28.6" y1="28.6" x2="36" y2="36" stroke="#F97316" strokeWidth="6.4" strokeLinecap="round" />
      <path d="M11.2 18.6 L16.4 23.8 L25.2 13.4" stroke="#FFFFFF" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
