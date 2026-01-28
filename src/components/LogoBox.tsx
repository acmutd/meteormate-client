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
	if (!logoSrc) return null;
	return (
		<div className={`relative w-full max-w-xl mx-auto ${className}`}>
			{/* Logo peeking out the top */}
			<div className="absolute [top:clamp(-2.5rem,-5vh,-3.5rem)] left-1/2 transform -translate-x-1/2 z-10">
				<Image
					src={logoSrc}
					alt={logoAlt}
					width={1000}
					height={1000}
					className="size-[clamp(4rem,15vh,6rem)]"
					style={{
						filter: `
              drop-shadow(1px 1px 0 white) 
              drop-shadow(-1px 1px 0 white)
              drop-shadow(1px -1px 0 white)
            `,
					}}
				/>
			</div>
			<div className="bg-white rounded-2xl shadow-xl px-8 md:px-12 pt-[clamp(2rem,8vh,4rem)] pb-10 w-full">
				{children}
			</div>
		</div>
	);
};

export default MeteorCard;