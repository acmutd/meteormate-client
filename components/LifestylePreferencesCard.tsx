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
			className={`rounded-xl px-16 py-4 w-full max-w-xs flex flex-col items-center drop-shadow-xl border-[#C4C7CA] border-1 hover:scale-105 hover:bg-gray-100 ${
				isSelected ? "ring-2 ring-[#FF9100]" : "bg-white"
			}`}
			onClick={onClick}
		>
			{/* The circular image */}
			<img
				src={imageSrc}
				className="h-12 w-12 rounded-full object-cover bg-gradient-to-r from-[#FF9100] to-[#FFC94C] p-2"
			/>

			<p className="text-lg font-semibold text-gray-800 text-center">{title}</p>
		</div>
	);
};

export default LifestylePreferencesCard;
