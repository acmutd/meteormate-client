import { OTP_LENGTH } from "../constants/otp";

export function handleOTPCodePaste(
    pastedText: string,
    index: number,
    code: string[],
    setCode: (code: string[]) => void,
    inputs: (HTMLInputElement | null)[],
    onSuccess?: () => void
) {
    // OTP_LENGTH digits
    const digits = pastedText.replace(/\D/g, "").slice(0, OTP_LENGTH);
    
    if (digits.length > 0) {
        const newCode = [...code];
        // If pasted text has OTP_LENGTH digits, assume user is pasting whole code, otherwise fill from active input field
        const startIndex = digits.length === OTP_LENGTH ? 0 : index;
        
        for (let i = 0; i < digits.length; i++) {
            const targetIndex = startIndex + i;
            if (targetIndex < OTP_LENGTH) {
                newCode[targetIndex] = digits[i];
            }
        }
        
        setCode(newCode);
        if (onSuccess) {
            onSuccess();
        }
        
        const lastFilledIndex = Math.min(startIndex + digits.length - 1, OTP_LENGTH - 1);
        const nextEmptyIndex = startIndex + digits.length;
        const targetFocusIndex = nextEmptyIndex < OTP_LENGTH ? nextEmptyIndex : lastFilledIndex;
        
        inputs[targetFocusIndex]?.focus();
    }
}
