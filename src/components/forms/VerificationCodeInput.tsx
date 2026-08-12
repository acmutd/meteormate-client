"use client";
import React, { useRef, useState } from "react";

interface VerificationCodeInputProps {
	length?: number;
	onComplete?: (code: string) => void;
	disabled?: boolean;
	className?: string;
}

export default function VerificationCodeInput({
    length = 6,
    onComplete,
    disabled = false,
    className = "",
}: VerificationCodeInputProps) {
    const [code, setCode] = useState(Array(length).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        if (/^\d$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (index < length - 1 && inputsRef.current[index + 1]) {
                inputsRef.current[index + 1]?.focus();
            }

            // Check if all fields are filled
            if (newCode.every((digit) => digit !== "") && onComplete) {
                onComplete(newCode.join(""));
            }
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace") {
            const newCode = [...code];
            if (code[index]) {
                newCode[index] = "";
                setCode(newCode);
            } else if (index > 0) {
                newCode[index - 1] = "";
                setCode(newCode);
                inputsRef.current[index - 1]?.focus();
            }
        } else if (e.key === "Delete") {
            const newCode = [...code];
            newCode[index] = "";
            setCode(newCode);
        }
    };

    return (
        <div className={`flex space-x-3 justify-center ${className}`}>
            {code.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el: HTMLInputElement | null) => {
                        inputsRef.current[index] = el;
                    }}
                    disabled={disabled}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            ))}
        </div>
    );
}

