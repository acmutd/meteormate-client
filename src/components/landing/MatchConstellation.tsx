"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type Point = { x: number; y: number };
type Star = Point & { size: number };
type Scene = { cards: Point[]; width: number; height: number };

const STAR_PATH = "M50 0 Q55 45 100 50 Q55 55 50 100 Q45 55 0 50 Q45 45 50 0 Z";

// Fixed, irregular positions keep the constellation consistent across renders.
// These share the desktop cards' 1440:4000 canvas.
const DESKTOP_STARS = [
    { x: 0.45, y: 0.018, size: 20 },
    { x: 0.67, y: 0.025, size: 14 },
    { x: 0.94, y: 0.039, size: 32 },
    { x: 0.96, y: 0.088, size: 18 },
    { x: 0.87, y: 0.133, size: 42 },
    { x: 0.53, y: 0.148, size: 28 },
    { x: 0.45, y: 0.105, size: 16 },
];

export default function MatchConstellation({
    cardsRef,
    layout,
}: {
    cardsRef: RefObject<HTMLUListElement | null>;
    layout: "desktop" | "stacked";
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [scene, setScene] = useState<Scene | null>(null);

    useEffect(() => {
        const svg = svgRef.current;
        const list = cardsRef.current;
        if (!svg || !list) return;

        const update = () => {
            const bounds = svg.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;

            setScene({
                width: bounds.width,
                height: bounds.height,
                cards: Array.from(list.children, (card) => {
                    const rect = card.getBoundingClientRect();
                    return {
                        x: rect.left - bounds.left + rect.width / 2,
                        y: rect.top - bounds.top + rect.height / 2,
                    };
                }),
            });
        };

        // Measure the actual cards so fixed widths, transforms, and responsive
        // resizing never leave a connection floating away from its card.
        const observer = new ResizeObserver(update);
        observer.observe(svg);
        Array.from(list.children).forEach((card) => observer.observe(card));
        update();

        return () => observer.disconnect();
    }, [cardsRef, layout]);

    let stars: Star[] = [];
    let paths: Point[][] = [];

    if (scene && scene.cards.length === 3) {
        const [amelia, noah, sofia] = scene.cards;

        if (layout === "desktop") {
            stars = DESKTOP_STARS.map((star) => ({
                ...star,
                x: star.x * scene.width,
                y: star.y * scene.height,
            }));
            paths = [
                [sofia, stars[0], stars[1], amelia],
                [amelia, stars[2], stars[3], noah],
                [amelia, stars[4], stars[5], noah],
                [sofia, stars[6], noah],
            ];
        } else {
            stars = [
                { x: scene.width * 0.16, y: 12, size: 16 },
                { x: scene.width * 0.86, y: (amelia.y + noah.y) / 2, size: 24 },
                { x: scene.width * 0.14, y: (noah.y + sofia.y) / 2, size: 20 },
                { x: scene.width * 0.82, y: scene.height - 12, size: 16 },
            ];
            paths = [[stars[0], amelia, stars[1], noah, stars[2], sofia, stars[3]]];
        }
    }

    return (
        <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            aria-hidden="true"
            focusable="false"
            fill="none"
        >
            <g stroke="#FFAB24" strokeWidth="0.8" strokeOpacity="0.75" strokeLinejoin="round">
                {paths.map((points, index) => (
                    <polyline key={index} points={points.map(({ x, y }) => `${x},${y}`).join(" ")} />
                ))}
            </g>
            {stars.map(({ x, y, size }, index) => (
                <g key={index}>
                    <path
                        d={STAR_PATH}
                        transform={`translate(${x - size / 2} ${y - size / 2}) scale(${size / 100})`}
                        fill="#FFAB24"
                        opacity="0.85"
                        style={{ filter: "drop-shadow(0 0 8px rgb(255 145 0 / 35%))" }}
                    />
                    <circle cx={x} cy={y} r="1.2" fill="#FFE0A3" />
                </g>
            ))}
        </svg>
    );
}
