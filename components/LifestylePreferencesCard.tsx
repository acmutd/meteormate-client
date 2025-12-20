import React from "react";

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
	return (
		<div
			className={`rounded-xl px-14 py-4 w-full flex flex-col items-center drop-shadow-xl border-1 border-[#C4C7CA]  hover:scale-105 hover:bg-gray-100 ${
				isSelected ? "ring-2 ring-[#FF9100]" : "bg-white"
			}`}
			onClick={onClick}
		>
			{/* The circular image */}
			<div className="rounded-full bg-linear-to-r from-[#FF9100] to-[#FFC94C] p-1">
			<img
				src={imageSrc}
				className="h-12 w-12 object-cover p-2"
			/>
			</div>
			<p className="text-lg text-gray-800 text-center">{title}</p>
			
		</div>
	);
};

export default LifestylePreferencesCard;
