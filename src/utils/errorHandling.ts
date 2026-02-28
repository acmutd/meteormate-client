/**
 * Extracts a readable error message from various error types
 * @param error - The error object (could be Error, unknown, etc.)
 * @param fallback - Fallback message if error cannot be extracted
 * @returns A readable error message string
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
}
