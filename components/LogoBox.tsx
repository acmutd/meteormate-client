"use client";
import React from "react";
import Image from "next/image";

interface MeteorCardProps {
	children: React.ReactNode;
	logoSrc?: string;
	logoAlt?: string;
	className?: string;
}

const MeteorCard: React.FC<MeteorCardProps> = ({
	children,
	logoSrc,
	logoAlt = "MeteorMate Logo",
	className = "",
}) => {
	return (
		<div className={`relative w-full max-w-xl mx-auto ${className}`}>
			{/* Logo peeking out the top */}
			<div className="absolute -top-17 left-1/2 transform -translate-x-1/2 z-10">
				<img
					src={logoSrc}
					alt={logoAlt}
					className="size-30"
					style={{
						filter: `
              drop-shadow(1px 1px 0 white) 
              drop-shadow(-1px 1px 0 white)
              drop-shadow(1px -1px 0 white)
            `,
					}}
				/>
			</div>
			<div className="bg-white rounded-2xl shadow-xl px-8 md:px-12 pt-[clamp(0rem,10vh,4rem)] pb-10 w-full">
				{children}
			</div>
		</div>
	);
};

export default MeteorCard;
