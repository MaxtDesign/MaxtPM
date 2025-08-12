import { AlertCircle, Building, CheckCircle, Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { RegisterRequest } from '../../../shared/src/types/auth';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormData extends RegisterRequest {
  acceptTerms: boolean;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [includeCompany, setIncludeCompany] = useState(false);
  const { register: registerUser, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      companyAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      companyPhone: '',
      companyEmail: '',
      acceptTerms: false,
    },
  });

  const watchedPassword = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Prepare registration data
      const registrationData: RegisterRequest = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        confirmPassword: data.confirmPassword,
        ...(includeCompany && {
          companyName: data.companyName,
          companyAddress: data.companyAddress,
          companyPhone: data.companyPhone,
          companyEmail: data.companyEmail,
        }),
      };

      await registerUser(registrationData);
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.data?.error?.code === 'USER_ALREADY_EXISTS') {
        setError('email', {
          type: 'manual',
          message: 'An account with this email already exists.',
        });
      } else if (error.response?.data?.error?.code === 'WEAK_PASSWORD') {
        setError('password', {
          type: 'manual',
          message: 'Password does not meet security requirements.',
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Registration failed. Please try again.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your PropEase account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName', {
                        required: 'First name is required',
                        maxLength: {
                          value: 50,
                          message: 'First name must be less than 50 characters',
                        },
                      })}
                      className={`input pl-10 ${errors.firstName ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                        }`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-error-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName', {
                        required: 'Last name is required',
                        maxLength: {
                          value: 50,
                          message: 'Last name must be less than 50 characters',
                        },
                      })}
                      className={`input pl-10 ${errors.lastName ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                        }`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-error-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
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
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Password</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
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
                    placeholder="Create a strong password"
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
                  <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
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
                    placeholder="Confirm your password"
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
                  <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
                )}
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
            </div>
          </div>

          {/* Company Information */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Company Information (Optional)</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeCompany}
                    onChange={(e) => setIncludeCompany(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include company details</span>
                </label>
              </div>
            </div>
            {includeCompany && (
              <div className="card-body space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      {...register('companyName', {
                        required: includeCompany ? 'Company name is required' : false,
                      })}
                      className={`input pl-10 ${errors.companyName ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                        }`}
                      placeholder="Enter company name"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-error-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
                      Company Phone
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="companyPhone"
                        type="tel"
                        {...register('companyPhone')}
                        className="input pl-10"
                        placeholder="Enter company phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">
                      Company Email
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="companyEmail"
                        type="email"
                        {...register('companyEmail', {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address',
                          },
                        })}
                        className={`input pl-10 ${errors.companyEmail ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                          }`}
                        placeholder="Enter company email"
                      />
                    </div>
                    {errors.companyEmail && (
                      <p className="mt-1 text-sm text-error-600">{errors.companyEmail.message}</p>
                    )}
                  </div>
                </div>

                {/* Company Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <div className="space-y-4">
                    <div>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          {...register('companyAddress.street', {
                            required: includeCompany ? 'Street address is required' : false,
                          })}
                          className={`input pl-10 ${errors.companyAddress?.street ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                            }`}
                          placeholder="Street address"
                        />
                      </div>
                      {errors.companyAddress?.street && (
                        <p className="mt-1 text-sm text-error-600">{errors.companyAddress.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <input
                          type="text"
                          {...register('companyAddress.city', {
                            required: includeCompany ? 'City is required' : false,
                          })}
                          className={`input ${errors.companyAddress?.city ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                            }`}
                          placeholder="City"
                        />
                        {errors.companyAddress?.city && (
                          <p className="mt-1 text-sm text-error-600">{errors.companyAddress.city.message}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          {...register('companyAddress.state', {
                            required: includeCompany ? 'State is required' : false,
                          })}
                          className={`input ${errors.companyAddress?.state ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                            }`}
                          placeholder="State"
                        />
                        {errors.companyAddress?.state && (
                          <p className="mt-1 text-sm text-error-600">{errors.companyAddress.state.message}</p>
                        )}
                      </div>

                      <div>
                        <input
                          type="text"
                          {...register('companyAddress.zipCode', {
                            required: includeCompany ? 'Zip code is required' : false,
                          })}
                          className={`input ${errors.companyAddress?.zipCode ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                            }`}
                          placeholder="Zip code"
                        />
                        {errors.companyAddress?.zipCode && (
                          <p className="mt-1 text-sm text-error-600">{errors.companyAddress.zipCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        {...register('companyAddress.country', {
                          required: includeCompany ? 'Country is required' : false,
                        })}
                        className={`input ${errors.companyAddress?.country ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : ''
                          }`}
                        placeholder="Country"
                      />
                      {errors.companyAddress?.country && (
                        <p className="mt-1 text-sm text-error-600">{errors.companyAddress.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    {...register('acceptTerms', {
                      required: 'You must accept the terms and conditions',
                    })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-error-600">{errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
