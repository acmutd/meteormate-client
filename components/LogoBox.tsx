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
		<div className={`relative w-full max-w-md mx-auto ${className}`}>
			{/* Logo peeking out the top */}
			{logoSrc && (
				<div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
					<Image
						src={logoSrc}
						alt={logoAlt}
						width={160}
						height={160}
						className="w-40 h-40"
						style={{
							filter: `
								drop-shadow(1px 1px 0 white) 
								drop-shadow(-1px 1px 0 white)
								drop-shadow(1px -1px 0 white)
							`,
						}}
						priority
					/>
				</div>
			)}
			<div className="bg-white rounded-2xl shadow-xl px-16 pt-30 pb-15 -mx-20">
				{children}
			</div>
		</div>
	);
};

export default MeteorCard;
