import { LucideIcon } from 'lucide-react';
import React, { forwardRef } from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    icon?: LucideIcon;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({
        label,
        name,
        type = 'text',
        placeholder,
        icon: Icon,
        error,
        required = false,
        disabled = false,
        autoComplete,
        className = '',
        children,
        ...props
    }, ref) => {
        return (
            <div className={className}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-error-500 ml-1">*</span>}
                </label>
                <div className="mt-1 relative">
                    {Icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                    )}
                    {children || (
                        <input
                            ref={ref}
                            id={name}
                            name={name}
                            type={type}
                            autoComplete={autoComplete}
                            disabled={disabled}
                            placeholder={placeholder}
                            className={`
                input
                ${Icon ? 'pl-10' : ''}
                ${error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''}
                ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
              `}
                            aria-describedby={error ? `${name}-error` : undefined}
                            aria-invalid={error ? 'true' : 'false'}
                            {...props}
                        />
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-sm text-error-600" id={`${name}-error`}>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = 'FormField';

export default FormField;
