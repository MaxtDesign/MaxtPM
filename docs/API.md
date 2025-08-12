# PropEase API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": { /* detailed error info for debugging */ }
  }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new property manager account.

**Request Body:**
```json
{
  "email": "manager@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PROPERTY_MANAGER"
}
```

#### POST /auth/login
Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "manager@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "manager@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PROPERTY_MANAGER"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### POST /auth/logout
Logout and invalidate tokens.

### Properties

#### GET /properties
Get all properties for the authenticated user.

#### POST /properties
Create a new property.

**Request Body:**
```json
{
  "name": "Sunset Apartments",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94102",
    "country": "USA"
  },
  "propertyType": "APARTMENT",
  "bedrooms": 2,
  "bathrooms": 1,
  "squareFootage": 800,
  "rentAmount": 2500,
  "depositAmount": 2500,
  "description": "Beautiful apartment with city views",
  "amenities": ["Parking", "Gym", "Pool"]
}
```

#### GET /properties/:id
Get a specific property by ID.

#### PUT /properties/:id
Update a property.

#### DELETE /properties/:id
Delete a property.

### Tenants

#### GET /tenants
Get all tenants for the authenticated user.

#### POST /tenants
Create a new tenant.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "(555) 123-4567",
  "dateOfBirth": "1990-01-01",
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Spouse",
    "phone": "(555) 987-6543",
    "email": "john@example.com"
  },
  "propertyId": "property_id",
  "leaseStartDate": "2024-01-01",
  "leaseEndDate": "2024-12-31",
  "rentAmount": 2500,
  "depositAmount": 2500
}
```

#### GET /tenants/:id
Get a specific tenant by ID.

#### PUT /tenants/:id
Update a tenant.

#### DELETE /tenants/:id
Delete a tenant.

### Payments

#### GET /payments
Get all payments for the authenticated user.

#### POST /payments
Create a new payment record.

**Request Body:**
```json
{
  "tenantId": "tenant_id",
  "propertyId": "property_id",
  "amount": 2500,
  "type": "RENT",
  "dueDate": "2024-01-01",
  "description": "January 2024 rent"
}
```

#### GET /payments/:id
Get a specific payment by ID.

#### PUT /payments/:id
Update a payment.

#### DELETE /payments/:id
Delete a payment.

### Companies

#### GET /companies
Get company information for the authenticated user.

#### POST /companies
Create a new company.

**Request Body:**
```json
{
  "name": "ABC Property Management",
  "address": {
    "street": "456 Business Ave",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94103",
    "country": "USA"
  },
  "phone": "(555) 123-4567",
  "email": "info@abcproperties.com",
  "website": "https://abcproperties.com"
}
```

#### GET /companies/:id
Get a specific company by ID.

#### PUT /companies/:id
Update a company.

#### DELETE /companies/:id
Delete a company.

## Error Codes

- `VALIDATION_ERROR`: Request data validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate email)
- `INTERNAL_SERVER_ERROR`: Server error
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limiting

API endpoints are rate limited to 100 requests per 15 minutes per IP address.

## File Uploads

File uploads (property photos, documents) are handled via multipart/form-data requests to dedicated upload endpoints.

## Webhooks

Payment processing webhooks from Stripe are available for real-time payment updates.
