import { AlertCircle, ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ForgotPasswordRequest } from '../../../shared/src/types/auth';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword: React.FC = () => {
    const { forgotPassword, isLoading } = useAuth();
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<ForgotPasswordRequest>({
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordRequest) => {
        try {
            await forgotPassword(data);
            setIsSubmitted(true);
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Failed to send password reset email';
            setError('root', {
                type: 'manual',
                message,
            });
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-success-100">
                            <CheckCircle className="h-8 w-8 text-success-600" />
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Check your email
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                        </p>
                    </div>

                    <div className="bg-success-50 border border-success-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-success-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-success-800">
                                    If an account with that email exists, a password reset link has been sent.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="btn-secondary inline-flex items-center"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to login
                        </Link>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive the email?{' '}
                            <button
                                type="button"
                                onClick={() => setIsSubmitted(false)}
                                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
                        <svg
                            className="h-8 w-8 text-primary-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Global error message */}
                    {errors.root && (
                        <div className="rounded-md bg-error-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-error-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-error-800">{errors.root.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                                className={`input pl-10 ${errors.email ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                                    }`}
                                placeholder="Enter your email address"
                                aria-describedby={errors.email ? 'email-error' : undefined}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-error-600" id="email-error">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Sending reset link...
                                </>
                            ) : (
                                'Send reset link'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="btn-secondary inline-flex items-center"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to login
                        </Link>
                    </div>
                </form>

                {/* Help text */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 text-center">
                        <strong>Note:</strong> For security reasons, we don't reveal whether an email address is registered or not.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
