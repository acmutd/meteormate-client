"use client";
import { useMemo } from "react";

interface StarsBackgroundProps {
    count?: number;
    color?: string;
    opacity?: number;
    className?: string;
    fixed?: boolean;
    background?: boolean;
    /** Max rotation in either direction, in degrees (e.g. 20 = -20deg..+20deg). */
    maxRotation?: number;
}

// Deterministic PRNG so server-rendered markup matches the client
// (avoids Next.js hydration mismatches from Math.random()).
function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const STAR_PATH = "M50 0 Q55 45 100 50 Q55 55 50 100 Q45 55 0 50 Q45 45 50 0 Z";

export default function StarsBackground({
    count = 60,
    color = "#FF9100",
    opacity = 0.4,
    className = "",
    fixed = true,
    background = true,
    maxRotation = 20,
}: StarsBackgroundProps) {
    const stars = useMemo(() => {
        const rand = mulberry32(42);

        // Jittered-grid placement: divide the area into a grid with ~`count`
        // cells and place one star per cell (with some randomly skipped) so
        // stars stay spread out instead of clumping via pure uniform random.
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const cellW = 100 / cols;
        const cellH = 100 / rows;
        const skipChance = 0.15; // drop a few cells so the grid isn't too rigid
        const jitter = 0.35; // fraction of cell size the star can drift within it

        const stars: {
            top: number;
            left: number;
            size: number;
            opacity: number;
            rotate: number;
            delay: number;
            glow: number;
        }[] = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (stars.length >= count) break;
                if (rand() < skipChance) continue;

                const cx = (col + 0.5) * cellW;
                const cy = (row + 0.5) * cellH;
                const size = 6 + rand() ** 2 * 34; // bias toward small stars

                stars.push({
                    top: cy + (rand() * 2 - 1) * cellH * jitter,
                    left: cx + (rand() * 2 - 1) * cellW * jitter,
                    size,
                    opacity: opacity * (0.9 + rand() * 0.1),
                    rotate: (rand() * 2 - 1) * maxRotation, // -maxRotation..+maxRotation
                    delay: rand() * 4,
                    glow: size * 0.45, // bigger stars => bigger glow radius
                });
            }
        }

        return stars;
    }, [count, maxRotation, opacity]);

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none ${fixed ? "fixed inset-0 -z-10" : "absolute inset-0 z-0"} overflow-hidden ${background ? "bg-black" : ""} ${className}`}
        >
            {stars.map((s, i) => (
                <svg
                    key={i}
                    className="star-sparkle"
                    viewBox="0 0 100 100"
                    width={s.size}
                    height={s.size}
                    style={
                        {
                            position: "absolute",
                            top: `${s.top}%`,
                            left: `${s.left}%`,
                            transform: `rotate(${s.rotate}deg)`,
                            animationDelay: `${s.delay}s`,
                            opacity: s.opacity, // applied directly, not just via CSS var
                            "--star-opacity": s.opacity,
                            filter: `drop-shadow(0 0 ${s.glow}px ${color})`,
                        } as React.CSSProperties
                    }
                >
                    <path d={STAR_PATH} fill={color} />
                </svg>
            ))}
        </div>
    );
}