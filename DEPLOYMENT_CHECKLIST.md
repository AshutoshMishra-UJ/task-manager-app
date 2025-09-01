# Task Manager Deployment Checklist

## Prerequisites
- [x] Code pushed to GitHub: https://github.com/AshutoshMishra-UJ/task-manager-app
- [ ] MongoDB Atlas account created
- [ ] Render account created  
- [ ] Vercel account created

## Backend Deployment (Render)
- [ ] Web service created with root directory: `backend`
- [ ] Environment variables set:
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] MONGODB_URI=(from MongoDB Atlas)
  - [ ] JWT_SECRET=(generate secure key)
  - [ ] FRONTEND_URL=(will update after frontend deploy)
- [ ] Service deployed successfully
- [ ] Backend URL noted: `https://________.onrender.com`

## Database Setup (MongoDB Atlas)
- [ ] Free cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Connection string added to Render environment

## Frontend Deployment (Vercel)
- [ ] Project imported with root directory: `frontend`
- [ ] Environment variables set:
  - [ ] REACT_APP_API_URL=(Backend URL from Render)
- [ ] Deployment successful
- [ ] Frontend URL noted: `https://________.vercel.app`

## Final Configuration
- [ ] Update backend FRONTEND_URL with Vercel URL
- [ ] Test login/register functionality
- [ ] Test task creation/editing
- [ ] Test theme toggle
- [ ] Verify all features working

## Environment Variables Reference

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
FRONTEND_URL=https://your-vercel-app.vercel.app,http://localhost:3000
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-render-backend.onrender.com
```

## Testing URLs
- Backend API: `https://your-backend.onrender.com/api/auth/me`
- Frontend App: `https://your-frontend.vercel.app`

## Troubleshooting
- If CORS errors: Check FRONTEND_URL includes your Vercel domain
- If database errors: Verify MongoDB connection string and IP whitelist
- If build fails: Check Node.js version compatibility
- If 404 on refresh: Vercel routing should handle SPAs automatically
