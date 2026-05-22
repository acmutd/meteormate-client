export function handleOTPCodePaste(
    pastedText: string,
    index: number,
    code: string[],
    setCode: (code: string[]) => void,
    inputs: (HTMLInputElement | null)[],
    onSuccess?: () => void
) {
    // 6 digits
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);
    
    if (digits.length > 0) {
        const newCode = [...code];
        // If pasted text has 6 digits, assume user is pasting whole code, otherwise fill from active input field
        const startIndex = digits.length === 6 ? 0 : index;
        
        for (let i = 0; i < digits.length; i++) {
            const targetIndex = startIndex + i;
            if (targetIndex < 6) {
                newCode[targetIndex] = digits[i];
            }
        }
        
        setCode(newCode);
        if (onSuccess) {
            onSuccess();
        }
        
        const lastFilledIndex = Math.min(startIndex + digits.length - 1, 5);
        const nextEmptyIndex = startIndex + digits.length;
        const targetFocusIndex = nextEmptyIndex < 6 ? nextEmptyIndex : lastFilledIndex;
        
        inputs[targetFocusIndex]?.focus();
    }
}
