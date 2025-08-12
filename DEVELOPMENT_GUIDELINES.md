# Cursor AI Development Guidelines - Property Management App

## 🎯 PROJECT OVERVIEW
You are building **PropEase** - a lightweight, versatile web application for small property managers (1-50 properties). Focus on simplicity, reliability, and essential features that solve real problems.

**Core Mission**: Eliminate paperwork and streamline daily operations for small property managers who need powerful tools without complexity.

---

## 🏗️ TECHNICAL ARCHITECTURE

### Tech Stack (Non-Negotiable)
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS for rapid, consistent UI development
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 (or compatible service)
- **Payment Processing**: Stripe for rent collection
- **Deployment**: Docker containers, ready for cloud deployment

### Development Environment Setup
```
propease/
├── frontend/          # React TypeScript app
├── backend/           # Express.js API
├── shared/            # Shared types and utilities
├── docs/              # Documentation
└── docker-compose.yml # Local development environment
```

---

## 📋 CORE FEATURES PRIORITY (Build in This Order)

### Phase 1: Foundation (MVP)
1. **User Authentication & Setup**
   - Property manager registration/login
   - Company profile setup
   - Basic dashboard

2. **Property Management**
   - Add/edit/delete properties
   - Property details (address, type, rent amount)
   - Photo upload and gallery

3. **Tenant Management**
   - Add/edit tenant information
   - Lease start/end dates
   - Contact information

4. **Basic Financial Tracking**
   - Record rent payments manually
   - Simple income/expense logging
   - Monthly financial summary

### Phase 2: Automation
5. **Document Management**
   - Upload and organize documents
   - Basic lease templates
   - Document sharing with tenants

6. **Online Rent Collection**
   - Stripe integration for payments
   - Automated payment reminders
   - Payment history tracking

### Phase 3: Advanced Features
7. **Maintenance Management**
8. **Vendor Management**
9. **Advanced Reporting**
10. **Tenant Portal**

---

## 💻 DEVELOPMENT PRINCIPLES

### Code Quality Standards
- **TypeScript First**: All code must be strongly typed
- **Component Architecture**: Reusable, testable React components
- **API Design**: RESTful endpoints with clear naming conventions
- **Error Handling**: Comprehensive error boundaries and API error responses
- **Testing**: Unit tests for utilities, integration tests for API endpoints
- **Documentation**: Clear JSDoc comments for complex functions

### User Experience Principles
- **Mobile-First**: Every feature must work perfectly on mobile
- **Speed**: Page loads under 2 seconds, API responses under 500ms
- **Accessibility**: WCAG 2.1 AA compliance
- **Intuitive Navigation**: Maximum 3 clicks to reach any feature
- **Progressive Enhancement**: Core features work without JavaScript

### Security Requirements
- **Data Protection**: Encrypt all sensitive data at rest and in transit
- **Input Validation**: Sanitize and validate all user inputs
- **Authentication**: Secure session management with proper token expiration
- **File Uploads**: Validate file types, scan for malware, limit file sizes
- **API Security**: Rate limiting, CORS configuration, SQL injection prevention

---

## 🎨 UI/UX GUIDELINES

### Design System
- **Primary Color**: Blue (#3B82F6) for actions and links
- **Success Color**: Green (#10B981) for positive actions
- **Warning Color**: Orange (#F59E0B) for cautions
- **Error Color**: Red (#EF4444) for errors
- **Neutral Colors**: Tailwind's gray scale for text and backgrounds

### Layout Principles
- **Sidebar Navigation**: Collapsible sidebar for main navigation
- **Card-Based Design**: Group related information in clean cards
- **Consistent Spacing**: Use Tailwind's spacing scale consistently
- **Typography**: Clear hierarchy with readable font sizes
- **Responsive Breakpoints**: Mobile (sm), Tablet (md), Desktop (lg, xl)

### Component Standards
```typescript
// Example component structure
interface ComponentProps {
  // Props must be explicitly typed
}

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div className="consistent-tailwind-classes">
      {/* Component JSX */}
    </div>
  );
};
```

---

## 🔧 DEVELOPMENT WORKFLOW

### File Naming Conventions
- **Components**: PascalCase (`PropertyCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`usePropertyData.ts`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **API Routes**: kebab-case (`/api/properties/:id`)
- **Database Tables**: snake_case (`property_managers`, `rental_properties`)

### Git Commit Standards
```
feat: add property photo upload functionality
fix: resolve payment processing error on mobile
docs: update API documentation for tenant endpoints
style: improve responsive design for property cards
refactor: optimize database queries for property listing
test: add unit tests for rent calculation utilities
```

### API Response Format
```typescript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": { /* detailed error info for debugging */ }
  }
}
```

---

## 🚫 SCOPE LIMITATIONS

### DO NOT IMPLEMENT
- Complex accounting features (focus on simple income/expense tracking)
- Multi-language support (English only for MVP)
- Advanced reporting/analytics (basic summaries only)
- Integration with 3rd party services beyond Stripe
- Real-time chat or messaging features
- Complex workflow automation
- White-label or multi-tenant architecture

### ALWAYS ASK BEFORE
- Adding new dependencies or libraries
- Implementing features not in the core feature list
- Making architectural changes
- Adding complex UI animations or interactions
- Implementing caching strategies beyond basic browser caching

---

## 🔍 TESTING REQUIREMENTS

### Required Test Coverage
- **Unit Tests**: All utility functions and custom hooks
- **Component Tests**: Key components with user interactions
- **API Tests**: All endpoints with success and error scenarios
- **Integration Tests**: Critical user flows (login, payment processing)

### Performance Benchmarks
- **Bundle Size**: Keep main bundle under 500KB gzipped
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **API Response Time**: Average response time under 300ms
- **Database Queries**: Optimize for under 50ms average query time

---

## 📝 DEVELOPMENT NOTES

### When Stuck or Uncertain
1. **Prioritize MVP features** - Don't add complexity that isn't essential
2. **Follow established patterns** - Look at existing code for consistency
3. **Ask specific questions** - "Should I implement X feature or focus on Y instead?"
4. **Security first** - When in doubt, choose the more secure option
5. **User experience matters** - If something feels clunky, it probably is

### Success Metrics
- ✅ Property managers can complete core tasks in under 5 minutes
- ✅ App works flawlessly on mobile devices
- ✅ No security vulnerabilities in code
- ✅ 95%+ uptime and reliability
- ✅ Intuitive enough that users don't need extensive training

---

## 🎯 CURRENT FOCUS
**Start with Phase 1 features only.** Build a solid foundation before adding complexity. Each feature should be fully functional and tested before moving to the next.

Remember: This app's success depends on being **simple, reliable, and genuinely useful** for small property managers who are busy and want technology that works without hassle.