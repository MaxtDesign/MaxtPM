import { Eye, EyeOff, Lock } from 'lucide-react';
import { forwardRef, useState } from 'react';
import FormField from './FormField';

interface PasswordFieldProps {
    label: string;
    name: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    className?: string;
    showStrengthIndicator?: boolean;
    password?: string;
    [key: string]: any;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({
        label,
        name,
        placeholder = 'Enter your password',
        error,
        required = false,
        disabled = false,
        autoComplete = 'current-password',
        className = '',
        showStrengthIndicator = false,
        password = '',
        ...props
    }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const getPasswordStrength = (password: string) => {
            if (!password) return { score: 0, strength: 'none' };

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
                strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong',
                color: score < 3 ? 'text-error-600' : score < 4 ? 'text-warning-600' : 'text-success-600',
                bgColor: score < 3 ? 'bg-error-100' : score < 4 ? 'bg-warning-100' : 'bg-success-100',
            };
        };

        const strength = getPasswordStrength(password);

        return (
            <div className={className}>
                <FormField
                    ref={ref}
                    label={label}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    icon={Lock}
                    error={error}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    {...props}
                >
                    <div className="relative">
                        <input
                            ref={ref}
                            id={name}
                            name={name}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={autoComplete}
                            disabled={disabled}
                            placeholder={placeholder}
                            className={`
                input
                pl-10 pr-10
                ${error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''}
                ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
              `}
                            aria-describedby={error ? `${name}-error` : undefined}
                            aria-invalid={error ? 'true' : 'false'}
                            {...props}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                </FormField>

                {/* Password strength indicator */}
                {showStrengthIndicator && password && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Password strength:</span>
                            <span className={`font-medium ${strength.color}`}>
                                {strength.strength.charAt(0).toUpperCase() + strength.strength.slice(1)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full transition-all duration-300 ${strength.bgColor.replace('bg-', 'bg-').replace('-100', '-500')
                                    }`}
                                style={{ width: `${(strength.score / 5) * 100}%` }}
                            />
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            <ul className="space-y-1">
                                <li className={`flex items-center ${password.length >= 8 ? 'text-success-600' : ''}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${password.length >= 8 ? 'bg-success-500' : 'bg-gray-300'}`} />
                                    At least 8 characters
                                </li>
                                <li className={`flex items-center ${/[a-z]/.test(password) ? 'text-success-600' : ''}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`} />
                                    One lowercase letter
                                </li>
                                <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-success-600' : ''}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`} />
                                    One uppercase letter
                                </li>
                                <li className={`flex items-center ${/\d/.test(password) ? 'text-success-600' : ''}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${/\d/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`} />
                                    One number
                                </li>
                                <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-success-600' : ''}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-success-500' : 'bg-gray-300'}`} />
                                    One special character
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
