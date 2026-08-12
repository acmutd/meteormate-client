interface SkeletonProps {
	className?: string;
	variant?: "text" | "circular" | "rectangular";
	width?: string;
	height?: string;
}

export default function Skeleton({
    className = "",
    variant = "rectangular",
    width,
    height,
}: SkeletonProps) {
    const variantClasses = {
        text: "h-4 rounded",
        circular: "rounded-full",
        rectangular: "rounded",
    };

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return (
        <div
            className={`bg-gray-200 animate-pulse ${variantClasses[variant]} ${className}`}
            style={style}
            aria-label="Loading content"
        />
    );
}

