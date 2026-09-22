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
    const nodeCount = 28 + Math.floor(rng() * 12); // 28-39 nodes across full height

    const nodes: { x: number; y: number }[] = Array.from(
        { length: nodeCount },
        () => ({ x: 60 + rng() * (VIEW_W - 120), y: 60 + rng() * (VIEW_H - 120) }),
    );

    const edges: [number, number][] = [];
    const MIN_DIST = 40;
    const MAX_DIST = 350;

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
    // twinkle animation
    twinkle: boolean;
    twinkleDur: number;
    twinkleDelay: number;
    twinkleLo: number;
    twinkleHi: number;
    // size-breathe + rotation animation
    pulse: boolean;
    pulseDur: number;
    pulseDelay: number;
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

        // Background stars (~2000 covering the full viewBox height)
        const bg: Star[] = Array.from({ length: 2000 }, () => {
            const roll = rng();
            const size =
                roll < 0.10 ? 7 + rng() * 6
                : roll < 0.42 ? 3 + rng() * 4
                : 1.5 + rng() * 2;
            const opacity =
                rng() < 0.32 ? 0.10 + rng() * 0.22 : 0.45 + rng() * 0.55;

            const twinkle = rng() < 0.60;
            const twinkleDur = 2.0 + rng() * 4.0;
            const twinkleDelay = rng() * 8.0;
            const twinkleLo = Math.max(0.05, opacity * 0.3 + rng() * 0.1);
            const twinkleHi = Math.min(1.0, opacity + rng() * 0.3);

            const pulse = twinkle && rng() < 0.75;
            const pulseDur = 2.5 + rng() * 3.5;
            const pulseDelay = rng() * 6.0;

            return {
                x: rng() * VIEW_W,
                y: rng() * VIEW_H,
                size,
                opacity,
                twinkle, twinkleDur, twinkleDelay, twinkleLo, twinkleHi,
                pulse, pulseDur, pulseDelay,
            };
        });

        // Constellation node stars
        const cn: Star[] = nodes.map(({ x, y }) => {
            const opacity = 0.70 + rng() * 0.30;
            const twinkle = rng() < 0.70;
            const twinkleDur = 1.8 + rng() * 3.5;
            const twinkleDelay = rng() * 6.0;
            const twinkleLo = Math.max(0.30, opacity * 0.5);
            const twinkleHi = Math.min(1.0, opacity + 0.15);
            const pulse = twinkle && rng() < 0.85;
            const pulseDur = 2.0 + rng() * 3.0;
            const pulseDelay = rng() * 5.0;
            return {
                x, y,
                size: 3.5 + rng() * 3.5,
                opacity,
                twinkle, twinkleDur, twinkleDelay, twinkleLo, twinkleHi,
                pulse, pulseDur, pulseDelay,
            };
        });

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
            {/* Constellation edges */}
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
            {stars.map((s, idx) => {
                // No animation - bare path for performance
                if (!s.twinkle && !s.pulse) {
                    return (
                        <path
                            key={idx}
                            d={sparklePath(s.x, s.y, s.size)}
                            fill="#E87500"
                            opacity={s.opacity}
                        />
                    );
                }

                // Animated stars are drawn at local (0,0) inside a translated <g>
                // so that scale and rotate transforms pivot from the star's own centre.
                return (
                    <g key={idx} transform={`translate(${s.x}, ${s.y})`}>
                        <path
                            d={sparklePath(0, 0, s.size)}
                            fill="#E87500"
                            opacity={s.opacity}
                        >
                            {/* Twinkle - smooth opacity oscillation */}
                            {s.twinkle && (
                                <animate
                                    attributeName="opacity"
                                    values={`${s.twinkleLo};${s.twinkleHi};${s.twinkleLo}`}
                                    dur={`${s.twinkleDur}s`}
                                    begin={`${s.twinkleDelay}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                                    keyTimes="0;0.5;1"
                                />
                            )}

                            {/* Size breathe - gentle scale pulse */}
                            {s.pulse && (
                                <animateTransform
                                    attributeName="transform"
                                    type="scale"
                                    additive="sum"
                                    values="1;1.28;1"
                                    dur={`${s.pulseDur}s`}
                                    begin={`${s.pulseDelay}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                                    keyTimes="0;0.5;1"
                                />
                            )}

                            {/* Gentle rotation - slightly slower than scale so they drift apart */}
                            {s.pulse && (
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    additive="sum"
                                    values="-20;20;-20"
                                    dur={`${s.pulseDur * 1.6}s`}
                                    begin={`${s.pulseDelay}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                                    keyTimes="0;0.5;1"
                                />
                            )}
                        </path>
                    </g>
                );
            })}
        </svg>
    );
}
