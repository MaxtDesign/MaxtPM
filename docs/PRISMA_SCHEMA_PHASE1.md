# PropEase Phase 1 Prisma Schema Documentation

## Overview

This document outlines the initial Prisma schema implementation for PropEase Phase 1 features, following the development guidelines and best practices for property management applications.

## Database Schema Summary

### Core Models

#### 1. User Model (Property Managers)
- **Purpose**: Authentication and user management for property managers
- **Key Features**:
  - UUID primary keys for security
  - Email-based authentication
  - Role-based access control (PROPERTY_MANAGER, ADMIN, TENANT)
  - Company association for multi-company support
  - Active/inactive status tracking
  - Timestamps for auditing

#### 2. Company Model
- **Purpose**: Organization management for property management companies
- **Key Features**:
  - Company profile information
  - Address storage as JSON for flexibility
  - Contact information and branding
  - One-to-many relationship with users and properties

#### 3. Property Model
- **Purpose**: Core property management with essential details
- **Key Features**:
  - Property type classification (APARTMENT, HOUSE, CONDO, TOWNHOUSE, COMMERCIAL)
  - Physical characteristics (bedrooms, bathrooms, square footage)
  - Financial information (rent and deposit amounts as Decimal for precision)
  - Status tracking (AVAILABLE, OCCUPIED, MAINTENANCE, UNAVAILABLE)
  - Photo gallery support (array of URLs)
  - Amenities tracking
  - Company association

#### 4. Tenant Model
- **Purpose**: Tenant information and lease management
- **Key Features**:
  - Personal information with contact details
  - Emergency contact information (JSON format)
  - Lease date management (start/end dates)
  - Financial terms (rent and deposit amounts)
  - Status tracking (ACTIVE, INACTIVE, PENDING, EVICTED)
  - Property association

#### 5. Transaction Model
- **Purpose**: Basic financial tracking for rent and other payments
- **Key Features**:
  - Multiple transaction types (RENT, DEPOSIT, LATE_FEE, MAINTENANCE, OTHER)
  - Status tracking (PENDING, PAID, OVERDUE, CANCELLED)
  - Due date and payment date tracking
  - Stripe integration support
  - Tenant and property associations
  - Decimal precision for monetary amounts

#### 6. Document Model
- **Purpose**: File management for leases, applications, and other documents
- **Key Features**:
  - Document categorization (LEASE_AGREEMENT, RENTAL_APPLICATION, etc.)
  - File metadata (name, size, MIME type, URL)
  - Flexible associations (property, tenant, user)
  - Upload tracking with user attribution

#### 7. RefreshToken Model
- **Purpose**: JWT refresh token management for secure authentication
- **Key Features**:
  - Token storage with expiration tracking
  - User association for token management
  - Security-focused implementation

## Database Design Principles

### 1. Security
- **UUID Primary Keys**: All models use UUID primary keys instead of auto-incrementing integers
- **Password Hashing**: User passwords are stored as hashed strings
- **Token Management**: Secure refresh token implementation with expiration

### 2. Performance
- **Strategic Indexing**: Database indexes on frequently queried fields:
  - Email addresses for user lookup
  - Foreign key relationships
  - Status fields for filtering
  - Date fields for sorting and filtering
  - Financial amounts for reporting

### 3. Data Integrity
- **Foreign Key Constraints**: Proper referential integrity with CASCADE delete
- **Field Validation**: Appropriate field types and constraints
  - VARCHAR with length limits for text fields
  - DECIMAL(10,2) for monetary amounts
  - JSON for flexible data structures
  - Enums for constrained values

### 4. Naming Conventions
- **Database Fields**: snake_case following PostgreSQL conventions
- **Table Names**: snake_case with plural forms
- **Enum Types**: PascalCase with descriptive names
- **Relationships**: Clear, descriptive foreign key names

## Migration Details

### Initial Migration: `20250812154735_maxtpm`

**Generated SQL Features**:
- 7 enum types for data validation
- 8 tables with proper constraints
- 20+ database indexes for performance
- Foreign key relationships with CASCADE delete
- Unique constraints where appropriate

**Migration Safety**:
- ✅ No data loss risk (initial migration)
- ✅ Proper rollback support
- ✅ Index creation for performance
- ✅ Constraint validation

## Usage Examples

### Creating a Property Manager
```typescript
const user = await prisma.user.create({
  data: {
    email: 'manager@example.com',
    first_name: 'John',
    last_name: 'Doe',
    password: hashedPassword,
    role: 'PROPERTY_MANAGER',
    company: {
      create: {
        name: 'ABC Property Management',
        address: { street: '123 Main St', city: 'Anytown', state: 'CA' },
        phone: '555-123-4567',
        email: 'info@abcproperties.com'
      }
    }
  }
});
```

### Adding a Property
```typescript
const property = await prisma.property.create({
  data: {
    name: 'Sunset Apartments Unit 101',
    address: { street: '456 Oak Ave', city: 'Anytown', state: 'CA', zip: '90210' },
    property_type: 'APARTMENT',
    bedrooms: 2,
    bathrooms: 1,
    square_footage: 850,
    rent_amount: new Decimal('1500.00'),
    deposit_amount: new Decimal('1500.00'),
    status: 'AVAILABLE',
    company_id: companyId
  }
});
```

### Recording a Rent Payment
```typescript
const transaction = await prisma.transaction.create({
  data: {
    tenant_id: tenantId,
    property_id: propertyId,
    amount: new Decimal('1500.00'),
    type: 'RENT',
    status: 'PAID',
    due_date: new Date('2024-01-01'),
    paid_date: new Date('2024-01-01'),
    description: 'January 2024 rent payment'
  }
});
```

## Phase 1 Compliance

### ✅ Requirements Met
1. **User Model**: Complete with authentication fields and company association
2. **Property Model**: Essential fields including address, type, rent, and photos
3. **Tenant Model**: Contact info and lease dates with proper relationships
4. **Transaction Model**: Basic financial tracking with multiple types and statuses
5. **Document Model**: File management with categorization and associations

### ✅ Development Guidelines Followed
- **UUID Primary Keys**: Implemented for all models
- **Snake Case Naming**: Database fields follow PostgreSQL conventions
- **Timestamps**: Created and updated timestamps on all models
- **Field Validations**: Appropriate data types and constraints
- **Database Indexes**: Strategic indexing for performance
- **Migration Safety**: Initial migration can be run safely

## Next Steps

### Phase 2 Preparation
The schema is designed to support Phase 2 features:
- Document management is ready for lease templates
- Transaction model supports Stripe integration
- User roles include tenant portal preparation

### Performance Considerations
- Monitor query performance with the current indexes
- Consider additional indexes based on usage patterns
- Implement database connection pooling for production

### Security Enhancements
- Implement row-level security (RLS) for multi-tenant data isolation
- Add audit logging for sensitive operations
- Consider encryption for sensitive document storage

## Testing

The schema has been tested with:
- ✅ Database connection verification
- ✅ Table creation validation
- ✅ Enum type verification
- ✅ Index creation confirmation
- ✅ Foreign key constraint validation

## Maintenance

### Regular Tasks
- Monitor database performance
- Review and optimize indexes based on query patterns
- Update Prisma client after schema changes
- Backup database regularly

### Schema Evolution
- Use Prisma migrations for all schema changes
- Test migrations in development before production
- Document breaking changes
- Consider data migration strategies for schema updates
