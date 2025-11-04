# 🚀 Quick Start Guide - DXTalent Authentication

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js v18+ installed (`node --version`)
- ✅ MongoDB installed and running
- ✅ Gmail account for email verification
- ✅ (Optional) Google Cloud project for OAuth

## 5-Minute Setup

### Step 1: Environment Configuration

**Backend (.env)**

```bash
cd server
cp .env.example .env
```

Update these critical values in `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/dxtalent
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
JWT_ACCESS_SECRET=generate_random_32_char_string
JWT_REFRESH_SECRET=generate_different_random_32_char_string
```

**Frontend (.env)**

```bash
cd ../client
cp .env.example .env
```

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-client-id (optional)
```

### Step 2: Start MongoDB

**Windows:**

```bash
# Start MongoDB service
net start MongoDB

# OR run mongod directly
mongod --dbpath C:\data\db
```

**macOS/Linux:**

```bash
# Start MongoDB service
sudo systemctl start mongodb

# OR
brew services start mongodb-community
```

### Step 3: Start Backend Server

```bash
cd server
npm run dev
```

Expected output:

```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📝 Environment: development
🌐 Frontend URL: http://localhost:5173
```

### Step 4: Start Frontend

Open a new terminal:

```bash
cd client
npm run dev
```

Expected output:

```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 5: Test the Application

1. Open browser: `http://localhost:5173`
2. Click "Get Started" or go to `/auth`
3. Register a new account
4. Check your email for verification link
5. Verify email and login
6. Access your profile at `/profile`

## 📧 Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Other (Custom name)"
5. Name it "DXTalent"
6. Copy the 16-character password
7. Paste in `EMAIL_PASSWORD` in `.env`

## 🔐 Google OAuth Setup (Optional)

1. Go to https://console.cloud.google.com/
2. Create new project "DXTalent"
3. Enable Google+ API
4. Create OAuth 2.0 Credentials
5. Add authorized URIs:
   - `http://localhost:5173`
   - `http://localhost:5173/auth`
6. Copy Client ID to both `.env` files

## 🧪 Testing with Postman

1. Import `DXTalent-API.postman_collection.json`
2. The collection has all endpoints pre-configured
3. Start with "Register User"
4. Then "Login" (tokens auto-saved)
5. Try "Get Current User" to test authentication

## 🐛 Common Issues

### "Cannot connect to MongoDB"

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### "Email sending failed"

- Verify Gmail App Password is correct
- Check 2FA is enabled on Google account
- Try with a different Gmail account

### "Module not found" errors

```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install
```

### Port already in use

```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows
```

## 📱 Test User Accounts

Create test accounts with these roles:

**Learner Account:**

```json
{
  "username": "learner123",
  "email": "learner@test.com",
  "password": "Test123456",
  "role": "user"
}
```

**Recruiter Account:**

```json
{
  "username": "recruiter123",
  "email": "recruiter@test.com",
  "password": "Test123456",
  "role": "recruiter"
}
```

## 🎯 Next Steps

Once everything is running:

1. ✅ Test user registration
2. ✅ Verify email verification flow
3. ✅ Test login with credentials
4. ✅ Test Google OAuth (if configured)
5. ✅ Test protected routes
6. ✅ Test logout functionality
7. ✅ Import and test Postman collection
8. ✅ Test password reset flow
9. ✅ Test rate limiting (try 6 failed logins)
10. ✅ Create an admin user and test role changes

## 💡 Tips

- Backend logs show all requests and errors
- Use Chrome DevTools Network tab to debug frontend
- Check MongoDB Compass to view database records
- Refresh tokens are valid for 7 days
- Access tokens expire in 15 minutes
- Email verification tokens don't expire (but should in production)

## 🎉 Success Checklist

- [ ] MongoDB connected
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can register new user
- [ ] Email verification received
- [ ] Can login with credentials
- [ ] Can access profile page
- [ ] Can logout successfully
- [ ] Postman collection working

## 📞 Need Help?

- Check the main `README.md` for detailed documentation
- Review server logs for error messages
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

**Ready to start? Run the servers and visit http://localhost:5173 🚀**
