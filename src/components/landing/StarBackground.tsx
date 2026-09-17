"use client";
import { useMemo } from "react";

function createRng(seed: number) {
    let s = (seed * 2654435761) >>> 0;         
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;  
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;  
    return (): number => {
        s = (Math.imul(1664525, s) + 1013904223) >>> 0;
        return s / 0x100000000;
    };
}

// 4-point sparkle path  (8-vertex polygon, thin inner radius)
function sparklePath(cx: number, cy: number, outer: number): string {
    const i = outer * 0.11;
    return (
        `M${cx} ${cy - outer}` +
        `L${cx + i} ${cy - i}` +
        `L${cx + outer} ${cy}` +
        `L${cx + i} ${cy + i}` +
        `L${cx} ${cy + outer}` +
        `L${cx - i} ${cy + i}` +
        `L${cx - outer} ${cy}` +
        `L${cx - i} ${cy - i}Z`
    );
}

// Build constellation — random nodes + proximity-based edges
function buildConstellation(rng: () => number): {
    nodes: { x: number; y: number }[];
    edges: [number, number][];
} {
    const nodeCount = 15 + Math.floor(rng() * 8); // around 15 – 22 nodes

    const nodes: { x: number; y: number }[] = Array.from(
        { length: nodeCount },
        () => ({ x: 80 + rng() * 1280, y: 40 + rng() * 820 }),
    );

    const edges: [number, number][] = [];
    const MIN_DIST = 90;
    const MAX_DIST = 290;

    for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
            const dx = nodes[a].x - nodes[b].x;
            const dy = nodes[a].y - nodes[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Connect nearby pairs with ~45 % probability
            if (dist >= MIN_DIST && dist <= MAX_DIST && rng() > 0.55) {
                edges.push([a, b]);
            }
        }
    }

    return { nodes, edges };
}

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
}

interface Props {
    seed?: number;
    className?: string;
}

export default function StarBackground({ seed = 1, className = "" }: Props) {
    const { stars, nodes, edges } = useMemo(() => {
        const rng = createRng(seed);
        const { nodes, edges } = buildConstellation(rng);

        // Random scatter stars
        const bg: Star[] = Array.from({ length: 80 }, () => {
            const roll = rng();
            const size =
                roll < 0.10 ? 7 + rng() * 6    // large   ~10 %
                : roll < 0.42 ? 3 + rng() * 4   // medium  ~32 %
                : 1.5 + rng() * 2;              // small   ~58 %
            const opacity =
                rng() < 0.32
                    ? 0.10 + rng() * 0.22       // dim
                    : 0.45 + rng() * 0.55;      // bright
            return { x: rng() * 1440, y: rng() * 900, size, opacity };
        });

        const cn: Star[] = nodes.map(({ x, y }) => ({
            x,
            y,
            size: 3.5 + rng() * 3.5,
            opacity: 0.70 + rng() * 0.30,
        }));

        return { stars: [...bg, ...cn], nodes, edges };
    }, [seed]);

    return (
        <svg
            className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {/* Constellation lines */}
            {edges.map(([a, b], idx) => (
                <line
                    key={idx}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="#E87500"
                    strokeWidth="0.8"
                    strokeOpacity="0.28"
                />
            ))}

            {/* Stars */}
            {stars.map((s, idx) => (
                <path
                    key={idx}
                    d={sparklePath(s.x, s.y, s.size)}
                    fill="#E87500"
                    opacity={s.opacity}
                />
            ))}
        </svg>
    );
}
