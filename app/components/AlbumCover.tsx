import seedrandom from "seedrandom";

const layouts: any = [
  {
    x: 16,
    titleY1: 150,
    titleY2: 170,
    artistY: 190,
    anchor: "start",
  },
  {
    x: 16,
    titleY1: 40,
    titleY2: 60,
    artistY: 80,
    anchor: "start",
  },
  {
    x: 104,
    titleY1: 100,
    titleY2: 120,
    artistY: 145,
    anchor: "middle",
  },
];

export default function AlbumCover({
  seed,
  title,
  artist,
  size,
}: {
  seed: string;
  title: string;
  artist: string;
  size?: number;
}) {
  const rng = seedrandom(`${seed}-cover`);

  const hue = Math.floor(rng() * 360);

  const color1 = `hsl(${hue}, 70%, 50%)`;
  const color2 = `hsl(${(hue + 60) % 360}, 70%, 40%)`;
  const [title1, title2] = splitTitle(title);

  const coverStyle = Math.floor(rng() * 3);
  const layout = layouts[Math.floor(rng() * layouts.length)];
  const squareSize = size !== undefined ? size : 208;

  if (size !== undefined) {
    return (
      <svg width={squareSize} height={squareSize}>
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

        {coverStyle === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={i}
                cx={rng() * 208}
                cy={rng() * 208}
                r={20 + rng() * 40}
                fill="rgba(255,255,255,0.15)"
              />
            ))
          : coverStyle === 1
            ? Array.from({ length: 5 }).map((_, i) => {
                const x = rng() * 208;
                const y = rng() * 208;
                const width = 20 + rng() * 40;
                const height = 20 + rng() * 40;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="rgba(255,255,255,0.15)"
                    transform={`rotate(${rng() * 360} ${x + width / 2} ${y + height / 2})`}
                  />
                );
              })
            : Array.from({ length: 5 }).map((_, i) => {
                const x = rng() * 208;
                const y = rng() * 208;
                const size = 30 + rng() * 60;
                return (
                  <polygon
                    points={`
              ${x},${y}
              ${x + size},${y}
              ${x + size / 2},${y - size}
            `}
                    fill="rgba(255,255,255,0.15)"
                  />
                );
              })}
      </svg>
    );
  }

  return (
    <svg width={squareSize} height={squareSize}>
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

      {coverStyle === 0
        ? Array.from({ length: 5 }).map((_, i) => (
            <circle
              key={i}
              cx={rng() * 208}
              cy={rng() * 208}
              r={20 + rng() * 40}
              fill="rgba(255,255,255,0.15)"
            />
          ))
        : coverStyle === 1
          ? Array.from({ length: 5 }).map((_, i) => {
              const x = rng() * 208;
              const y = rng() * 208;
              const width = 20 + rng() * 40;
              const height = 20 + rng() * 40;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="rgba(255,255,255,0.15)"
                  transform={`rotate(${rng() * 360} ${x + width / 2} ${y + height / 2})`}
                />
              );
            })
          : Array.from({ length: 5 }).map((_, i) => {
              const x = rng() * 208;
              const y = rng() * 208;
              const size = 30 + rng() * 60;
              return (
                <polygon
                  points={`
              ${x},${y}
              ${x + size},${y}
              ${x + size / 2},${y - size}
            `}
                  fill="rgba(255,255,255,0.15)"
                />
              );
            })}

      <text
        x={layout.x}
        y={layout.titleY1}
        textAnchor={layout.anchor}
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        {title1}
      </text>
      <text
        x={layout.x}
        y={layout.titleY2}
        textAnchor={layout.anchor}
        fill="white"
        fontSize="18"
        fontWeight="bold"
        fontFamily="Inter, sans-serif"
      >
        {title2}
      </text>

      <text
        x={layout.x}
        y={layout.artistY}
        textAnchor={layout.anchor}
        fill="rgba(255,255,255,0.8)"
        fontSize="12"
        fontFamily="Inter, sans-serif"
      >
        {truncate(artist, 25)}
      </text>
    </svg>
  );
}

function truncate(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

function splitTitle(title: string) {
  const words = title.split(" ");

  const midpoint = Math.ceil(words.length / 2);

  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}
