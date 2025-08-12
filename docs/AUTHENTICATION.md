# PropEase Authentication System

## Overview

PropEase implements a secure, JWT-based authentication system with refresh tokens, comprehensive input validation, rate limiting, and password reset functionality. The system follows security best practices and provides a robust foundation for user management.

## Security Features

### 🔐 JWT Token Management
- **Access Tokens**: 15-minute expiration for API access
- **Refresh Tokens**: 7-day expiration stored securely in database
- **Automatic Token Rotation**: Refresh tokens are rotated on each use
- **Secure Token Storage**: Refresh tokens are hashed and stored with expiration

### 🛡️ Password Security
- **bcrypt Hashing**: 12 salt rounds for secure password storage
- **Password Strength Validation**: Enforces strong password requirements
- **Secure Password Reset**: Time-limited tokens with email verification
- **Password History**: Prevents reuse of recent passwords

### 🚫 Rate Limiting
- **Login Attempts**: 10 attempts per 15 minutes per IP/email
- **Registration**: 5 attempts per hour per IP
- **Password Reset**: 3 attempts per hour per IP
- **Token Refresh**: 20 attempts per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP

### 📧 Email Security
- **Password Reset Emails**: Secure token-based reset links
- **Welcome Emails**: Confirmation of successful registration
- **Security Notifications**: Alerts for password changes
- **HTML Email Templates**: Professional, branded email communications

## API Endpoints

### Authentication Endpoints

#### POST `/api/v1/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "companyName": "Doe Properties",
  "companyAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  },
  "companyPhone": "+1-555-123-4567",
  "companyEmail": "contact@doeproperties.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PROPERTY_MANAGER",
      "companyId": "company_456",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "User registered successfully"
}
```

#### POST `/api/v1/auth/login`
Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PROPERTY_MANAGER",
      "companyId": "company_456",
      "company": {
        "id": "company_456",
        "name": "Doe Properties"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "Login successful"
}
```

#### POST `/api/v1/auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "Token refreshed successfully"
}
```

#### POST `/api/v1/auth/logout`
Logout user and invalidate refresh token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST `/api/v1/auth/logout-all`
Logout user from all devices.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

#### POST `/api/v1/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

#### POST `/api/v1/auth/reset-password`
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### POST `/api/v1/auth/change-password`
Change password (authenticated user).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldSecurePass123",
  "newPassword": "NewSecurePass123",
  "confirmPassword": "NewSecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again."
}
```

#### GET `/api/v1/auth/me`
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PROPERTY_MANAGER",
      "companyId": "company_456",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "company": {
        "id": "company_456",
        "name": "Doe Properties",
        "address": {
          "street": "123 Main St",
          "city": "Anytown",
          "state": "CA",
          "zipCode": "12345",
          "country": "USA"
        },
        "phone": "+1-555-123-4567",
        "email": "contact@doeproperties.com",
        "website": "https://doeproperties.com",
        "logo": "https://example.com/logo.png"
      }
    }
  },
  "message": "User profile retrieved successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `USER_ALREADY_EXISTS`: Email already registered
- `INVALID_CREDENTIALS`: Wrong email or password
- `ACCOUNT_INACTIVE`: User account is deactivated
- `INVALID_TOKEN`: Invalid or expired token
- `MISSING_TOKEN`: Authorization header missing
- `UNAUTHORIZED`: Authentication required
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `EMAIL_SEND_FAILED`: Failed to send email
- `WEAK_PASSWORD`: Password doesn't meet requirements

## Middleware

### Authentication Middleware

```typescript
import { authenticateToken } from '../middleware/auth';

// Protect route with authentication
router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains authenticated user data
  res.json({ user: req.user });
});
```

### Role-Based Authorization

```typescript
import { requireRole } from '../middleware/auth';

// Require specific roles
router.get('/admin-only', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  (req, res) => {
    res.json({ message: 'Admin access granted' });
  }
);
```

### Input Validation

```typescript
import { validateRequest } from '../middleware/validation';
import { LoginSchema } from '../../../shared/src/types/auth';

// Validate request body
router.post('/login', 
  validateRequest(LoginSchema), 
  (req, res) => {
    // req.body is validated
  }
);
```

## Security Best Practices

### 1. Token Management
- Store refresh tokens securely in database
- Rotate refresh tokens on each use
- Implement token blacklisting for logout
- Use short-lived access tokens (15 minutes)

### 2. Password Security
- Use bcrypt with 12 salt rounds
- Enforce strong password requirements
- Implement secure password reset flow
- Hash password reset tokens

### 3. Rate Limiting
- Implement different limits for different endpoints
- Use IP + email combination for login attempts
- Monitor and log rate limit violations
- Provide clear error messages

### 4. Input Validation
- Validate all inputs using Zod schemas
- Sanitize user inputs
- Return detailed validation errors
- Prevent SQL injection and XSS attacks

### 5. Email Security
- Use secure SMTP configuration
- Implement email templates
- Send security notifications
- Use time-limited reset tokens

## Environment Variables

Required environment variables for authentication:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@propease.com

# Application URL
APP_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing

Run authentication tests:

```bash
# Run all tests
npm test

# Run auth tests only
npm test -- --testPathPattern=auth

# Run with coverage
npm test -- --coverage
```

## Database Schema

The authentication system uses these database tables:

- `users`: User accounts and profiles
- `companies`: Company information
- `refresh_tokens`: Stored refresh tokens
- `password_reset_tokens`: Password reset tokens

## Frontend Integration

### Token Storage
```typescript
// Store tokens securely
localStorage.setItem('accessToken', tokens.accessToken);
localStorage.setItem('refreshToken', tokens.refreshToken);
```

### API Requests
```typescript
// Include token in requests
const response = await fetch('/api/v1/properties', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Token Refresh
```typescript
// Refresh token when access token expires
const refreshTokens = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  if (response.ok) {
    const { tokens } = await response.json();
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};
```

## Monitoring and Logging

- Log authentication attempts (success/failure)
- Monitor rate limit violations
- Track token refresh patterns
- Alert on suspicious activity
- Log password reset requests

## Compliance

The authentication system is designed to comply with:

- OWASP Security Guidelines
- GDPR Data Protection Requirements
- Industry Security Standards
- Best Practices for JWT Implementation
