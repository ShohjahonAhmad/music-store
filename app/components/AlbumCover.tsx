import seedrandom from "seedrandom";

export default function AlbumCover({
  seed,
  title,
  artist,
}: {
  seed: string;
  title: string;
  artist: string;
}) {
  const rng = seedrandom(`${seed}-cover`);

  const hue = Math.floor(rng() * 360);

  const color1 = `hsl(${hue}, 70%, 50%)`;
  const color2 = `hsl(${(hue + 60) % 360}, 70%, 40%)`;

  return (
    <svg width={208} height={208}>
      <defs>
        <linearGradient
          id={`gradient-${seed}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>

      <rect width="208" height="208" fill={`url(#gradient-${seed})`} />

      {Array.from({ length: 5 }).map((_, i) => (
        <circle
          key={i}
          cx={rng() * 208}
          cy={rng() * 208}
          r={20 + rng() * 40}
          fill="rgba(255,255,255,0.15)"
        />
      ))}

      <text x="16" y="170" fill="white" fontSize="18" fontWeight="bold">
        {truncate(title, 20)}
      </text>

      <text x="16" y="190" fill="rgba(255,255,255,0.8)" fontSize="12">
        {artist}
      </text>
    </svg>
  );
}

function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}
