# Task Manager - Deployment Guide

## Quick Deployment Links

### Backend Deployment Options

1. **Heroku** (Recommended for beginners)
   - Create account at https://heroku.com
   - Install Heroku CLI
   - Run: `heroku create your-app-name-backend`
   - Set environment variables and deploy

2. **Render** (Free tier with automatic deploys)
   - Create account at https://render.com
   - Connect your GitHub repository
   - Use the provided `render.yaml` configuration

3. **Railway** (Modern platform)
   - Create account at https://railway.app
   - Connect GitHub and deploy

### Frontend Deployment Options

1. **Vercel** (Recommended for React apps)
   - Create account at https://vercel.com
   - Connect your GitHub repository
   - Automatic deployments on push

2. **Netlify** (Great for static sites)
   - Create account at https://netlify.com
   - Drag and drop build folder or connect GitHub

3. **GitHub Pages** (Free with GitHub)
   - Enable GitHub Pages in repository settings
   - Use GitHub Actions for automatic deployment

## Environment Variables Needed

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=your_frontend_domain
```

### Frontend (.env.production)
```
REACT_APP_API_URL=your_backend_domain/api
```

## Database Setup

1. **MongoDB Atlas** (Free cloud database)
   - Create account at https://mongodb.com/atlas
   - Create new cluster (free tier available)
   - Get connection string
   - Add to MONGODB_URI environment variable

## Step-by-Step Heroku + Vercel Deployment

### 1. Deploy Backend to Heroku

```bash
# In backend folder
heroku login
heroku create your-app-name-backend
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_32_char_secret_key
heroku config:set JWT_EXPIRE=7d
heroku config:set NODE_ENV=production
git add .
git commit -m "Deploy backend"
git push heroku main
```

### 2. Deploy Frontend to Vercel

```bash
# In frontend folder
npm install -g vercel
vercel login
vercel --prod
# Follow prompts and set REACT_APP_API_URL to your Heroku backend URL
```

## Testing Your Deployment

1. **Backend Health Check**
   - Visit: `your-backend-url/api/health`
   - Should return: `{"message": "Task Manager API is running!"}`

2. **Frontend Check**
   - Visit your frontend URL
   - Try registering a new account
   - Create and manage tasks

## Common Issues & Solutions

### CORS Errors
- Ensure FRONTEND_URL is set correctly in backend
- Check that your frontend URL matches exactly

### Database Connection
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for all IPs)
- Check connection string format
- Ensure database user has read/write permissions

### JWT Issues
- JWT_SECRET must be at least 32 characters
- Same secret must be used consistently

### Build Failures
- Check all dependencies are in package.json
- Verify Node.js version compatibility
- Review build logs for specific errors

## Security Notes

- Never commit .env files to version control
- Use strong, unique JWT_SECRET
- Enable MongoDB Atlas network security
- Consider rate limiting for production
- Use HTTPS for all deployments

## Monitoring & Maintenance

- Set up error logging (e.g., Sentry)
- Monitor database usage
- Regular security updates
- Backup strategies for production data
