import { z } from 'zod';

// Base API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  PROPERTY_MANAGER = 'PROPERTY_MANAGER',
  ADMIN = 'ADMIN',
  TENANT = 'TENANT'
}

// Company Types
export interface Company {
  id: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Property Types
export interface Property {
  id: string;
  name: string;
  address: Address;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  rentAmount: number;
  depositAmount: number;
  status: PropertyStatus;
  description?: string;
  photos: string[];
  amenities: string[];
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  COMMERCIAL = 'COMMERCIAL'
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE'
}

// Tenant Types
export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  emergencyContact: EmergencyContact;
  propertyId: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: number;
  depositAmount: number;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  EVICTED = 'EVICTED'
}

// Financial Types
export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentType {
  RENT = 'RENT',
  DEPOSIT = 'DEPOSIT',
  LATE_FEE = 'LATE_FEE',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

// Common Types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Zod Schemas for Validation
export const AddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required')
});

export const UserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole)
});

export const PropertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  address: AddressSchema,
  propertyType: z.nativeEnum(PropertyType),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  squareFootage: z.number().min(1),
  rentAmount: z.number().min(0),
  depositAmount: z.number().min(0),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([])
});

export const TenantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.date(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(1, 'Emergency contact phone is required'),
    email: z.string().email().optional()
  }),
  propertyId: z.string().min(1, 'Property is required'),
  leaseStartDate: z.date(),
  leaseEndDate: z.date(),
  rentAmount: z.number().min(0),
  depositAmount: z.number().min(0)
});

// Utility Types
export type CreateUserRequest = z.infer<typeof UserSchema>;
export type CreatePropertyRequest = z.infer<typeof PropertySchema>;
export type CreateTenantRequest = z.infer<typeof TenantSchema>;

export type UpdateUserRequest = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdatePropertyRequest = Partial<Omit<Property, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>>;
export type UpdateTenantRequest = Partial<Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>>;
