import React from "react";

interface EmailInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    inputRef?: React.Ref<HTMLInputElement>;
}

export default function EmailInput({
                                       value,
                                       onChange,
                                       onBlur,
                                       placeholder = "Email",
                                       label,
                                       error,
                                       disabled = false,
                                       className = "",
                                       inputRef,
                                   }: EmailInputProps) {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="block text-sm font-urbanist font-light text-zinc-400 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                </svg>
                <input
                    type="email"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    ref={inputRef}
                    autoComplete="email"
                    className={[
                        "pl-11 pr-4 py-3 rounded-3xl w-full",
                        "font-light text-[14px] md:text-[15px] text-left",
                        "border border-zinc-700",
                        "text-black placeholder:text-zinc-600",
                        "focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200",
                    ].join(" ")}
                />
            </div>
            {error && <p className="text-red-400 text-xs mt-1 ml-2">{error}</p>}
        </div>
    );
}
