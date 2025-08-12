# PropEase - Property Management Application

A lightweight, versatile web application for small property managers (1-50 properties). Focus on simplicity, reliability, and essential features that solve real problems.

## 🎯 Project Overview

**Core Mission**: Eliminate paperwork and streamline daily operations for small property managers who need powerful tools without complexity.

## 🏗️ Tech Stack

- **Frontend**: React 18+ with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 (or compatible service)
- **Payment Processing**: Stripe for rent collection
- **Deployment**: Docker containers, ready for cloud deployment

## 📁 Project Structure

```
propease/
├── frontend/          # React TypeScript app
├── backend/           # Express.js API
├── shared/            # Shared types and utilities
├── docs/              # Documentation
└── docker-compose.yml # Local development environment
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd propease
   ```

2. **Start the database**
   ```bash
   docker-compose up -d postgres
   ```

3. **Setup environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

4. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

5. **Setup database**
   ```bash
   cd backend
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Database: localhost:5432

## 📋 Available Scripts

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🔧 Development Guidelines

Please refer to [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) for detailed development standards, coding conventions, and feature priorities.

## 📝 Core Features (Phase 1 - MVP)

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

## 🤝 Contributing

1. Follow the development guidelines
2. Write tests for new features
3. Ensure code quality with ESLint and Prettier
4. Use conventional commit messages

## 📄 License

This project is proprietary software.

## 🆘 Support

For development questions or issues, please refer to the development guidelines or create an issue in the project repository.
