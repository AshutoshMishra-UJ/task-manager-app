# Task Manager Application

A full-stack Task Manager application built with React frontend and Node.js/Express backend, featuring JWT authentication and MongoDB database.

## Features

- **User Authentication**: Sign up and login with JWT tokens
- **Task Management**: Create, edit, delete, and toggle task status
- **Task Filtering**: Filter tasks by status (pending/completed) and priority (low/medium/high)
- **Due Dates**: Set and track task due dates with overdue indicators
- **Responsive Design**: Mobile-friendly interface
- **Secure Backend**: JWT authentication, input validation, and secure headers

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React Hook Form
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Helmet for security headers
- CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Task-Manager
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   
   # Edit .env file with your configuration:
   # MONGODB_URI=mongodb://localhost:27017/taskmanager
   # JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   # JWT_EXPIRE=7d
   # NODE_ENV=development
   # PORT=5000
   # FRONTEND_URL=http://localhost:3000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Setup**
   - Install MongoDB locally or create a MongoDB Atlas account
   - Update the `MONGODB_URI` in your `.env` file

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Toggle task status
- `DELETE /api/tasks/:id` - Delete task

## Deployment

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set JWT_EXPIRE=7d
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=your_frontend_url
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Update API URL**
   - Create `.env.production` in frontend folder
   - Add: `REACT_APP_API_URL=your_backend_heroku_url/api`

2. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   ```
   
   Then deploy the `build` folder to Vercel, Netlify, or your preferred hosting service.

### Alternative: Render Deployment

For Render deployment, create `render.yaml` in the root:

```yaml
services:
  - type: web
    name: task-manager-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: taskmanager
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRE
        value: 7d

  - type: web
    name: task-manager-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://your-backend-url/api
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- Security headers with Helmet
- CORS configuration
- MongoDB injection prevention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.
