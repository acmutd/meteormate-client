import React from "react";

// Define the props for our button component
interface NextStepButtonProps {
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

const DoneButton: React.FC<NextStepButtonProps> = ({
    onClick,
    className,
    disabled,
}) => {
    return (
        <button
            onClick={onClick}
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
						: "bg-gradient-to-r from-[#FF9100] to-[#FFC94C] hover:from-[#E68200] hover:to-[#E3B03C] text-white cursor-pointer"
					}
					${className || ""}
		`}
        >
            <h1 className="transform -right-4 relative z-20">All Done</h1>

            <span className="ml-4 flex items-center justify-center relative z-20 left-30">
                &gt;
            </span>
        </button>
    );
};

export default DoneButton;
