import { Address, PaymentStatus, PropertyStatus, TenantStatus } from '../types';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format address to string
 */
export const formatAddress = (address: Address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (startDate: Date, endDate: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
    return new Date() > dueDate;
};

/**
 * Get status color for UI
 */
export const getStatusColor = (status: PropertyStatus | TenantStatus | PaymentStatus): string => {
    switch (status) {
        case PropertyStatus.AVAILABLE:
        case TenantStatus.ACTIVE:
        case PaymentStatus.PAID:
            return 'text-green-600 bg-green-100';

        case PropertyStatus.OCCUPIED:
        case TenantStatus.PENDING:
        case PaymentStatus.PENDING:
            return 'text-blue-600 bg-blue-100';

        case PropertyStatus.MAINTENANCE:
        case PaymentStatus.OVERDUE:
            return 'text-orange-600 bg-orange-100';

        case PropertyStatus.UNAVAILABLE:
        case TenantStatus.INACTIVE:
        case TenantStatus.EVICTED:
        case PaymentStatus.CANCELLED:
            return 'text-red-600 bg-red-100';

        default:
            return 'text-gray-600 bg-gray-100';
    }
};

/**
 * Generate a random ID
 */
export const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number format (US)
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone);
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Convert file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get initials from name
 */
export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as T;
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
    if (typeof obj === 'object') {
        const clonedObj = {} as T;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
};
