import React from "react";

type LandingSectionProps = {
	id: string;
	className?: string;
	style?: React.CSSProperties;
	children: React.ReactNode;
};

/**
 * Consistent landing-page section wrapper:
 * - Standard vertical rhythm between sections
 * - Standard scroll offset for fixed navbar
 */
export default function LandingSection({
	id,
	className = "",
	style,
	children,
}: LandingSectionProps) {
	return (
		<section
			id={id}
			className={`w-full scroll-mt-24 md:scroll-mt-28 py-20 md:py-24 ${className}`}
			style={style}
		>
			{children}
		</section>
	);
}


