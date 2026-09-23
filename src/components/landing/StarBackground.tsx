"use client";
import { useMemo } from "react";

// SVG viewport
const VIEWBOX_WIDTH  = 1440;
const VIEWBOX_HEIGHT = 4000;

/** Padding so stars never spawn right on the canvas edge. */
const EDGE_PADDING = 60;

// Constellation graph
/** Random number of constellation nodes spread across the full canvas height. */
const CONSTELLATION_NODE_COUNT_MIN = 28;
const CONSTELLATION_NODE_COUNT_RANGE = 12; // final count: 28–39

/** Only connect two nodes with an edge if they fall within this distance band. */
const CONSTELLATION_EDGE_MIN_DIST = 40;
const CONSTELLATION_EDGE_MAX_DIST = 350;

/** RNG threshold: skip ~38 % of in-range pairs so the graph isn't fully connected. */
const CONSTELLATION_EDGE_SPAWN_THRESHOLD = 0.38;

// Background star population
/** Total number of purely decorative background stars. */
const BG_STAR_COUNT = 2000;

// Size tiers – roll < LARGE_TIER → large, roll < MEDIUM_TIER → medium, else tiny
const BG_STAR_LARGE_TIER   = 0.10;
const BG_STAR_MEDIUM_TIER  = 0.42;

const BG_STAR_LARGE_SIZE_MIN   = 7;
const BG_STAR_LARGE_SIZE_RANGE = 6;   // 7–13 px

const BG_STAR_MEDIUM_SIZE_MIN   = 3;
const BG_STAR_MEDIUM_SIZE_RANGE = 4;  // 3–7 px

const BG_STAR_TINY_SIZE_MIN   = 1.5;
const BG_STAR_TINY_SIZE_RANGE = 2;   // 1.5–3.5 px

// Opacity tiers – roll < DIM_TIER → dim star, else bright star
const BG_STAR_DIM_TIER          = 0.32;
const BG_STAR_DIM_OPACITY_MIN   = 0.10;
const BG_STAR_DIM_OPACITY_RANGE = 0.22; // 0.10–0.32

const BG_STAR_BRIGHT_OPACITY_MIN   = 0.45;
const BG_STAR_BRIGHT_OPACITY_RANGE = 0.55; // 0.45–1.0

// Constellation node star appearance
const NODE_STAR_SIZE_MIN   = 3.5;
const NODE_STAR_SIZE_RANGE = 3.5; // 3.5–7 px

const NODE_STAR_OPACITY_MIN   = 0.70;
const NODE_STAR_OPACITY_RANGE = 0.30; // 0.70–1.0

// Twinkle animation (opacity oscillation)
/** Fraction of background stars that twinkle. */
const BG_TWINKLE_PROBABILITY = 0.60;

/** Fraction of constellation node stars that twinkle. */
const NODE_TWINKLE_PROBABILITY = 0.70;

const BG_TWINKLE_DUR_MIN   = 2.0; // seconds
const BG_TWINKLE_DUR_RANGE = 4.0; // 2–6 s per cycle

const BG_TWINKLE_DELAY_RANGE = 8.0; // randomised start offset 0–8 s

const NODE_TWINKLE_DUR_MIN   = 1.8;
const NODE_TWINKLE_DUR_RANGE = 3.5; // 1.8–5.3 s per cycle

const NODE_TWINKLE_DELAY_RANGE = 6.0; // 0–6 s

/** Floor for the dim phase of a twinkle, so stars never disappear completely. */
const BG_TWINKLE_LO_FLOOR   = 0.05;
const NODE_TWINKLE_LO_FLOOR = 0.30;

/** Extra opacity added on top of the star's base value at the bright peak. */
const BG_TWINKLE_HI_BONUS   = 0.3;
const NODE_TWINKLE_HI_BONUS = 0.15;

// Pulse animation (size breathe + rotation)
/** Fraction of *twinkling* background stars that also pulse and rotate. */
const BG_PULSE_PROBABILITY = 0.75;

/** Fraction of *twinkling* constellation node stars that also pulse and rotate. */
const NODE_PULSE_PROBABILITY = 0.85;

const BG_PULSE_DUR_MIN   = 2.5; // seconds
const BG_PULSE_DUR_RANGE = 3.5; // 2.5–6 s per breathe cycle

const BG_PULSE_DELAY_RANGE = 6.0; // 0–6 s

const NODE_PULSE_DUR_MIN   = 2.0;
const NODE_PULSE_DUR_RANGE = 3.0; // 2–5 s per breathe cycle

const NODE_PULSE_DELAY_RANGE = 5.0; // 0–5 s

/** Peak scale factor during the breathe-in phase (1 = original size). */
const PULSE_SCALE_PEAK = 1.28;

/** Rotation swing in degrees (star oscillates from -N to +N degrees). */
const PULSE_ROTATION_DEGREES = 20;

/**
 * The rotation cycle is this multiple longer than the scale cycle,
 * so scale and rotation gradually drift in and out of phase for a
 * more organic, non-mechanical look.
 */
const PULSE_ROTATION_DUR_MULTIPLIER = 1.6;

// Shared SVG animation easing
/** Cubic-bezier control points for a smooth ease-in-out on every animation. */
const EASE_IN_OUT_SPLINE = "0.45 0 0.55 1";

// Constellation appearance
const CONSTELLATION_EDGE_COLOR        = "#E87500";
const CONSTELLATION_EDGE_WIDTH        = 0.8;
const CONSTELLATION_EDGE_OPACITY      = 0.28;

// Star appearance
const STAR_FILL_COLOR = "#E87500";

/** Ratio of inner radius to outer radius on the 4-point sparkle polygon. */
const STAR_INNER_RADIUS_RATIO = 0.11;

// RNG — seeded linear-congruential generator (Knuth MMIX variant)
function createRng(seed: number) {
    let s = (seed * 2654435761) >>> 0;
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return (): number => {
        s = (Math.imul(1664525, s) + 1013904223) >>> 0;
        return s / 0x100000000;
    };
}

// Sparkle path — 4-point star (8-vertex polygon, thin inner radius)
function sparklePath(cx: number, cy: number, outer: number): string {
    const i = outer * STAR_INNER_RADIUS_RATIO;
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

// Constellation builder
function buildConstellation(rng: () => number): {
    nodes: { x: number; y: number }[];
    edges: [number, number][];
} {
    const nodeCount =
        CONSTELLATION_NODE_COUNT_MIN + Math.floor(rng() * CONSTELLATION_NODE_COUNT_RANGE);

    const nodes: { x: number; y: number }[] = Array.from(
        { length: nodeCount },
        () => ({
            x: EDGE_PADDING + rng() * (VIEWBOX_WIDTH  - EDGE_PADDING * 2),
            y: EDGE_PADDING + rng() * (VIEWBOX_HEIGHT - EDGE_PADDING * 2),
        }),
    );

    const edges: [number, number][] = [];

    for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
            const dx   = nodes[a].x - nodes[b].x;
            const dy   = nodes[a].y - nodes[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (
                dist >= CONSTELLATION_EDGE_MIN_DIST &&
                dist <= CONSTELLATION_EDGE_MAX_DIST &&
                rng() > CONSTELLATION_EDGE_SPAWN_THRESHOLD
            ) {
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
    // Twinkle animation
    twinkle: boolean;
    twinkleDur: number;
    twinkleDelay: number;
    twinkleLo: number;
    twinkleHi: number;
    // Size-breathe + rotation animation
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

        // Background stars
        const bg: Star[] = Array.from({ length: BG_STAR_COUNT }, () => {
            const roll = rng();
            const size =
                roll < BG_STAR_LARGE_TIER  ? BG_STAR_LARGE_SIZE_MIN  + rng() * BG_STAR_LARGE_SIZE_RANGE
                : roll < BG_STAR_MEDIUM_TIER ? BG_STAR_MEDIUM_SIZE_MIN + rng() * BG_STAR_MEDIUM_SIZE_RANGE
                :                              BG_STAR_TINY_SIZE_MIN   + rng() * BG_STAR_TINY_SIZE_RANGE;

            const opacity =
                rng() < BG_STAR_DIM_TIER
                    ? BG_STAR_DIM_OPACITY_MIN    + rng() * BG_STAR_DIM_OPACITY_RANGE
                    : BG_STAR_BRIGHT_OPACITY_MIN + rng() * BG_STAR_BRIGHT_OPACITY_RANGE;

            const twinkle      = rng() < BG_TWINKLE_PROBABILITY;
            const twinkleDur   = BG_TWINKLE_DUR_MIN + rng() * BG_TWINKLE_DUR_RANGE;
            const twinkleDelay = rng() * BG_TWINKLE_DELAY_RANGE;
            const twinkleLo    = Math.max(BG_TWINKLE_LO_FLOOR, opacity * 0.3 + rng() * 0.1);
            const twinkleHi    = Math.min(1.0, opacity + rng() * BG_TWINKLE_HI_BONUS);

            const pulse      = twinkle && rng() < BG_PULSE_PROBABILITY;
            const pulseDur   = BG_PULSE_DUR_MIN + rng() * BG_PULSE_DUR_RANGE;
            const pulseDelay = rng() * BG_PULSE_DELAY_RANGE;

            return {
                x: rng() * VIEWBOX_WIDTH,
                y: rng() * VIEWBOX_HEIGHT,
                size,
                opacity,
                twinkle, twinkleDur, twinkleDelay, twinkleLo, twinkleHi,
                pulse, pulseDur, pulseDelay,
            };
        });

        // Constellation node stars
        const cn: Star[] = nodes.map(({ x, y }) => {
            const opacity = NODE_STAR_OPACITY_MIN + rng() * NODE_STAR_OPACITY_RANGE;

            const twinkle      = rng() < NODE_TWINKLE_PROBABILITY;
            const twinkleDur   = NODE_TWINKLE_DUR_MIN + rng() * NODE_TWINKLE_DUR_RANGE;
            const twinkleDelay = rng() * NODE_TWINKLE_DELAY_RANGE;
            const twinkleLo    = Math.max(NODE_TWINKLE_LO_FLOOR, opacity * 0.5);
            const twinkleHi    = Math.min(1.0, opacity + NODE_TWINKLE_HI_BONUS);

            const pulse      = twinkle && rng() < NODE_PULSE_PROBABILITY;
            const pulseDur   = NODE_PULSE_DUR_MIN + rng() * NODE_PULSE_DUR_RANGE;
            const pulseDelay = rng() * NODE_PULSE_DELAY_RANGE;

            return {
                x, y,
                size: NODE_STAR_SIZE_MIN + rng() * NODE_STAR_SIZE_RANGE,
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
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
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
                    stroke={CONSTELLATION_EDGE_COLOR}
                    strokeWidth={CONSTELLATION_EDGE_WIDTH}
                    strokeOpacity={CONSTELLATION_EDGE_OPACITY}
                />
            ))}

            {/* Stars */}
            {stars.map((s, idx) => {
                // No animation — bare path for performance
                if (!s.twinkle && !s.pulse) {
                    return (
                        <path
                            key={idx}
                            d={sparklePath(s.x, s.y, s.size)}
                            fill={STAR_FILL_COLOR}
                            opacity={s.opacity}
                        />
                    );
                }

                // Animated stars are drawn at local (0, 0) inside a translated <g>
                // so that scale and rotate transforms pivot from the star's own centre.
                return (
                    <g key={idx} transform={`translate(${s.x}, ${s.y})`}>
                        <path
                            d={sparklePath(0, 0, s.size)}
                            fill={STAR_FILL_COLOR}
                            opacity={s.opacity}
                        >
                            {/* Twinkle — smooth opacity oscillation */}
                            {s.twinkle && (
                                <animate
                                    attributeName="opacity"
                                    values={`${s.twinkleLo};${s.twinkleHi};${s.twinkleLo}`}
                                    dur={`${s.twinkleDur}s`}
                                    begin={`${s.twinkleDelay}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines={`${EASE_IN_OUT_SPLINE}; ${EASE_IN_OUT_SPLINE}`}
                                    keyTimes="0;0.5;1"
                                />
                            )}

                            {/* Size breathe — gentle scale pulse pivoting from star centre */}
                            {s.pulse && (
                                <animateTransform
                                    attributeName="transform"
                                    type="scale"
                                    additive="sum"
                                    values={`1;${PULSE_SCALE_PEAK};1`}
                                    dur={`${s.pulseDur}s`}
                                    begin={`${s.pulseDelay}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines={`${EASE_IN_OUT_SPLINE}; ${EASE_IN_OUT_SPLINE}`}
                                    keyTimes="0;0.5;1"
                                />
                            )}

                            {/* Gentle rotation — slightly slower than scale so they drift apart */}
                            {s.pulse && (
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    additive="sum"
                                    values={`-${PULSE_ROTATION_DEGREES};${PULSE_ROTATION_DEGREES};-${PULSE_ROTATION_DEGREES}`}
                                    dur={`${s.pulseDur * PULSE_ROTATION_DUR_MULTIPLIER}s`}
                                    begin={`${s.pulseDelay}s`}
                                    repeatCount="indefinite"
                                    calcMode="spline"
                                    keySplines={`${EASE_IN_OUT_SPLINE}; ${EASE_IN_OUT_SPLINE}`}
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