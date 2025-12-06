import React from "react";

// Define the props for our button component
interface NextStepButtonProps {
	onClick?: () => void;
	logo?: React.ReactNode;
	className?: string;
}

const NextStepButton: React.FC<NextStepButtonProps> = ({
	onClick,
	logo,
	className,
}) => {
	return (
		<button
			onClick={onClick}
			// Ensure the button is relative for absolute positioning of the logo
			className={`
        relative flex items-center justify-center
        py-3 px-6 rounded-full text-white font-semibold text-lg
		h-12 w-100
        shadow-lg
        bg-gradient-to-r from-[#FF9100] to-[#FFC94C]
        hover:from-[#E68200] hover:to-[#E3B03C]
        transition-all duration-200 ease-in-out
        overflow-visible
        ${className || ""}
      `}
		>
			<h1 className="transform -right-4 relative z-20">Next Step</h1>

			<span className="ml-4 flex items-center justify-center relative z-20 left-30">
				&gt;
			</span>

			{logo && (
				<span
					className={`absolute overflow-visible h-15 w-15 right-10 -top-3 z-30 transform -translate-x-1/2 flex items-center justify-center`}
				>
					{logo}
				</span>
			)}
		</button>
	);
};

export default NextStepButton;
