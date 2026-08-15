export const VALIDATION_RULES = {
    UTD_EMAIL: {
        pattern: /^[a-zA-Z0-9._%+-]+@utdallas\.edu$/,
        message: 'Email must end with @utdallas.edu',
    },
    PASSWORD: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumber: true,
        requireSpecial: true,
    },
} as const;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  checks: {
    minLength: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

/**
 * Validates if an email ends with @utdallas.edu
 * @param email - The email address to validate
 * @returns true if valid, false otherwise
 */
export function validateUTDEmail(email: string): boolean {
    return VALIDATION_RULES.UTD_EMAIL.pattern.test(email);
}

/**
 * Validates a password against all requirements
 * @param password - The password to validate
 * @returns PasswordValidationResult with validation status and checks
 */
export function validatePassword(password: string): PasswordValidationResult {
    const checks = {
        minLength: password.length >= VALIDATION_RULES.PASSWORD.minLength,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[$*.[\]{}()?"!@#%&/\\,<>':;|_~]/.test(password),
    };
  
    const errors: string[] = [];
    if (!checks.minLength) {
        errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD.minLength} characters`);
    }
    if (!checks.lowercase) {
        errors.push('Password must include a lowercase letter');
    }
    if (!checks.uppercase) {
        errors.push('Password must include an uppercase letter');
    }
    if (!checks.number) {
        errors.push('Password must include a number');
    }
    if (!checks.special) {
        errors.push('Password must include a special character');
    }
  
    return {
        isValid: Object.values(checks).every(check => check === true),
        errors,
        checks,
    };
}

/**
 * Validates if two passwords match
 * @param password - The original password
 * @param confirmPassword - The password to confirm
 * @returns Error message if passwords don't match, empty string if they match
 */
export function validatePasswordMatch(
    password: string,
    confirmPassword: string
): string {
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return '';
}

/**
 * Gets a user-friendly email validation error message
 * @param email - The email to validate
 * @returns Error message if invalid, empty string if valid
 */
export function getEmailValidationError(email: string): string {
    if (!email) {
        return 'Email is required';
    }
    if (!validateUTDEmail(email)) {
        return VALIDATION_RULES.UTD_EMAIL.message;
    }
    return '';
}

