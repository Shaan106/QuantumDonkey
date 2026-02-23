import { useMemo } from "react";

interface MapProps {
  people: { name: string }[];
}

interface Position {
  x: number;
  y: number;
}

const SVG_W = 900;
const SVG_H = 600;
const PADDING = 50;
const MIN_DIST = 70;

function generatePositions(count: number, existing: Position[]): Position[] {
  const result: Position[] = [...existing];
  const placed: Position[] = [];

  for (let i = 0; i < count; i++) {
    let pos: Position | null = null;
    for (let attempt = 0; attempt < 200; attempt++) {
      const x = PADDING + Math.random() * (SVG_W - PADDING * 2);
      const y = PADDING + Math.random() * (SVG_H - PADDING * 2);
      const tooClose = result.some(
        (p) => Math.hypot(p.x - x, p.y - y) < MIN_DIST,
      );
      if (!tooClose) {
        pos = { x, y };
        break;
      }
    }
    if (!pos) {
      // Fallback: just place it (shouldn't happen with 14 items on 900x600)
      pos = {
        x: PADDING + Math.random() * (SVG_W - PADDING * 2),
        y: PADDING + Math.random() * (SVG_H - PADDING * 2),
      };
    }
    result.push(pos);
    placed.push(pos);
  }

  return placed;
}

const NATURAL_FEATURES = [
  {
    images: [
      "/map/natural/forest/forest-1.png",
      "/map/natural/forest/forest-2.png",
    ],
  },
  {
    images: [
      "/map/natural/forest/forest-1.png",
      "/map/natural/forest/forest-2.png",
    ],
  },
  {
    images: [
      "/map/natural/forest/forest-1.png",
      "/map/natural/forest/forest-2.png",
    ],
  },
  {
    images: [
      "/map/natural/mountain/mountain-1.png",
      "/map/natural/mountain/mountain-2.png",
    ],
  },
  {
    images: [
      "/map/natural/mountain/mountain-1.png",
      "/map/natural/mountain/mountain-2.png",
    ],
  },
];

export default function Map({ people }: MapProps) {
  const { housePositions, naturalItems } = useMemo(() => {
    const houses = generatePositions(people.length, []);
    const naturalPositions = generatePositions(NATURAL_FEATURES.length, houses);
    const naturalItems = naturalPositions.map((pos, i) => {
      const opts = NATURAL_FEATURES[i].images;
      return { pos, src: opts[Math.floor(Math.random() * opts.length)] };
    });
    return { housePositions: houses, naturalItems };
  }, [people.length]);

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      style={{ maxWidth: 1125, display: "block" }}
      aria-label="Compound town map"
    >
      {/* Background */}
      <rect
        x={0}
        y={0}
        width={SVG_W}
        height={SVG_H}
        fill="#f7f2de"
        rx={8}
        stroke="#c8b89a"
        strokeWidth={2}
      />

      {/* Natural features */}
      {naturalItems.map(({ pos, src }, i) => (
        <image
          key={`nat-${i}`}
          href={src}
          x={pos.x - 26}
          y={pos.y - 26}
          width={52}
          height={52}
        />
      ))}

      {/* Houses */}
      {people.map((person, i) => {
        const pos = housePositions[i];
        if (!pos) return null;
        return (
          <g key={person.name}>
            <image
              href="/map/poi/house.png"
              x={pos.x - 24}
              y={pos.y - 24}
              width={47}
              height={47}
            />
            <text
              x={pos.x}
              y={pos.y + 28}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize={10}
              fontFamily="monospace"
              fill="#333"
              style={{ userSelect: "none" }}
            >
              {person.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
