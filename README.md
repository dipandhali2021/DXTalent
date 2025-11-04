# DXTalent Authentication System

A complete JWT-based authentication system with Google OAuth, email verification, role-based access control, and security features.

## 🚀 Features

### Backend

- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ Google OAuth 2.0 Integration
- ✅ Email Verification (Magic Links)
- ✅ Password Reset Flow
- ✅ Role-Based Access Control (User, Recruiter, Admin)
- ✅ Rate Limiting (Login attempts, Registration, Password reset)
- ✅ Account Lockout (After 5 failed login attempts)
- ✅ Secure HTTP Headers (Helmet)
- ✅ CORS Protection
- ✅ Input Validation & Sanitization
- ✅ Multiple Device Login Support
- ✅ httpOnly Cookies for tokens

### Frontend

- ✅ React with TypeScript
- ✅ Authentication Context
- ✅ Protected Routes
- ✅ Google Sign-In Button
- ✅ Token Refresh Interceptor
- ✅ Beautiful UI with Shadcn/UI
- ✅ Form Validation
- ✅ Toast Notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Gmail account (for sending emails)
- Google OAuth Client ID (optional, for Google login)

## 🛠️ Installation

### 1. Clone the Repository

```bash
cd d:/client/project5
```

### 2. Backend Setup

```bash
cd server

# Install dependencies (already done)
npm install

# Configure environment variables
cp .env.example .env
```

Edit `server/.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/dxtalent

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=DXTalent <noreply@dxtalent.com>

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies (already done)
npm install

# Configure environment variables
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 📧 Gmail Setup for Email Verification

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security → App Passwords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this in `EMAIL_PASSWORD` in `.env`

## 🔐 Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:5173/auth`
7. Copy Client ID and Client Secret to `.env` files

## 🚀 Running the Application

### Start MongoDB (if running locally)

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongodb
```

### Start Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📝 API Endpoints

### Authentication

| Method | Endpoint                        | Description               | Auth Required |
| ------ | ------------------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/register`            | Register new user         | No            |
| POST   | `/api/auth/login`               | Login user                | No            |
| POST   | `/api/auth/google`              | Google OAuth              | No            |
| GET    | `/api/auth/verify/:token`       | Verify email              | No            |
| POST   | `/api/auth/resend-verification` | Resend verification email | No            |
| POST   | `/api/auth/refresh`             | Refresh access token      | No            |
| POST   | `/api/auth/logout`              | Logout user               | Yes           |
| GET    | `/api/auth/me`                  | Get current user          | Yes           |

### Password Management

| Method | Endpoint                    | Description            | Auth Required |
| ------ | --------------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/forgot-password` | Request password reset | No            |
| POST   | `/api/auth/reset-password`  | Reset password         | No            |

### Admin Operations

| Method | Endpoint                       | Description      | Auth Required | Role  |
| ------ | ------------------------------ | ---------------- | ------------- | ----- |
| PUT    | `/api/auth/users/:userId/role` | Update user role | Yes           | Admin |

## 🧪 Testing with Postman

Import the Postman collection: `DXTalent-API.postman_collection.json`

The collection includes:

- All API endpoints
- Example requests
- Auto-save access tokens
- Environment variables

## 🔒 Security Features

### Rate Limiting

- **Login**: 5 attempts per 10 minutes
- **Registration**: 3 attempts per hour
- **Password Reset**: 3 attempts per hour
- **Email Verification**: 5 attempts per hour

### Account Lockout

- Account locked for 10 minutes after 5 failed login attempts

### Token Security

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens stored in httpOnly cookies
- Automatic token refresh on expiry

### Password Requirements

- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## 👥 User Roles

### User (Learner)

- Default role for new registrations
- Access to learning features
- Can view own profile

### Recruiter

- Can post job listings (future feature)
- Access to candidate search (future feature)
- Enhanced profile features

### Admin

- Can change user roles
- Full system access
- User management capabilities

## 📱 Frontend Routes

| Route      | Description    | Protected                   |
| ---------- | -------------- | --------------------------- |
| `/`        | Home page      | No                          |
| `/auth`    | Login/Register | No (redirects if logged in) |
| `/profile` | User profile   | Yes                         |

## 🎨 UI Components

The frontend uses:

- **Shadcn/UI**: Modern component library
- **Tailwind CSS**: Utility-first CSS
- **Brutal Design**: Bold, playful design system
- **React Hook Form**: Form handling
- **Axios**: HTTP client with interceptors

## 🔧 Project Structure

```
project5/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── RefreshToken.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   ├── utils/
│   │   │   ├── email.js
│   │   │   ├── jwt.js
│   │   │   └── rateLimiter.js
│   │   ├── validators/
│   │   │   └── authValidators.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   ├── pages/
│   │   │   ├── Auth.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Index.tsx
│   │   └── App.tsx
│   ├── .env
│   └── package.json
└── DXTalent-API.postman_collection.json
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Make sure MongoDB is running
mongod
```

### Email Not Sending

- Check Gmail credentials
- Verify App Password is correct
- Ensure 2FA is enabled on Google account

### Google OAuth Not Working

- Verify Client ID in both backend and frontend `.env`
- Check authorized redirect URIs in Google Console
- Ensure OAuth consent screen is configured

### CORS Errors

- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that credentials are included in axios requests

## 📦 Dependencies

### Backend

- express
- mongoose
- bcrypt
- jsonwebtoken
- cookie-parser
- cors
- helmet
- express-validator
- nodemailer
- rate-limiter-flexible
- dotenv

### Frontend

- react
- react-router-dom
- axios
- @react-oauth/google
- jwt-decode
- @tanstack/react-query
- tailwindcss
- shadcn/ui components

## 🚀 Deployment

### Backend (Railway/Render/Heroku)

1. Set all environment variables
2. Change `NODE_ENV` to `production`
3. Use MongoDB Atlas for database
4. Enable HTTPS

### Frontend (Vercel/Netlify)

1. Set `VITE_API_URL` to production API URL
2. Set `VITE_GOOGLE_CLIENT_ID`
3. Update Google OAuth authorized URIs

## 📄 License

MIT

## 👨‍💻 Author

DXTalent Team

## 🙏 Acknowledgments

- Shadcn/UI for the component library
- Google for OAuth integration
- MongoDB for database
- Express.js community

## 📞 Support

For issues and questions:

- Create an issue in the repository
- Contact: support@dxtalent.com

---

**Happy Coding! 🎉**
