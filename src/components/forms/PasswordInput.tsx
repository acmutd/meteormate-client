import React, {useState} from "react";

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    showToggle?: boolean;
    autoComplete?: string;
    inputRef?: React.Ref<HTMLInputElement>;
}

export default function PasswordInput({
                                          value,
                                          onChange,
                                          onBlur,
                                          placeholder = "Password",
                                          label,
                                          error,
                                          disabled = false,
                                          className = "",
                                          showToggle = false,
                                          autoComplete = "current-password",
                                          inputRef,
                                      }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label className="block text-sm font-urbanist font-light text-zinc-400 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {/* Lock Icon */}
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
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                    />
                </svg>

                {/* Input Field */}
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    ref={inputRef}
                    className={[
                        "pl-11 pr-10 py-3 rounded-3xl w-full",
                        "font-light text-[14px] md:text-[15px] text-left",
                        "border border-zinc-700",
                        "text-black placeholder:text-zinc-600",
                        "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200",
                    ].join(" ")}
                />

                {/* Toggle Visibility Button */}
                {showToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-primary-hover transition-colors"
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && <p className="text-red-400 text-xs mt-1 ml-2">{error}</p>}
        </div>
    );
}
