import React, {useEffect, useRef} from "react";
import {OTP_LENGTH} from "@/constants/otp";

interface OtpCodeInputProps {
    value: string[];
    onChange: (code: string[]) => void;
    disabled?: boolean;
    ariaLabelPrefix?: string;
    inputClassName?: string;
}

export default function OtpCodeInput({
    value,
    onChange,
    disabled = false,
    ariaLabelPrefix = "Verification code",
    inputClassName = "w-12 h-12",
}: OtpCodeInputProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => inputsRef.current[0]?.focus(), 0);
        return () => clearTimeout(timeout);
    }, []);

    const updateCode = (index: number, digit: string) => {
        const nextCode = [...value];
        nextCode[index] = digit;
        onChange(nextCode);
    };

    const handleChange = (input: string, index: number) => {
        if (/^\d$/.test(input)) {
            updateCode(index, input);

            if (index < OTP_LENGTH - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        } else if (input === "") {
            updateCode(index, "");
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "Backspace") {
            if (value[index]) {
                updateCode(index, "");
            } else if (index > 0) {
                updateCode(index - 1, "");
                inputsRef.current[index - 1]?.focus();
            }
        } else if (event.key === "Delete") {
            updateCode(index, "");
        } else if (event.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        event.preventDefault();

        const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!digits) return;

        const nextCode = [...value];
        const startIndex = digits.length === OTP_LENGTH ? 0 : index;

        for (let offset = 0; offset < digits.length; offset++) {
            const targetIndex = startIndex + offset;
            if (targetIndex < OTP_LENGTH) {
                nextCode[targetIndex] = digits[offset];
            }
        }

        onChange(nextCode);

        const nextEmptyIndex = startIndex + digits.length;
        const focusIndex = Math.min(nextEmptyIndex, OTP_LENGTH - 1);
        inputsRef.current[focusIndex]?.focus();
    };

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {value.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleChange(event.target.value, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    onPaste={(event) => handlePaste(event, index)}
                    ref={(element: HTMLInputElement | null) => {
                        inputsRef.current[index] = element;
                    }}
                    disabled={disabled}
                    aria-label={`${ariaLabelPrefix} digit ${index + 1}`}
                    className={[
                        inputClassName,
                        "text-center text-xl rounded-lg",
                        "bg-white/5 text-black placeholder:text-zinc-400",
                        "border border-zinc-300",
                        "outline-none",
                        "focus:border-primary focus:ring-2 focus:ring-primary/30",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200",
                    ].join(" ")}
                />
            ))}
        </div>
    );
}
