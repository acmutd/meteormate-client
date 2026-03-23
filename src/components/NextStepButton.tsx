import React from "react";

// Define the props for our button component
interface NextStepButtonProps {
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}

const NextStepButton: React.FC<NextStepButtonProps> = ({
	onClick,
	className,
	disabled,
}) => {
	return (
		<button
			onClick={!disabled ? onClick : undefined}
      		disabled={disabled}
			// Ensure the button is relative for absolute positioning of the logo
			className={`
				relative flex items-center justify-center
				py-3 px-6 rounded-full text-white font-semibold text-lg
				h-12 w-100
				shadow-lg
				cursor-pointer
				transition-all duration-200 ease-in-out
        		overflow-visible
					${
					disabled
						? "bg-gray-300 text-gray-500 cursor-not-allowed"
						: "bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white cursor-pointer"
					}
					${className || ""}
				`}
			>
			<h1 className="transform -right-4 relative z-20">Next Step</h1>

			<span className="ml-4 flex items-center justify-center relative z-20 left-30">
				&gt;
			</span>
		</button>
	);
};

export default NextStepButton;
