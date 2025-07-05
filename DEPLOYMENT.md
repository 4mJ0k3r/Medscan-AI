# 🚀 Medscan AI - Vercel Deployment Guide

This guide will help you deploy the Medscan AI application to Vercel with both frontend and backend.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB database at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **GitHub Repository**: Push your code to GitHub
4. **Vercel CLI** (optional): `npm i -g vercel`

## 🗄️ Database Setup

### 1. MongoDB Atlas Configuration

1. Create a new MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for serverless functions
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/medscan-ai`

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (monorepo setup)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install && cd ../backend && npm install`

3. **Environment Variables**:
   Add these in Vercel dashboard → Settings → Environment Variables:

   ```bash
   # Backend Environment Variables
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medscan-ai
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   MAX_FILE_SIZE=10485760
   ```

4. **Deploy**: Click "Deploy" and wait for completion

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add NODE_ENV
   vercel env add FRONTEND_URL
   vercel env add MAX_FILE_SIZE
   ```

## ⚙️ Configuration Details

### Frontend Configuration
- **Framework**: React + Vite
- **Build Output**: `frontend/dist`
- **Routing**: SPA with client-side routing
- **API Calls**: Relative URLs in production (`/api/*`)

### Backend Configuration
- **Runtime**: Node.js serverless functions
- **Entry Point**: `backend/server.js`
- **File Uploads**: Uses `/tmp` directory in serverless environment
- **Database**: MongoDB Atlas with connection pooling
- **Timeout**: 30 seconds for analysis functions

### API Routes
All API routes are accessible under `/api/*`:
- `/api/auth/*` - Authentication
- `/api/blood-test/*` - Blood test analysis
- `/api/user/*` - User management
- `/api/health-facts/*` - Health facts
- `/api/health` - Health check

## 🔐 Environment Variables Reference

### Required Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `super-secret-jwt-key-for-production-use` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10485760` (10MB) |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (not used in serverless) | `5000` |

## 🧪 Testing Deployment

### 1. Health Check
Visit: `https://your-app.vercel.app/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Medscan AI API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Frontend Test
1. Visit your app URL
2. Register a new account
3. Configure OpenAI API key
4. Upload a test blood report
5. Verify analysis works

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs in Vercel dashboard

2. **Database Connection Issues**:
   - Verify MongoDB URI is correct
   - Check IP whitelist settings (use 0.0.0.0/0)
   - Ensure database user has proper permissions

3. **File Upload Issues**:
   - File uploads use `/tmp` directory in serverless
   - Files are temporary and cleaned up automatically
   - Large files may timeout (adjust function timeout)

4. **API Timeout Issues**:
   - OCR processing can take time
   - Function timeout is set to 30 seconds
   - Consider upgrading Vercel plan for longer timeouts

5. **CORS Issues**:
   - Ensure `FRONTEND_URL` matches your actual domain
   - Check if API calls use relative URLs in production

### Debug Steps

1. **Check Function Logs**:
   - Go to Vercel Dashboard → Functions
   - Click on function to see logs

2. **Test API Endpoints**:
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

3. **Check Environment Variables**:
   - Verify all required variables are set
   - Check for typos in variable names

## 📊 Performance Optimization

### Frontend Optimizations
- ✅ Code splitting implemented
- ✅ Vendor chunks separated
- ✅ Source maps disabled in production
- ✅ Asset optimization via Vite

### Backend Optimizations
- ✅ MongoDB connection pooling
- ✅ Increased timeout for AI processing
- ✅ Efficient file handling in serverless
- ✅ Error handling and logging

## 🔄 Updates and Maintenance

### Deploying Updates
1. Push changes to your main branch
2. Vercel will automatically deploy
3. Monitor deployment in dashboard

### Environment Variable Updates
```bash
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```

### Database Migrations
- MongoDB is schema-less
- Application handles schema evolution
- No manual migrations needed

## 📞 Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connectivity
5. Review this deployment guide

## 🎉 Success!

Your Medscan AI application should now be live at:
`https://your-app-name.vercel.app`

Features available:
- ✅ User registration and authentication
- ✅ OpenAI API key management
- ✅ Blood test file uploads (PDF, JPG, PNG)
- ✅ AI-powered analysis
- ✅ Health insights and recommendations
- ✅ Report management and history
- ✅ Responsive design for all devices 