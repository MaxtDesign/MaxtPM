import { Request, Response, Router } from 'express';
import {
    ChangePasswordSchema,
    ForgotPasswordSchema,
    LoginSchema,
    RefreshTokenSchema,
    RegisterSchema,
    ResetPasswordSchema
} from '../../../shared/src/types/auth';
import { prisma } from '../index';
import { authenticateToken } from '../middleware/auth';
import {
    loginLimiter,
    passwordResetLimiter,
    refreshTokenLimiter,
    registrationLimiter
} from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validation';
import {
    sendPasswordChangedEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail
} from '../services/emailService';
import {
    comparePassword,
    deleteAllUserRefreshTokens,
    deleteRefreshToken,
    generateAuthTokens,
    generatePasswordResetToken,
    hashPassword,
    hashPasswordResetToken,
    isRefreshTokenValid,
    validatePasswordStrength
} from '../utils/auth';

const router = Router();

// User registration
router.post('/register',
    registrationLimiter,
    validateRequest(RegisterSchema),
    async (req: Request, res: Response) => {
        try {
            const {
                email,
                firstName,
                lastName,
                password,
                companyName,
                companyAddress,
                companyPhone,
                companyEmail
            } = req.body;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'USER_ALREADY_EXISTS',
                        message: 'A user with this email already exists',
                    },
                });
            }

            // Validate password strength
            const passwordValidation = validatePasswordStrength(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'WEAK_PASSWORD',
                        message: 'Password does not meet security requirements',
                        details: passwordValidation.errors,
                    },
                });
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create user and company in a transaction
            const result = await prisma.$transaction(async (tx) => {
                let companyId: string | undefined;

                // Create company if company details are provided
                if (companyName && companyAddress) {
                    const company = await tx.company.create({
                        data: {
                            name: companyName,
                            address: companyAddress,
                            phone: companyPhone || '',
                            email: companyEmail || email,
                        },
                    });
                    companyId = company.id;
                }

                // Create user
                const user = await tx.user.create({
                    data: {
                        email: email.toLowerCase(),
                        firstName,
                        lastName,
                        password: hashedPassword,
                        ...(companyId && { companyId }),
                    },
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        companyId: true,
                        isActive: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                });

                return user;
            });

            // Generate auth tokens
            const tokens = await generateAuthTokens({
                id: result.id,
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName,
                role: result.role,
                companyId: result.companyId || undefined,
                isActive: result.isActive,
            });

            // Send welcome email (non-blocking)
            sendWelcomeEmail(result.email, result.firstName).catch(console.error);

            res.status(201).json({
                success: true,
                data: {
                    user: result,
                    tokens,
                },
                message: 'User registered successfully',
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 'REGISTRATION_FAILED',
                    message: 'Failed to register user',
                },
            });
        }
    }
);

// User login
router.post('/login',
    loginLimiter,
    validateRequest(LoginSchema),
    async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password',
                    },
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'ACCOUNT_INACTIVE',
                        message: 'Account is inactive. Please contact support.',
                    },
                });
            }

            // Verify password
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password',
                    },
                });
            }

            // Generate auth tokens
            const tokens = await generateAuthTokens({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                companyId: user.companyId || undefined,
                isActive: user.isActive,
            });

            // Return user data (without password)
            const userData = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                companyId: user.companyId,
                company: user.company,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };

            res.json({
                success: true,
                data: {
                    user: userData,
                    tokens,
                },
                message: 'Login successful',
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 'LOGIN_FAILED',
                    message: 'Failed to authenticate user',
                },
            });
        }
    }
);

// Refresh token
router.post('/refresh',
    refreshTokenLimiter,
    validateRequest(RefreshTokenSchema),
    async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;

            // Verify refresh token is valid in database
            const isValid = await isRefreshTokenValid(refreshToken);
            if (!isValid) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_REFRESH_TOKEN',
                        message: 'Invalid or expired refresh token',
                    },
                });
            }

            // Verify JWT token
            const { verifyRefreshToken } = await import('../utils/auth');
            const decoded = verifyRefreshToken(refreshToken) as any;

            // Get user
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    companyId: true,
                    isActive: true,
                },
            });

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found or account is inactive',
                    },
                });
            }

            // Delete old refresh token
            await deleteRefreshToken(refreshToken);

            // Generate new tokens
            const tokens = await generateAuthTokens(user);

            res.json({
                success: true,
                data: {
                    tokens,
                },
                message: 'Token refreshed successfully',
            });
        } catch (error) {
            console.error('Token refresh error:', error);
            res.status(401).json({
                success: false,
                error: {
                    code: 'REFRESH_FAILED',
                    message: 'Failed to refresh token',
                },
            });
        }
    }
);

// Logout
router.post('/logout',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (token) {
                // Delete refresh token if provided in body
                if (req.body.refreshToken) {
                    await deleteRefreshToken(req.body.refreshToken);
                }
            }

            res.json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'LOGOUT_FAILED',
                    message: 'Failed to logout',
                },
            });
        }
    }
);

// Logout all devices
router.post('/logout-all',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    },
                });
            }

            // Delete all refresh tokens for the user
            await deleteAllUserRefreshTokens(req.user.id);

            res.json({
                success: true,
                message: 'Logged out from all devices successfully',
            });
        } catch (error) {
            console.error('Logout all error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'LOGOUT_ALL_FAILED',
                    message: 'Failed to logout from all devices',
                },
            });
        }
    }
);

// Forgot password
router.post('/forgot-password',
    passwordResetLimiter,
    validateRequest(ForgotPasswordSchema),
    async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase() },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                },
            });

            if (!user) {
                // Don't reveal if user exists or not
                return res.json({
                    success: true,
                    message: 'If an account with that email exists, a password reset link has been sent.',
                });
            }

            // Generate reset token
            const resetToken = generatePasswordResetToken();
            const hashedToken = hashPasswordResetToken(resetToken);

            // Set expiration (1 hour from now)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            // Save reset token
            await prisma.passwordResetToken.create({
                data: {
                    token: hashedToken,
                    userId: user.id,
                    expiresAt,
                },
            });

            // Send reset email
            const emailSent = await sendPasswordResetEmail(
                user.email,
                resetToken,
                user.firstName
            );

            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'EMAIL_SEND_FAILED',
                        message: 'Failed to send password reset email',
                    },
                });
            }

            res.json({
                success: true,
                message: 'If an account with that email exists, a password reset link has been sent.',
            });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'FORGOT_PASSWORD_FAILED',
                    message: 'Failed to process password reset request',
                },
            });
        }
    }
);

// Reset password
router.post('/reset-password',
    passwordResetLimiter,
    validateRequest(ResetPasswordSchema),
    async (req: Request, res: Response) => {
        try {
            const { token, password } = req.body;

            // Hash the provided token
            const hashedToken = hashPasswordResetToken(token);

            // Find valid reset token
            const resetToken = await prisma.passwordResetToken.findFirst({
                where: {
                    token: hashedToken,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                        },
                    },
                },
            });

            if (!resetToken) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_RESET_TOKEN',
                        message: 'Invalid or expired reset token',
                    },
                });
            }

            // Validate password strength
            const passwordValidation = validatePasswordStrength(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'WEAK_PASSWORD',
                        message: 'Password does not meet security requirements',
                        details: passwordValidation.errors,
                    },
                });
            }

            // Hash new password
            const hashedPassword = await hashPassword(password);

            // Update password and delete reset token in a transaction
            await prisma.$transaction(async (tx) => {
                // Update user password
                await tx.user.update({
                    where: { id: resetToken.user.id },
                    data: { password: hashedPassword },
                });

                // Delete the used reset token
                await tx.passwordResetToken.delete({
                    where: { id: resetToken.id },
                });

                // Delete all refresh tokens for the user (force re-login)
                await tx.refreshToken.deleteMany({
                    where: { userId: resetToken.user.id },
                });
            });

            // Send password changed email
            sendPasswordChangedEmail(
                resetToken.user.email,
                resetToken.user.firstName
            ).catch(console.error);

            res.json({
                success: true,
                message: 'Password reset successfully',
            });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'RESET_PASSWORD_FAILED',
                    message: 'Failed to reset password',
                },
            });
        }
    }
);

// Change password (authenticated)
router.post('/change-password',
    authenticateToken,
    validateRequest(ChangePasswordSchema),
    async (req: Request, res: Response) => {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    },
                });
            }

            // Get user with password
            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    password: true,
                },
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found',
                    },
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'INVALID_CURRENT_PASSWORD',
                        message: 'Current password is incorrect',
                    },
                });
            }

            // Validate new password strength
            const passwordValidation = validatePasswordStrength(newPassword);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'WEAK_PASSWORD',
                        message: 'Password does not meet security requirements',
                        details: passwordValidation.errors,
                    },
                });
            }

            // Hash new password
            const hashedPassword = await hashPassword(newPassword);

            // Update password
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            // Delete all refresh tokens (force re-login)
            await deleteAllUserRefreshTokens(user.id);

            // Send password changed email
            sendPasswordChangedEmail(user.email, user.firstName).catch(console.error);

            res.json({
                success: true,
                message: 'Password changed successfully. Please log in again.',
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'CHANGE_PASSWORD_FAILED',
                    message: 'Failed to change password',
                },
            });
        }
    }
);

// Get current user profile
router.get('/me',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'Authentication required',
                    },
                });
            }

            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    companyId: true,
                    isActive: true,
                    createdAt: true,
                    updatedAt: true,
                    company: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            phone: true,
                            email: true,
                            website: true,
                            logo: true,
                        },
                    },
                },
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found',
                    },
                });
            }

            res.json({
                success: true,
                data: { user },
                message: 'User profile retrieved successfully',
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'GET_PROFILE_FAILED',
                    message: 'Failed to retrieve user profile',
                },
            });
        }
    }
);

export default router;
