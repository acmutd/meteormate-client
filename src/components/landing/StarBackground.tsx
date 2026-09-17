"use client";
import { useMemo } from "react";

// RNG for the stars
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

const VIEW_W = 1440;
const VIEW_H = 4000;

function buildConstellation(rng: () => number): {
    nodes: { x: number; y: number }[];
    edges: [number, number][];
} {
    const nodeCount = 28 + Math.floor(rng() * 12); // 28–39 nodes across full height

    const nodes: { x: number; y: number }[] = Array.from(
        { length: nodeCount },
        () => ({ x: 60 + rng() * (VIEW_W - 120), y: 60 + rng() * (VIEW_H - 120) }),
    );

    const edges: [number, number][] = [];
    const MIN_DIST = 90;
    const MAX_DIST = 480;

    for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
            const dx = nodes[a].x - nodes[b].x;
            const dy = nodes[a].y - nodes[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= MIN_DIST && dist <= MAX_DIST && rng() > 0.38) {
                edges.push([a, b]);
            }
        }
    }

    return { nodes, edges };
}

// Types
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

// Component
export default function StarBackground({ seed = 1, className = "" }: Props) {
    const { stars, nodes, edges } = useMemo(() => {
        const rng = createRng(seed);

        const { nodes, edges } = buildConstellation(rng);

        // Scale star count to cover the larger viewBox (~200 for 1440×4000)
        const bg: Star[] = Array.from({ length: 200 }, () => {
            const roll = rng();
            const size =
                roll < 0.10 ? 7 + rng() * 6
                : roll < 0.42 ? 3 + rng() * 4
                : 1.5 + rng() * 2;
            const opacity =
                rng() < 0.32 ? 0.10 + rng() * 0.22 : 0.45 + rng() * 0.55;
            return {
                x: rng() * VIEW_W,
                y: rng() * VIEW_H,
                size,
                opacity,
            };
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
            className={`w-full pointer-events-none select-none ${className}`}
            style={{ display: "block" }}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMidYTop meet"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
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
