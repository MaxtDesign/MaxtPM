import jwt from 'jsonwebtoken';
import {
  comparePassword,
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
  hashPassword,
  hashPasswordResetToken,
  isValidEmail,
  validatePasswordStrength,
  verifyAccessToken,
  verifyRefreshToken,
} from '../auth';

// Mock environment variables
process.env['JWT_SECRET'] = 'test-jwt-secret';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret';

describe('Authentication Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hash length
    });

    it('should verify correct password', async () => {
      const password = 'TestPassword123';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123';
      const wrongPassword = 'WrongPassword123';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('JWT Token Generation', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'PROPERTY_MANAGER',
      companyId: 'company123',
      isActive: true,
    };

    it('should generate access token', () => {
      const token = generateAccessToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate refresh token', () => {
      const token = generateRefreshToken(mockUser.id);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should verify valid access token', () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should verify valid refresh token', () => {
      const token = generateRefreshToken(mockUser.id);
      const decoded = verifyRefreshToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(mockUser.id);
    });

    it('should reject invalid access token', () => {
      expect(() => {
        verifyAccessToken('invalid-token');
      }).toThrow('Invalid or expired access token');
    });

    it('should reject invalid refresh token', () => {
      expect(() => {
        verifyRefreshToken('invalid-token');
      }).toThrow('Invalid or expired refresh token');
    });

    it('should reject expired token', () => {
      const expiredToken = jwt.sign(
        { id: mockUser.id },
        process.env['JWT_SECRET']!,
        { expiresIn: '0s' }
      );

      // Wait a bit for token to expire
      setTimeout(() => {
        expect(() => {
          verifyAccessToken(expiredToken);
        }).toThrow('Invalid or expired access token');
      }, 100);
    });
  });

  describe('Password Reset Token', () => {
    it('should generate password reset token', () => {
      const token = generatePasswordResetToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes = 64 hex characters
    });

    it('should hash password reset token', () => {
      const token = generatePasswordResetToken();
      const hashedToken = hashPasswordResetToken(token);

      expect(hashedToken).toBeDefined();
      expect(typeof hashedToken).toBe('string');
      expect(hashedToken).not.toBe(token);
      expect(hashedToken.length).toBe(64); // SHA256 hash length
    });

    it('should generate consistent hash for same token', () => {
      const token = generatePasswordResetToken();
      const hash1 = hashPasswordResetToken(token);
      const hash2 = hashPasswordResetToken(token);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different tokens', () => {
      const token1 = generatePasswordResetToken();
      const token2 = generatePasswordResetToken();
      const hash1 = hashPasswordResetToken(token1);
      const hash2 = hashPasswordResetToken(token2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example..com',
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('Password Strength Validation', () => {
    it('should accept strong passwords', () => {
      const strongPasswords = [
        'StrongPass123',
        'MySecureP@ss1',
        'ComplexPassword2024!',
        'Abc123Def456',
      ];

      strongPasswords.forEach(password => {
        const result = validatePasswordStrength(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        { password: 'short', expectedError: 'Password must be at least 8 characters long' },
        { password: 'nouppercase123', expectedError: 'Password must contain at least one uppercase letter' },
        { password: 'NOLOWERCASE123', expectedError: 'Password must contain at least one lowercase letter' },
        { password: 'NoNumbers', expectedError: 'Password must contain at least one number' },
      ];

      weakPasswords.forEach(({ password, expectedError }) => {
        const result = validatePasswordStrength(password);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(expectedError);
      });
    });

    it('should provide multiple error messages for very weak passwords', () => {
      const veryWeakPassword = 'weak';
      const result = validatePasswordStrength(veryWeakPassword);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should handle edge cases', () => {
      // Empty string
      const emptyResult = validatePasswordStrength('');
      expect(emptyResult.isValid).toBe(false);
      expect(emptyResult.errors).toContain('Password must be at least 8 characters long');

      // Very long password
      const longPassword = 'A'.repeat(1000) + 'b1';
      const longResult = validatePasswordStrength(longPassword);
      expect(longResult.isValid).toBe(true);
      expect(longResult.errors).toHaveLength(0);
    });
  });

  describe('Token Expiration', () => {
    it('should set correct expiration for access token', () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'PROPERTY_MANAGER',
        isActive: true,
      };

      const token = generateAccessToken(mockUser);
      const decoded = jwt.decode(token) as any;

      // Check that expiration is set to 15 minutes from now
      const now = Math.floor(Date.now() / 1000);
      const expiration = decoded.exp;
      const timeDiff = expiration - now;

      // Should be approximately 15 minutes (900 seconds)
      expect(timeDiff).toBeGreaterThan(890); // Allow 10 second tolerance
      expect(timeDiff).toBeLessThan(910);
    });

    it('should set correct expiration for refresh token', () => {
      const userId = 'user123';
      const token = generateRefreshToken(userId);
      const decoded = jwt.decode(token) as any;

      // Check that expiration is set to 7 days from now
      const now = Math.floor(Date.now() / 1000);
      const expiration = decoded.exp;
      const timeDiff = expiration - now;

      // Should be approximately 7 days (604800 seconds)
      expect(timeDiff).toBeGreaterThan(604790); // Allow 10 second tolerance
      expect(timeDiff).toBeLessThan(604810);
    });
  });
});
