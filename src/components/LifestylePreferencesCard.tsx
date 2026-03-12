import React from "react";
import Image from "next/image";

interface LifestylePreferencesCardProps {
	// define props
	title?: string;
	imageSrc?: string;
	isSelected?: boolean;
	onClick?: () => void;
}

const LifestylePreferencesCard = ({
	title,
	imageSrc,
	isSelected,
	onClick,
}: LifestylePreferencesCardProps) => {
	if (!imageSrc) return null;
	return (
		<div
			className={`rounded-xl px-14 py-4 w-full flex flex-col items-center drop-shadow-xl border-1 border-[#C4C7CA]  hover:scale-105 hover:bg-gray-100 ${
				isSelected ? "ring-2 ring-primary bg-white" : "bg-white"
			}`}
			onClick={onClick}
		>
			{/* The circular image */}
			<div className="rounded-full bg-gradient-to-r from-primary to-secondary p-1">
			<Image
				src={imageSrc}
				width={1000} height={1000}
				className="h-12 w-12 object-contain p-2"
			 alt={""}/>
			</div>
			<p className="text-lg text-gray-800 text-center">{title}</p>
			
		</div>
	);
};

export default LifestylePreferencesCard;
