interface LastSearchLogoProps {
  className?: string;
}

// The LastSearch mark: an "LS" monogram on a rounded orange tile.
export function LastSearchLogo({ className = "w-4 h-4" }: LastSearchLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className={className}
    >
      <defs>
        <linearGradient id="ls-tile-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FB923C" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#ls-tile-grad)" />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fontFamily="-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="21"
        fontWeight="800"
        letterSpacing="-1"
        fill="#FFFFFF"
      >
        LS
      </text>
    </svg>
  );
}
