# Authentication System Documentation

## Overview

The PropEase frontend authentication system provides a comprehensive, secure, and user-friendly authentication experience with the following features:

- **User Registration** with company details
- **User Login** with email/password
- **Password Reset** via email
- **Automatic Token Refresh**
- **Protected Routes**
- **Responsive Design**
- **Accessibility Compliance**

## Architecture

### Components Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   ├── forms/
│   │   ├── FormField.tsx        # Reusable form field
│   │   └── PasswordField.tsx    # Password input with strength indicator
│   └── Header.tsx               # Updated with user menu
├── pages/
│   ├── Login.tsx                # Login form
│   ├── Register.tsx             # Registration form
│   ├── ForgotPassword.tsx       # Password reset request
│   └── ResetPassword.tsx        # Password reset form
├── hooks/
│   └── useFormValidation.ts     # Form validation utilities
├── utils/
│   └── api.ts                   # API configuration and utilities
└── App.tsx                      # Updated with auth provider and routes
```

## Key Features

### 1. Authentication Context (`AuthContext.tsx`)

**Features:**
- JWT token management with automatic refresh
- User state management
- Login/logout functionality
- Password reset handling
- Automatic token expiration handling

**Key Methods:**
- `login(credentials)` - Authenticate user
- `register(userData)` - Create new account
- `logout()` - Sign out current session
- `logoutAll()` - Sign out from all devices
- `forgotPassword(email)` - Request password reset
- `resetPassword(data)` - Reset password with token
- `changePassword(data)` - Change password (authenticated)

### 2. Protected Routes (`ProtectedRoute.tsx`)

**Features:**
- Route protection based on authentication status
- Automatic redirect to login for unauthenticated users
- Loading states during authentication checks
- Support for public-only routes (login, register)

### 3. Form Components

#### FormField (`FormField.tsx`)
- Reusable input field with consistent styling
- Icon support
- Error handling
- Accessibility features

#### PasswordField (`PasswordField.tsx`)
- Password visibility toggle
- Password strength indicator
- Real-time validation feedback

### 4. Authentication Pages

#### Login (`Login.tsx`)
- Email/password validation
- Remember me functionality
- Error handling with user-friendly messages
- Redirect to intended page after login

#### Register (`Register.tsx`)
- Multi-step form with personal and company information
- Password strength requirements
- Terms and conditions acceptance
- Optional company details

#### Forgot Password (`ForgotPassword.tsx`)
- Email validation
- Success state handling
- Security-conscious messaging

#### Reset Password (`ResetPassword.tsx`)
- Token validation from URL
- New password with confirmation
- Password strength requirements

## API Integration

### Configuration
- Base URL: `http://localhost:3001/api` (configurable via environment)
- Automatic token inclusion in requests
- Automatic token refresh on 401 responses
- Error handling with user-friendly messages

### Endpoints Used
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - Session logout
- `POST /auth/logout-all` - Logout from all devices
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset
- `POST /auth/change-password` - Change password
- `GET /auth/me` - Get current user profile

## Security Features

### Token Management
- Access tokens stored in localStorage
- Refresh tokens for automatic renewal
- Automatic token expiration handling
- Secure token refresh flow

### Password Security
- Strong password requirements
- Real-time password strength feedback
- Secure password reset flow
- Password confirmation validation

### Form Security
- Input validation and sanitization
- CSRF protection via tokens
- Rate limiting support
- Secure error handling

## Accessibility Features

### ARIA Compliance
- Proper form labels and descriptions
- Error message associations
- Keyboard navigation support
- Screen reader compatibility

### User Experience
- Clear error messages
- Loading states
- Success confirmations
- Responsive design

## Usage Examples

### Basic Authentication Flow

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
      // User will be redirected to dashboard
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### Protected Route Usage

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

// Protected route (requires authentication)
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Public-only route (redirects if authenticated)
<ProtectedRoute requireAuth={false}>
  <Login />
</ProtectedRoute>
```

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Configuration
VITE_APP_NAME=PropEase
VITE_APP_VERSION=1.0.0
```

## Testing

### Manual Testing Checklist

- [ ] User registration with valid data
- [ ] User registration with invalid data (validation)
- [ ] User login with valid credentials
- [ ] User login with invalid credentials
- [ ] Password reset request
- [ ] Password reset with valid token
- [ ] Password reset with invalid token
- [ ] Token refresh on expired access token
- [ ] Logout functionality
- [ ] Protected route access
- [ ] Responsive design on mobile
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

### Automated Testing

The authentication system is designed to be testable with:
- Unit tests for utility functions
- Component tests for form validation
- Integration tests for API calls
- E2E tests for complete user flows

## Future Enhancements

### Planned Features
- Two-factor authentication (2FA)
- Social login integration
- Session management dashboard
- Account lockout protection
- Audit logging
- Multi-language support

### Security Improvements
- Biometric authentication
- Device fingerprinting
- Advanced threat detection
- Compliance reporting

## Troubleshooting

### Common Issues

1. **Token Refresh Fails**
   - Check network connectivity
   - Verify refresh token is valid
   - Clear localStorage and re-login

2. **Form Validation Errors**
   - Check input format requirements
   - Verify password strength
   - Ensure all required fields are filled

3. **API Connection Issues**
   - Verify API server is running
   - Check environment configuration
   - Review network requests in browser dev tools

### Debug Mode

Enable debug mode by setting `VITE_ENABLE_DEBUG_MODE=true` in your environment file to see detailed authentication logs in the console.

## Contributing

When contributing to the authentication system:

1. Follow the existing code patterns
2. Add appropriate error handling
3. Include accessibility features
4. Write tests for new functionality
5. Update documentation
6. Test on multiple devices and browsers
