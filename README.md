# 🩺 Medscan AI - Blood Test Analysis Platform

An AI-powered platform for analyzing blood test reports using advanced machine learning and natural language processing.

## ✨ Features

- 🤖 **AI-Powered Analysis**: Advanced OpenAI GPT-4 analysis of blood test results
- 📊 **Comprehensive Reports**: Detailed health insights and recommendations
- 🔐 **Secure Authentication**: JWT-based user authentication system
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔑 **User-Controlled API Keys**: Users provide their own OpenAI API keys for security
- 📄 **Multiple File Formats**: Supports PDF, JPG, and PNG uploads
- 💾 **Report History**: Track and manage your health reports over time
- 🎯 **Personalized Insights**: Tailored recommendations based on your results

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- OpenAI API key (users provide their own)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/medscan-ai.git
   cd medscan-ai
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI and JWT secret
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env if needed
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Deploy to Vercel (Recommended)

This application is optimized for Vercel deployment with both frontend and backend.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/medscan-ai)

#### Manual Deployment

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings (see DEPLOYMENT.md)
   - Add environment variables
   - Deploy

3. **Deploy via CLI**:
   ```bash
   npm install -g vercel
   npm run deploy
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📁 Project Structure

```
medscan-ai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── ai/            # AI processing services
│   │   └── config/        # Configuration files
│   ├── uploads/           # File upload directory
│   └── package.json
├── vercel.json            # Vercel deployment config
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Tesseract.js** - OCR text extraction

### AI & Processing
- **OpenAI GPT-4** - Advanced language model for analysis
- **PDF Parse** - PDF text extraction
- **Image OCR** - Text extraction from images

### Deployment
- **Vercel** - Serverless deployment platform
- **MongoDB Atlas** - Cloud database hosting

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medscan-ai
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
MAX_FILE_SIZE=10485760
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api  # For development only
VITE_APP_NAME=Medscan AI
```

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions
- **API Key Management**: Users control their own OpenAI API keys
- **File Validation**: Strict file type and size validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Sanitization**: Protection against injection attacks
- **Rate Limiting**: API rate limiting for abuse prevention

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Blood Test Endpoints
- `POST /api/blood-test/upload` - Upload blood test file
- `GET /api/blood-test/reports` - Get user's reports
- `GET /api/blood-test/reports/:id` - Get specific report
- `GET /api/blood-test/reports/:id/analysis` - Get analysis results
- `GET /api/blood-test/dashboard` - Get dashboard statistics

### Health Check
- `GET /api/health` - API health status

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Manual Testing
1. Register a new account
2. Configure OpenAI API key
3. Upload a blood test report (PDF/JPG/PNG)
4. Wait for AI analysis completion
5. Review generated insights and recommendations

Made with ❤️ by the Medscan AI Team 
