# Health Insights Backend API

A comprehensive backend API for blood test analysis using AI-powered insights. This application processes blood test reports, extracts data using OCR, and provides detailed health analysis using OpenAI's language models.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **File Upload**: Support for PDF, JPG, PNG blood test reports
- **OCR Processing**: Extract text from blood test images and PDFs using Tesseract.js
- **AI Analysis**: Intelligent blood test analysis using OpenAI GPT models
- **Health Insights**: Personalized health recommendations and risk assessments
- **Dashboard**: Comprehensive user dashboard with statistics and reports
- **Secure Storage**: Encrypted file storage with user access controls

## 🛠️ Technology Stack

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs password hashing
- **File Processing**: Multer for uploads, Tesseract.js for OCR
- **AI Integration**: LangChain with OpenAI GPT-4o models
- **Validation**: Express-validator for request validation
- **PDF Processing**: pdf-parse for PDF text extraction

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- OpenAI API key
- Sufficient disk space for file uploads

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   # Database
   MONGODB_URI=mongodb://localhost:27017/health-insights

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # OpenAI Configuration
   OPENAI_API_KEY=your-openai-api-key-here

   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MongoDB connection
│   │   ├── multer.js    # File upload configuration
│   │   └── openai.js    # OpenAI client setup
│   ├── controllers/     # Route controllers
│   │   ├── authController.js
│   │   ├── bloodTestController.js
│   │   └── userController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # Authentication middleware
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/          # Database models
│   │   ├── User.js
│   │   └── BloodTest.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── bloodTest.js
│   │   └── user.js
│   ├── services/        # Business logic
│   │   └── bloodTestService.js
│   ├── utils/           # Utility functions
│   │   ├── fileUtils.js
│   │   └── responseUtils.js
│   └── ai/              # AI-related services
│       ├── nodes/       # AI workflow nodes
│       ├── prompts/     # AI prompts
│       ├── workflows/   # AI workflows
│       └── services/    # AI services
│           ├── ocrService.js
│           └── analysisService.js
├── uploads/             # File storage
├── .env                 # Environment variables
├── .gitignore
├── server.js            # Main application entry
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Blood Test Management
- `POST /api/blood-test/upload` - Upload blood test file
- `GET /api/blood-test/reports` - Get user's blood tests
- `GET /api/blood-test/reports/:id` - Get specific blood test
- `PUT /api/blood-test/reports/:id` - Update blood test
- `DELETE /api/blood-test/reports/:id` - Delete blood test
- `GET /api/blood-test/reports/:id/analysis` - Get analysis
- `POST /api/blood-test/reports/:id/reprocess` - Reprocess report
- `GET /api/blood-test/dashboard` - Dashboard statistics

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/avatar` - Upload avatar
- `GET /api/user/stats` - Get user statistics

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📤 File Upload

Supported file formats:
- **Images**: JPG, JPEG, PNG (max 10MB)
- **Documents**: PDF (max 10MB)

Upload endpoint: `POST /api/blood-test/upload`

## 🤖 AI Processing Workflow

1. **File Upload**: User uploads blood test report
2. **OCR Processing**: Extract text using Tesseract.js (images) or pdf-parse (PDFs)
3. **Content Validation**: Verify the file contains blood test data
4. **AI Analysis**: Process extracted text with OpenAI GPT-4o
5. **Result Storage**: Save analysis results to database
6. **Insights Generation**: Create personalized health insights

## 📊 Response Format

All API responses follow this structure:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {...},
  "errors": [...] // Only present for validation errors
}
```

## 🔧 Error Handling

The API includes comprehensive error handling:
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db/health-insights
JWT_SECRET=your-production-secret-key
OPENAI_API_KEY=your-openai-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# API testing with curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token expiration
- Input validation and sanitization
- File type validation
- Rate limiting (recommended for production)
- CORS configuration
- Error message sanitization

## 📈 Performance Considerations

- Database indexing for efficient queries
- File size limitations
- OCR processing optimization
- AI API rate limiting
- Background processing for heavy operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📝 Changelog

### v1.0.0
- Initial release
- User authentication system
- Blood test upload and processing
- AI-powered analysis
- Dashboard and statistics
- File management system 