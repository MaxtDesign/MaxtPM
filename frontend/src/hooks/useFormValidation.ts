import { useMemo } from 'react';

export interface ValidationRules {
    required?: boolean | string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: any) => boolean | string;
}

export const useFormValidation = () => {
    const validationRules = useMemo(() => ({
        // Email validation
        email: {
            required: 'Email is required',
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
            },
        },

        // Password validation
        password: {
            required: 'Password is required',
            minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
            },
            pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            },
        },

        // Name validation
        firstName: {
            required: 'First name is required',
            maxLength: {
                value: 50,
                message: 'First name must be less than 50 characters',
            },
        },

        lastName: {
            required: 'Last name is required',
            maxLength: {
                value: 50,
                message: 'Last name must be less than 50 characters',
            },
        },

        // Company validation
        companyName: {
            required: 'Company name is required',
            maxLength: {
                value: 100,
                message: 'Company name must be less than 100 characters',
            },
        },

        // Address validation
        street: {
            required: 'Street address is required',
            maxLength: {
                value: 200,
                message: 'Street address must be less than 200 characters',
            },
        },

        city: {
            required: 'City is required',
            maxLength: {
                value: 100,
                message: 'City must be less than 100 characters',
            },
        },

        state: {
            required: 'State is required',
            maxLength: {
                value: 50,
                message: 'State must be less than 50 characters',
            },
        },

        zipCode: {
            required: 'Zip code is required',
            pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: 'Please enter a valid zip code',
            },
        },

        country: {
            required: 'Country is required',
            maxLength: {
                value: 100,
                message: 'Country must be less than 100 characters',
            },
        },

        // Phone validation
        phone: {
            pattern: {
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number',
            },
        },

        // Terms acceptance
        acceptTerms: {
            required: 'You must accept the terms and conditions',
        },
    }), []);

    // Password strength checker
    const checkPasswordStrength = (password: string) => {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        const score = Object.values(checks).filter(Boolean).length;

        return {
            score,
            checks,
            strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong',
            isValid: score >= 3,
        };
    };

    // Password confirmation validator
    const validatePasswordConfirmation = (password: string, confirmPassword: string) => {
        return password === confirmPassword || "Passwords don't match";
    };

    // Email format validator
    const validateEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email) || 'Please enter a valid email address';
    };

    // Required field validator
    const validateRequired = (value: any, fieldName: string) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            return `${fieldName} is required`;
        }
        return true;
    };

    // Length validator
    const validateLength = (value: string, min?: number, max?: number, fieldName?: string) => {
        if (min && value.length < min) {
            return `${fieldName || 'Field'} must be at least ${min} characters`;
        }
        if (max && value.length > max) {
            return `${fieldName || 'Field'} must be less than ${max} characters`;
        }
        return true;
    };

    return {
        validationRules,
        checkPasswordStrength,
        validatePasswordConfirmation,
        validateEmail,
        validateRequired,
        validateLength,
    };
};

export default useFormValidation;
