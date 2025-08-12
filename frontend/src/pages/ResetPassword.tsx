import { AlertCircle, CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ResetPasswordRequest } from '../../../shared/src/types/auth';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { resetPassword, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            navigate('/forgot-password', { replace: true });
            return;
        }
        setToken(tokenFromUrl);
    }, [searchParams, navigate]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setError,
    } = useForm<ResetPasswordRequest>({
        defaultValues: {
            token: '',
            password: '',
            confirmPassword: '',
        },
    });

    const watchedPassword = watch('password');

    const onSubmit = async (data: ResetPasswordRequest) => {
        try {
            await resetPassword({
                token: token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            setIsSuccess(true);
        } catch (error: any) {
            if (error.response?.data?.error?.code === 'INVALID_RESET_TOKEN') {
                setError('root', {
                    type: 'manual',
                    message: 'Invalid or expired reset token. Please request a new password reset.',
                });
            } else if (error.response?.data?.error?.code === 'WEAK_PASSWORD') {
                setError('password', {
                    type: 'manual',
                    message: 'Password does not meet security requirements.',
                });
            } else {
                setError('root', {
                    type: 'manual',
                    message: 'Failed to reset password. Please try again.',
                });
            }
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-success-100">
                            <CheckCircle className="h-8 w-8 text-success-600" />
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Password reset successfully!
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Your password has been reset. You can now log in with your new password.
                        </p>
                    </div>

                    <div className="bg-success-50 border border-success-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-success-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-success-800">
                                    Your password has been updated successfully. Please log in with your new password.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="btn-primary inline-flex items-center"
                        >
                            Continue to login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-error-100">
                            <AlertCircle className="h-8 w-8 text-error-600" />
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Invalid reset link
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            The password reset link is invalid or has expired. Please request a new one.
                        </p>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/forgot-password"
                            className="btn-primary inline-flex items-center"
                        >
                            Request new reset link
                        </Link>
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
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below.
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

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters',
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                                        },
                                    })}
                                    className={`input pl-10 pr-10 ${errors.password ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                                        }`}
                                    placeholder="Enter your new password"
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                />
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
                            {errors.password && (
                                <p className="mt-1 text-sm text-error-600" id="password-error">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value) => value === watchedPassword || "Passwords don't match",
                                    })}
                                    className={`input pl-10 pr-10 ${errors.confirmPassword ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                                        }`}
                                    placeholder="Confirm your new password"
                                    aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-error-600" id="confirm-password-error">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Password requirements */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className={`flex items-center ${watchedPassword?.length >= 8 ? 'text-success-600' : ''}`}>
                                {watchedPassword?.length >= 8 ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-gray-300" />
                                )}
                                At least 8 characters
                            </li>
                            <li className={`flex items-center ${/^(?=.*[a-z])/.test(watchedPassword || '') ? 'text-success-600' : ''}`}>
                                {/^(?=.*[a-z])/.test(watchedPassword || '') ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-gray-300" />
                                )}
                                One lowercase letter
                            </li>
                            <li className={`flex items-center ${/^(?=.*[A-Z])/.test(watchedPassword || '') ? 'text-success-600' : ''}`}>
                                {/^(?=.*[A-Z])/.test(watchedPassword || '') ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-gray-300" />
                                )}
                                One uppercase letter
                            </li>
                            <li className={`flex items-center ${/\d/.test(watchedPassword || '') ? 'text-success-600' : ''}`}>
                                {/\d/.test(watchedPassword || '') ? (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                ) : (
                                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-gray-300" />
                                )}
                                One number
                            </li>
                        </ul>
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
                                    Resetting password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-primary-600 hover:text-primary-500 transition-colors duration-200"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
