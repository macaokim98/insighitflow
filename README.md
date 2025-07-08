# InsightFlow CRM

A modern, full-stack Customer Relationship Management system built with React, NestJS, and PostgreSQL.

## 🚀 Features

- **Customer Management**: Complete customer profiles with interaction history
- **Sales Pipeline**: Kanban-style deal management with customizable stages
- **Real-time Analytics**: Dynamic dashboards with business insights
- **Team Collaboration**: Role-based access control and activity tracking
- **Modern UI**: Material-UI components with responsive design
- **RESTful API**: Well-documented API with Swagger integration

## 🛠️ Tech Stack

### Frontend
- React 19 with TypeScript
- Material-UI v5 for components
- Redux Toolkit for state management
- React Router for navigation
- Recharts for data visualization
- Vite for fast development

### Backend
- NestJS with TypeScript
- PostgreSQL for primary database
- Redis for caching
- JWT authentication
- Swagger API documentation
- TypeORM for database operations

### DevOps
- Docker & Docker Compose
- ESLint & Prettier
- Husky for git hooks

## 📋 Prerequisites

- Node.js 20+ 
- Docker & Docker Compose
- Git

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insightflow-crm
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/api-docs

### Manual Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment files**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start PostgreSQL and Redis**
   ```bash
   docker-compose up postgres redis -d
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
insightflow-crm/
├── frontend/                 # React frontend application
├── backend/                  # NestJS backend application
├── shared/                   # Shared TypeScript types and utilities
├── infrastructure/           # Docker configurations
├── scripts/                  # Utility scripts
└── docs/                     # Documentation
```

## 🔑 Default Login

- **Email**: admin@insightflow.com
- **Password**: admin123

## 🌐 Live Demo

**Frontend (Vercel)**: [https://insightflow-crm.vercel.app](https://insightflow-crm.vercel.app)

*Note: The live demo uses a mock API for demonstration purposes.*

## 📚 API Documentation

The API documentation is automatically generated using Swagger and available at:
http://localhost:4000/api-docs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend
```

## 🔧 Development

### Backend Development

```bash
cd backend
npm run start:dev  # Start with hot reload
npm run lint       # Run linting
npm run test:watch # Run tests in watch mode
```

### Frontend Development

```bash
cd frontend
npm run dev        # Start development server
npm run lint       # Run linting
npm run test       # Run tests
```

## 🚢 Deployment

### Production Build

```bash
npm run build
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=4000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=insightflow
DATABASE_PASSWORD=insightflow123
DATABASE_NAME=insightflow_crm
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please create an issue in the GitHub repository or contact the development team.