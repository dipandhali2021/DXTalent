# 🎓 DXTalent - AI-Powered Learning Platform

<div align="center">

![DXTalent Banner](https://img.shields.io/badge/DXTalent-Learning_Platform-blue?style=for-the-badge)
[![Node](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Run in Postman](https://run.pstmn.io/button.svg)](docs/DXTalent_Complete_API_Collection.postman_collection.json) [![Figma Design](https://img.shields.io/badge/Figma-Design-black?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/zF0IwLYMCjo3JKKABGa11u/DXTalent?node-id=0-1&t=z5RlYbceR3jrwodc-1)

**A modern, gamified learning platform with AI-powered lesson generation, real-time leaderboards, and comprehensive progress tracking.**

[🚀 Live Demo](#) • [🎨 Figma Design](https://www.figma.com/design/zF0IwLYMCjo3JKKABGa11u/DXTalent?node-id=0-1&t=z5RlYbceR3jrwodc-1) • [� Postman Collection](docs/DXTalent_Complete_API_Collection.postman_collection.json)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Features Deep Dive](#-features-deep-dive)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

**DXTalent** is a comprehensive learning management system that combines AI-powered content generation with gamification elements to create an engaging educational experience. The platform serves three distinct user types: **Learners**, **Recruiters**, and **Admins**, each with specialized dashboards and features.

### 🎯 Mission

Democratize access to quality education through AI-generated personalized learning paths while connecting top talent with recruiters.

### ✨ What Makes DXTalent Unique?

- 🤖 **AI-Powered Lesson Generation** using Google Gemini 2.0
- 🏆 **Gamification System** with XP, badges, leagues, and streaks
- 📊 **Real-time Leaderboards** with league progression
- 💼 **Talent Marketplace** connecting learners with recruiters
- 🎨 **Brutal Design** aesthetic with playful animations
- 🌍 **Multi-language Support** (English, Hindi, Japanese)

---

## 🚀 Key Features

### For Learners 🎓

#### 📚 Learning Management

- **50+ Pre-built Lessons** across multiple categories (Marketing, Development, Data, Business, Design)
- **AI Lesson Generation** - Create custom topics with 10 progressive lessons (Beginner → Advanced)
- **Smart Lesson Structure**:
  - Generate topic: 3 complete lessons + 7 placeholders (1 credit)
  - Generate individual lessons: 0.5 credit each
  - Progressive difficulty: Beginner (1-4) → Intermediate (5-7) → Advanced (8-10)
- **Interactive Tests** with 20 MCQ questions per lesson
- **AI-Powered Recommendations** for next best lesson
- **Continue Journey** - Smart algorithm picks up where you left off

#### 🎮 Gamification System

##### 🏅 Experience Points (XP)

```mermaid
graph LR
    A[Complete Lesson] --> B{First Time?}
    B -->|Yes| C[50-150 XP]
    B -->|No| D[10 XP]
    C --> E[Difficulty Multiplier]
    E --> F[Beginner: 50 XP]
    E --> G[Intermediate: 100 XP]
    E --> H[Advanced: 150 XP]
    F --> I[+ Streak Bonus]
    G --> I
    H --> I
    I --> J[Level Up!]
```

##### 🏆 League System (6 Tiers)

| League   | XP Required     | Color  | Emoji |
| -------- | --------------- | ------ | ----- |
| Bronze   | 0 - 999         | Amber  | 🥉    |
| Silver   | 1,000 - 2,999   | Gray   | 🥈    |
| Gold     | 3,000 - 5,999   | Yellow | 🥇    |
| Platinum | 6,000 - 9,999   | Blue   | 💎    |
| Diamond  | 10,000 - 14,999 | Cyan   | 💠    |
| Master   | 15,000+         | Purple | 👑    |

##### 🎖️ Badge System (20 Unique Badges)

**Badge Rarities:**

- 🔘 **Common** (Gray) - Easy to earn
- 🟢 **Uncommon** (Green) - Moderate difficulty
- 🔵 **Rare** (Blue) - Challenging
- 🟣 **Epic** (Purple) - Very difficult
- 🟡 **Legendary** (Gold) - Extremely rare

**Badge Categories:**

1. **Beginner Badges**: First Step (👣), Early Bird (🌅), Night Owl (🦉)
2. **Streak Badges**: Streak Starter (🔥), Week Warrior (⚔️), Unstoppable (🚀)
3. **Achievement Badges**: Perfect Score (💯), Speed Demon (⚡), Knowledge Seeker (📚), Master Learner (🎓)
4. **Challenge Badges**: Challenge Accepted (🎯), Challenge Master (🏆)
5. **XP Badges**: XP Novice (⭐), XP Expert (🌟), XP Legend (✨)
6. **Social Badges**: Top 10 (🥇), League Champion (👑)
7. **Skill Badges**: Skill Explorer (🧭), Polymath (🎨)
8. **Special Badges**: Comeback Kid (💪)

##### 🔥 Streak System

```mermaid
graph TD
    A[Complete Lesson] --> B{Lesson Today?}
    B -->|First Today| C{Yesterday Active?}
    B -->|Already Done| D[Activity Count +1]
    C -->|Yes| E[Streak +1]
    C -->|No| F{First Ever?}
    F -->|Yes| G[Streak = 1]
    F -->|No| H[Streak Reset to 1]
    E --> I[Check Longest]
    G --> I
    I --> J[Update Longest if Higher]
    J --> K[Streak Bonus XP: 1.0x - 1.5x]
```

**Streak Bonuses:**

- 3 days: 1.05x XP multiplier
- 7 days: 1.10x XP multiplier
- 14 days: 1.20x XP multiplier
- 30 days: 1.30x XP multiplier
- 60+ days: 1.50x XP multiplier

##### 📊 Leveling System (100 Levels)

- **Level 1-10**: Novice Tier (100-1750 XP)
- **Level 11-20**: Apprentice Tier (2100-5700 XP)
- **Level 21-30**: Journeyman Tier (6300-40800 XP)
- **Level 31-50**: Expert Tier (45000-162500 XP)
- **Level 51-75**: Master Tier (171000-606500 XP)
- **Level 76-100**: Legend Tier (625500-1401500 XP)

Each level has a unique title (e.g., "Novice Explorer", "Code Ninja", "Senior Developer", "DXTalent Legend")

#### 📈 Progress Tracking

- **Activity Heatmap** - Monthly calendar view of daily lessons
- **Completion Statistics** - Track lessons completed per category
- **Performance Analytics** - Average accuracy, best scores
- **XP History** - Detailed log of all XP gains with source tracking
- **Skill Mastery** - Category-based proficiency metrics

### For Recruiters 💼

#### 🔍 Talent Discovery

- **Advanced Search & Filters**:
  - Filter by league (Bronze to Master)
  - Search by skills/categories
  - Sort by XP, level, or streak
  - Minimum level requirements
- **Top Candidates View** with performance metrics
- **Candidate Profiles** with:
  - Complete learning history
  - Skill breakdown by category
  - Achievement badges
  - Accuracy & completion rates
  - Contact information (email visible to recruiters)

#### 📊 Recruiter Dashboard

- **Total Users & Active Learners** statistics
- **League Distribution** analytics
- **Popular Categories** trending skills
- **Weekly Activity** charts
- **Trending Skills** identification
- **Real-time Leaderboard** access

### For Admins 👑

#### 🎛️ Platform Management

- **Dashboard Analytics**:
  - Total users, active users, revenue
  - User growth trends (6-month charts)
  - Revenue analytics
  - Top performing lessons
  - Retention & satisfaction metrics

#### 👥 User Management

- **Complete User Directory** with search & filters
- **Role Management**: Assign user/recruiter/admin roles
- **Account Actions**: Suspend/activate users
- **User Details**: Full profile access
- **Subscription Management**: View user plans

#### 💳 Payment Management

- **All Transactions** view with filtering
- **Payment Statistics** - Total revenue, successful/failed payments
- **Transaction Details** - User, amount, plan, date
- **Refund Processing** capabilities
- **Payment Status Tracking**

---

## 🛠️ Tech Stack

### Frontend

```mermaid
graph TB
    subgraph "Core Framework"
        A[React 18+]
        B[TypeScript 5+]
        C[Vite 5+]
    end

    subgraph "UI & Styling"
        D[shadcn/ui]
        E[Tailwind CSS]
        F[Radix UI]
        G[Framer Motion]
    end

    subgraph "Routing & Data"
        H[React Router v6]
        I[TanStack Query]
        J[Axios]
    end

    subgraph "Authentication & Charts"
        K[react-oauth/google]
        L[Recharts]
    end

    A --> B
    A --> C
    B --> D
    B --> E
    D --> F
    B --> G
    B --> H
    B --> I
    I --> J
    B --> K
    B --> L
```

**Core Technologies:**

- ⚛️ **React 18.3** - UI framework
- 📘 **TypeScript 5.5** - Type safety
- ⚡ **Vite 5.4** - Build tool
- 🎨 **Tailwind CSS 3.4** - Utility-first CSS
- 🧩 **shadcn/ui** - Component library
- 🎭 **Framer Motion** - Animations
- 🔄 **TanStack Query** - Data fetching
- 📍 **React Router v6** - Navigation

### Backend

```mermaid
graph TB
    subgraph "Runtime & Framework"
        A[Node.js 20+]
        B[Express 5]
    end

    subgraph "Database"
        C[MongoDB 8]
        H[Mongoose 8]
    end

    subgraph "Authentication"
        D[JWT Auth]
        I[bcrypt]
        J[jsonwebtoken]
        E[Google OAuth]
        K[passport]
    end

    subgraph "External Services"
        F[Stripe Payments]
        G[Gemini AI]
        L[google/genai]
        M[Nodemailer]
    end

    subgraph "Security & Validation"
        N[express-validator]
        O[rate-limiter-flexible]
        P[Helmet.js]
        Q[CORS]
    end

    A --> B
    B --> C
    C --> H
    B --> D
    D --> I
    D --> J
    B --> E
    E --> K
    B --> F
    B --> G
    G --> L
    B --> M
    B --> N
    B --> O
    B --> P
    B --> Q
```

**Core Technologies:**

- 🟢 **Node.js 20+** - Runtime
- 🚂 **Express.js 5** - Web framework
- 🍃 **MongoDB 8** - Database
- 🔐 **JWT + OAuth** - Authentication
- 💳 **Stripe** - Payment processing
- 🤖 **Google Gemini 2.0** - AI generation
- 📧 **Nodemailer** - Email service
- 🛡️ **Helmet.js** - Security headers
- ⏱️ **Rate Limiter** - DDoS protection

### DevOps & Tools

- 🔄 **Git** - Version control
- 📮 **Postman** - API testing
- 🌐 **Vercel** - Frontend hosting
- ☁️ **MongoDB Atlas** - Database hosting

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React SPA]
        B[TypeScript]
        C[Tailwind CSS]
    end

    subgraph "API Gateway"
        D[Express Server]
        E[Rate Limiter]
        F[CORS]
        G[Helmet Security]
    end

    subgraph "Authentication Layer"
        H[JWT Middleware]
        I[Google OAuth]
        J[Role-Based Access]
    end

    subgraph "Business Logic"
        K[Auth Controller]
        L[Lesson Controller]
        M[Subscription Controller]
        N[Admin Controller]
        O[Recruiter Controller]
        P[Leaderboard Controller]
        Q[Badge Controller]
        R[Challenge Controller]
    end

    subgraph "AI Services"
        S[Gemini AI]
        T[Lesson Generator]
        U[Test Generator]
        V[Recommendation Engine]
        W[Topic Categorizer]
    end

    subgraph "External Services"
        X[Stripe API]
        Y[Gmail SMTP]
        Z[Google OAuth API]
    end

    subgraph "Data Layer"
        AA[(MongoDB)]
        AB[User Model]
        AC[Lesson Model]
        AD[LessonCompletion Model]
        AE[Payment Model]
        AF[Test Model]
        AG[RefreshToken Model]
    end

    A --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
    J --> K
    J --> L
    J --> M
    J --> N
    J --> O
    J --> P
    J --> Q
    J --> R
    L --> T
    L --> U
    L --> V
    T --> S
    U --> S
    V --> S
    W --> S
    M --> X
    K --> Y
    I --> Z
    K --> AA
    L --> AA
    M --> AA
    N --> AA
    O --> AA
    P --> AA
    Q --> AA
    R --> AA
    AA --> AB
    AA --> AC
    AA --> AD
    AA --> AE
    AA --> AF
    AA --> AG
```

---

## 🚦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js 20+** ([Download](https://nodejs.org/))
- ✅ **MongoDB 6+** ([Download](https://www.mongodb.com/try/download/community))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **Gmail Account** (for email verification)
- ✅ **Stripe Account** (for payments)
- ✅ **Google Cloud Project** (for OAuth)

### Quick Start (5 Minutes)

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dipandhali2021/DXTalent.git
cd DXTalent
```

#### 2️⃣ Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

#### 3️⃣ Environment Configuration

**Backend (.env)**

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/dxtalent

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# JWT Secrets (generate random 32-char strings)
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=DXTalent <your-email@gmail.com>

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_LEARNER=price_...
STRIPE_PRICE_RECRUITER=price_...
STRIPE_PRICE_ADDON=price_...

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Frontend (.env)**

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### 4️⃣ Start Development Servers

**Backend:**

```bash
cd server
npm run dev
```

Expected output:

```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
📝 Environment: development
🌐 Frontend URL: http://localhost:8080
```

**Frontend (new terminal):**

```bash
cd client
npm run dev
```

Expected output:

```
VITE v5.4.x ready in xxx ms
➜  Local:   http://localhost:8080/
```

#### 5️⃣ Access the Application

🌐 Open your browser and navigate to: `http://localhost:8080`

---

## 📚 Features Deep Dive

### 🔐 Authentication System

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant E as Email Service
    participant G as Google OAuth

    Note over U,G: Registration Flow
    U->>F: Submit registration form
    F->>B: POST /api/auth/register
    B->>D: Create user (unverified)
    B->>E: Send verification email
    E-->>U: Email with magic link
    B-->>F: Success response
    U->>F: Click verification link
    F->>B: GET /api/auth/verify/:token
    B->>D: Mark user as verified
    B->>E: Send welcome email
    B-->>F: Verification success
    F-->>U: Redirect to login

    Note over U,G: Login Flow
    U->>F: Submit credentials
    F->>B: POST /api/auth/login
    B->>D: Validate credentials
    B->>B: Generate JWT tokens
    B-->>F: Access + Refresh tokens
    F->>F: Store tokens
    F-->>U: Redirect to dashboard

    Note over U,G: Google OAuth Flow
    U->>F: Click "Sign in with Google"
    F->>G: Initiate OAuth
    G-->>U: Google sign-in
    U->>G: Authorize
    G-->>F: OAuth credential
    F->>B: POST /api/auth/google
    B->>D: Find or create user
    B->>B: Generate JWT tokens
    B-->>F: Access + Refresh tokens
    F-->>U: Redirect to dashboard
```

#### Features:

- ✅ **Email/Password Registration** with validation
- ✅ **Email Verification** via magic links (24-hour expiry)
- ✅ **Google OAuth 2.0** integration
- ✅ **JWT-based Authentication** (Access + Refresh tokens)
- ✅ **Password Reset Flow** with time-limited tokens
- ✅ **Multi-device Login** support
- ✅ **Account Lockout** after 5 failed attempts (10-minute lock)
- ✅ **Role-Based Access Control** (User, Recruiter, Admin)
- ✅ **Session Management** with automatic token refresh

#### Security Measures:

- 🔒 **bcrypt Password Hashing** (10 salt rounds)
- 🔒 **httpOnly Cookies** for token storage
- 🔒 **Rate Limiting** on auth endpoints
- 🔒 **CORS Protection** with origin whitelist
- 🔒 **Helmet.js** security headers
- 🔒 **Input Validation** with express-validator
- 🔒 **XSS Protection**
- 🔒 **SQL Injection Prevention**

### 🤖 AI Lesson Generation System

```mermaid
graph TD
    A[User Enters Topic] --> B[POST /api/lessons/generate]
    B --> C{Check Credits}
    C -->|Insufficient| D[Return Error]
    C -->|Sufficient| E[Gemini AI: Topic Categorization]
    E --> F[Determine Category & Metadata]
    F --> G[Gemini AI: Generate 10 Lesson Outlines]
    G --> H[Progressive Difficulty Assignment]
    H --> I[Lessons 1-4: Beginner]
    H --> J[Lessons 5-7: Intermediate]
    H --> K[Lessons 8-10: Advanced]
    I --> L[Gemini AI: Generate First 3 Full Lessons]
    J --> L
    L --> M[Create 7 Placeholder Lessons]
    M --> N[Save to Database]
    N --> O[Deduct 1 Credit]
    O --> P[Return Lessons to User]

    Q[User Clicks Placeholder] --> R[POST /api/lessons/:id/generate-content]
    R --> S{Check Credits}
    S -->|Insufficient| T[Return Error]
    S -->|Sufficient| U[Gemini AI: Generate Full Lesson]
    U --> V[Create 5 MCQ Questions]
    V --> W[Save to Database]
    W --> X[Deduct 0.5 Credit]
    X --> Y[Return Generated Lesson]
```

#### Lesson Generation Process:

**1. Topic Generation (1 Credit)**

```javascript
// Example: "Digital Marketing"
{
  topic: "Digital Marketing Fundamentals",
  lessons: [
    // 3 Complete Lessons (Ready to Take)
    { skillName: "Introduction to Digital Marketing", difficulty: "Beginner", questions: [...], isFullyGenerated: true },
    { skillName: "Social Media Marketing Basics", difficulty: "Beginner", questions: [...], isFullyGenerated: true },
    { skillName: "Content Marketing Strategy", difficulty: "Beginner", questions: [...], isFullyGenerated: true },

    // 7 Placeholder Lessons (Generate on Demand)
    { skillName: "SEO Fundamentals", difficulty: "Intermediate", placeholder: true },
    { skillName: "Email Marketing Campaigns", difficulty: "Intermediate", placeholder: true },
    { skillName: "PPC Advertising", difficulty: "Intermediate", placeholder: true },
    { skillName: "Analytics & Metrics", difficulty: "Advanced", placeholder: true },
    { skillName: "Conversion Optimization", difficulty: "Advanced", placeholder: true },
    { skillName: "Marketing Automation", difficulty: "Advanced", placeholder: true },
    { skillName: "Advanced Digital Strategy", difficulty: "Advanced", placeholder: true }
  ]
}
```

**2. Individual Lesson Generation (0.5 Credit)**

- Generates 5 multiple-choice questions
- Each question includes 4 options, correct answer index, explanation, and XP reward
- Updates placeholder to complete lesson

**3. Test Generation**

- First test per lesson: **FREE**
- Regenerate test (new questions): **0.5 Credit**
- 20 MCQ questions per test
- Pass threshold: 80% accuracy

#### AI Recommendation Engine:

```mermaid
graph LR
    A[User's Learning History] --> B[Gemini AI Analysis]
    C[Available Lessons] --> B
    D[User Stats: XP, Level] --> B
    B --> E[Recommendation Algorithm]
    E --> F[Factors Considered]
    F --> G[Completed Categories]
    F --> H[Difficulty Progression]
    F --> I[Knowledge Gaps]
    F --> J[Learning Patterns]
    G --> K[Best Next Lesson]
    H --> K
    I --> K
    J --> K
    K --> L[Reason + Estimated Time]
```

### 📊 Subscription & Credit System

#### Pricing Tiers:

| Plan            | Price     | AI Credits/Month | Addon Support   | Role      |
| --------------- | --------- | ---------------- | --------------- | --------- |
| **Learner**     | FREE      | 1 credit         | ❌              | User      |
| **Pro Learner** | $20/month | 5 credits        | ✅ (+3 for $10) | User      |
| **Recruiter**   | $50/month | N/A              | ❌              | Recruiter |

#### Credit Usage:

- 💳 **Generate Topic** (10 lessons): 1.0 credit
  - Gets 3 complete lessons + 7 placeholders
- 💳 **Generate Individual Lesson**: 0.5 credit
  - Converts placeholder to complete lesson
- 💳 **First Test per Lesson**: FREE
- 💳 **Regenerate Test** (new questions): 0.5 credit

#### Payment Flow:

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant S as Stripe
    participant D as Database

    U->>F: Click "Upgrade to Pro"
    F->>B: POST /api/subscriptions/checkout
    B->>S: Create Checkout Session
    S-->>B: Session URL
    B-->>F: Redirect URL
    F-->>U: Redirect to Stripe
    U->>S: Enter payment details
    S->>S: Process payment
    S->>B: Webhook: checkout.session.completed
    B->>D: Update user subscription
    B->>D: Update generation limits
    B->>D: Create payment record
    S-->>U: Redirect to success page
    U->>F: Return to platform
    F->>B: GET /api/subscriptions/status
    B-->>F: Updated subscription info
    F-->>U: Show Pro features
```

---

## � API Documentation

### Complete API Reference

For detailed API documentation including all endpoints, request/response examples, and authentication flows, see:

**[📖 Complete API Documentation](docs/API_DOCUMENTATION.md)**

### Quick Links

- **[Postman Collection](docs/DXTalent_Complete_API_Collection.postman_collection.json)** - Import into Postman for instant API testing
- **Base URL (Development):** `http://localhost:5000/api`
- **Base URL (Production):** `https://dxtalent-server.vercel.app/api`

### API Overview

The DXTalent API provides 77+ endpoints organized into 10 main categories:

| Category              | Endpoints | Description                                          |
| --------------------- | --------- | ---------------------------------------------------- |
| 🔐 **Authentication** | 14        | User registration, login, OAuth, password management |
| 📚 **Lessons**        | 18        | AI lesson generation, content management, tests      |
| 🏆 **Leaderboard**    | 5         | Global rankings, league stats, skill-based boards    |
| 🎯 **Challenges**     | 2         | Daily challenges and reward claiming                 |
| 🎖️ **Badges**         | 5         | Badge progress, claiming, and notifications          |
| 💼 **Recruiter**      | 4         | Talent discovery, trending skills, candidate search  |
| 💳 **Subscriptions**  | 5         | Stripe checkout, payment verification, status        |
| 🌱 **Seed**           | 2         | Default lesson seeding and data management           |
| 👨‍💼 **Admin**          | 17        | User management, analytics, payment processing       |
| ❤️ **Health Check**   | 2         | Server status and API information                    |

### Authentication Example

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
  }),
});

const { data } = await loginResponse.json();
const { accessToken, refreshToken } = data;

// 2. Use access token for API requests
const userResponse = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### Key Features

✅ **JWT Authentication** with access & refresh tokens  
✅ **Rate Limiting** to prevent abuse  
✅ **Input Validation** with detailed error messages  
✅ **Pagination** for large datasets  
✅ **Filtering & Sorting** on list endpoints  
✅ **Auto-save Tokens** in Postman collection  
✅ **Comprehensive Error Handling** with proper HTTP codes  

### Rate Limits

| Endpoint Type  | Limit   | Window |
| -------------- | ------- | ------ |
| Authentication | 5 req   | 15 min |
| Login          | 10 req  | 15 min |
| General API    | 100 req | 15 min |

---

## �🗄️ Database Schema

### Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Lesson : creates
    User ||--o{ LessonCompletion : completes
    User ||--o{ Test : takes
    User ||--o{ Payment : makes
    User ||--o{ RefreshToken : has
    User ||--o{ Badge : earns
    User ||--o{ XPHistory : accumulates
    Lesson ||--o{ LessonCompletion : "completed by"
    Lesson ||--o{ Test : "has"

    User {
        ObjectId _id PK
        String username UK
        String email UK
        String password
        String role
        String accountStatus
        String subscriptionType
        String stripeCustomerId
        String stripeSubscriptionId
        String subscriptionStatus
        Date subscriptionStartDate
        Date subscriptionEndDate
        Object generationLimits
        String googleId UK
        String profilePicture
        Boolean isEmailVerified
        String emailVerificationToken
        String passwordResetToken
        Date passwordResetExpires
        Number loginAttempts
        Date lockUntil
        Date lastLogin
        Object stats
        Map dailyActivity
        Array xpHistory
        Array badges
        Object badgeStats
        Date createdAt
        Date updatedAt
    }

    Lesson {
        ObjectId _id PK
        ObjectId userId FK
        String topic
        String skillName
        String skillIcon
        String category
        String difficulty
        String description
        String duration
        Number totalXP
        Array questions
        Boolean isFullyGenerated
        Boolean placeholder
        Boolean isDefault
        Date createdAt
        Date updatedAt
    }

    LessonCompletion {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId lessonId FK
        Number completionCount
        Date firstCompletionDate
        Date lastCompletionDate
        Object bestScore
        Array completions
        Date createdAt
        Date updatedAt
    }

    Test {
        ObjectId _id PK
        ObjectId lessonId FK
        ObjectId userId FK
        Array questions
        Number totalAttempts
        Object bestScore
        Array attempts
        Date createdAt
        Date updatedAt
    }

    Payment {
        ObjectId _id PK
        ObjectId userId FK
        Number amount
        String currency
        String paymentType
        String plan
        String role
        String status
        String paymentMethod
        String transactionId
        String description
        Object metadata
        Date refundedAt
        Date createdAt
        Date updatedAt
    }

    RefreshToken {
        ObjectId _id PK
        String token UK
        ObjectId userId FK
        Date expiresAt
        String deviceInfo
        String ipAddress
        Date createdAt
        Date updatedAt
    }

    Badge {
        String badgeId
        String name
        String description
        String emoji
        Number xpReward
        String rarity
        Object criteria
        Date earnedAt
        Boolean claimed
    }

    XPHistory {
        Number amount
        String source
        String description
        Date timestamp
    }
```

### Database Relationships Summary

| Relationship              | Type        | Description                                                   |
| ------------------------- | ----------- | ------------------------------------------------------------- |
| User → Lesson             | One-to-Many | A user can create multiple lessons (AI-generated or assigned) |
| User → LessonCompletion   | One-to-Many | A user can complete multiple lessons multiple times           |
| User → Test               | One-to-Many | A user can take multiple tests across different lessons       |
| User → Payment            | One-to-Many | A user can have multiple payment transactions                 |
| User → RefreshToken       | One-to-Many | A user can have multiple active sessions (devices)            |
| Lesson → LessonCompletion | One-to-Many | A lesson can be completed by multiple users                   |
| Lesson → Test             | One-to-Many | A lesson can have multiple test versions (regenerated)        |

### Indexes for Performance

```javascript
// User Collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ 'stats.xpPoints': -1 }); // Leaderboard queries
db.users.createIndex({ 'stats.league': 1 }); // League filtering
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });

// Lesson Collection
db.lessons.createIndex({ userId: 1, topic: 1 }); // User's lessons by topic
db.lessons.createIndex({ category: 1, difficulty: 1 }); // Filtering
db.lessons.createIndex({ isDefault: 1 }); // Pre-built lessons
db.lessons.createIndex({ userId: 1, isFullyGenerated: 1 }); // Available lessons

// LessonCompletion Collection
db.lessonCompletions.createIndex({ userId: 1, lessonId: 1 }, { unique: true });
db.lessonCompletions.createIndex({ userId: 1, lastCompletionDate: -1 }); // Recent activity
db.lessonCompletions.createIndex({ lessonId: 1 }); // Lesson stats

// Test Collection
db.tests.createIndex({ lessonId: 1, userId: 1 }, { unique: true });
db.tests.createIndex({ userId: 1 }); // User's tests

// Payment Collection
db.payments.createIndex({ user: 1, createdAt: -1 }); // User payment history
db.payments.createIndex({ status: 1 }); // Payment status queries
db.payments.createIndex({ transactionId: 1 }); // Stripe webhook lookup

// RefreshToken Collection
db.refreshTokens.createIndex({ token: 1 }, { unique: true });
db.refreshTokens.createIndex({ userId: 1 }); // User's sessions
db.refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
```

# 🎓 DXTalent - Part 2: Security, Deployment & Advanced Features

---

## 🔒 Security Features

### Authentication & Authorization

```mermaid
graph TB
    A[Request] --> B{Has Token?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D[Verify JWT]
    D -->|Invalid| E[401 Invalid Token]
    D -->|Expired| F[Try Refresh Token]
    D -->|Valid| G{Check Role}
    F -->|Success| G
    F -->|Failed| H[401 Session Expired]
    G -->|Authorized| I[Process Request]
    G -->|Forbidden| J[403 Forbidden]
```

#### Implemented Security Measures:

**1. Password Security**

- ✅ **bcrypt Hashing** (10 salt rounds)
- ✅ **Password Requirements**:
  - Minimum 6 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
- ✅ **Password History** - Cannot reuse recent passwords
- ✅ **Secure Password Reset** with time-limited tokens (15 minutes)

**2. Token Security**

- ✅ **Short-lived Access Tokens** (15 minutes)
- ✅ **Long-lived Refresh Tokens** (7 days)
- ✅ **httpOnly Cookies** - JavaScript cannot access
- ✅ **Secure Flag** in production
- ✅ **SameSite Strict** - CSRF protection
- ✅ **Token Rotation** on refresh
- ✅ **Device Tracking** for multi-device sessions

**3. Rate Limiting**

| Endpoint           | Limit        | Window     | Action on Exceed      |
| ------------------ | ------------ | ---------- | --------------------- |
| Login              | 5 attempts   | 10 minutes | Account locked        |
| Register           | 3 attempts   | 1 hour     | IP blocked            |
| Password Reset     | 3 attempts   | 1 hour     | IP blocked            |
| Email Verification | 5 attempts   | 1 hour     | Cooldown              |
| API Requests       | 100 requests | 15 minutes | 429 Too Many Requests |

**4. Account Protection**

```mermaid
graph LR
    A[Login Attempt] --> B{Correct Password?}
    B -->|No| C[Increment Attempts]
    C --> D{Attempts >= 5?}
    D -->|Yes| E[Lock Account 10 min]
    D -->|No| F[Allow Retry]
    B -->|Yes| G[Reset Attempts]
    G --> H[Login Success]
    E --> I[Return Locked Error]
```

**5. HTTP Security Headers (Helmet.js)**

- ✅ **X-Content-Type-Options**: nosniff
- ✅ **X-Frame-Options**: DENY
- ✅ **X-XSS-Protection**: 1; mode=block
- ✅ **Strict-Transport-Security**: max-age=31536000
- ✅ **Content-Security-Policy**: Configured for production
- ✅ **Referrer-Policy**: no-referrer

**6. Input Validation**

```javascript
// Example: Registration validation
{
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    alphanumeric: true
  },
  email: {
    required: true,
    isEmail: true,
    normalizeEmail: true
  },
  password: {
    required: true,
    minLength: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  }
}
```

**7. CORS Configuration**

```javascript
{
  origin: [
    'http://localhost:5173',
    'https://your-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

**8. Data Sanitization**

- ✅ **XSS Prevention** - HTML entity encoding
- ✅ **NoSQL Injection Prevention** - Query sanitization
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **Path Traversal Prevention**
- ✅ **Command Injection Prevention**

---

## 🚀 Deployment Guide

### Prerequisites for Production

- ✅ Domain name with SSL certificate
- ✅ MongoDB Atlas account (or self-hosted MongoDB)
- ✅ Vercel account (frontend) or similar
- ✅ Gmail account with App Password
- ✅ Stripe account with live keys
- ✅ Google Cloud project with OAuth credentials
- ✅ Gemini API key

### Frontend Deployment (Vercel)

#### 1. Prepare for Production

**Update environment variables in Vercel:**

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

**Build the application:**

```bash
cd client
npm run build
```

#### 2. Deploy to Vercel

**Option A: Vercel CLI**

```bash
npm install -g vercel
cd client
vercel login
vercel --prod
```

**Option B: GitHub Integration**

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables
5. Deploy

**vercel.json configuration:**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Database Setup (MongoDB Atlas)

#### 1. Create Cluster

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Set database username and password
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)

#### 2. Get Connection String

```
mongodb+srv://username:password@cluster.mongodb.net/dxtalent?retryWrites=true&w=majority
```

### Stripe Webhook Configuration

#### 1. Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://your-backend-api.com/api/subscriptions/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy webhook secret

#### 2. Test Webhook (Development)

```bash
# Install Stripe CLI
stripe login

# Forward webhook events to local server
stripe listen --forward-to localhost:5000/api/subscriptions/webhook

# Copy webhook secret to .env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### SSL Certificate Setup

**For Frontend (Vercel):**

- Automatic SSL via Let's Encrypt
- Custom domain SSL configured automatically

### Performance Optimization

#### Frontend Optimization

**1. Code Splitting**

```typescript
// Lazy load routes
const LearnerDashboard = lazy(() => import('./pages/LearnerDashboard'));
const Lesson = lazy(() => import('./pages/Lesson'));
```

**2. Image Optimization**

```typescript
// Use WebP format, lazy loading
<img src="/images/hero.webp" loading="lazy" alt="Hero" />
```

**3. Vite Build Optimization**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
  },
});
```

#### Backend Optimization

**1. Database Indexing**

```javascript
// Add indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.xpPoints': -1 });
userSchema.index({ 'stats.league': 1 });
lessonSchema.index({ userId: 1, category: 1 });
lessonSchema.index({ topic: 1 });
```

**2. Query Optimization**

```javascript
// Use lean() for read-only queries
const users = await User.find({ role: 'user' })
  .select('username stats.xpPoints stats.league')
  .lean(); // Returns plain JavaScript objects

// Use projection to limit fields
const lessons = await Lesson.find({ userId })
  .select('skillName category difficulty totalXP')
  .limit(50);
```

**3. Connection Pooling**

```javascript
// MongoDB connection with pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Monitoring & Logging

#### 1. Application Monitoring

**Install PM2 (Process Manager):**

```bash
npm install -g pm2

# Start application
pm2 start src/index.js --name dxtalent-api

# Monitor
pm2 monit

# View logs
pm2 logs

# Set up auto-restart on crash
pm2 startup
pm2 save
```

## 📊 Advanced Features

### Real-time Leaderboard System

```mermaid
graph TB
    A[User Completes Lesson] --> B[Update XP]
    B --> C[Recalculate Level]
    C --> D[Update League]
    D --> E{League Changed?}
    E -->|Yes| F[Trigger League Promotion]
    E -->|No| G[Update Leaderboard Cache]
    F --> G
    G --> H[Calculate Rank]
    H --> I[Check for Badges]
    I --> J{New Badges?}
    J -->|Yes| K[Award Badges]
    J -->|No| L[Update User Stats]
    K --> L
    L --> M[Broadcast to Leaderboard]
    M --> N[Update Frontend]
```

**League Calculation:**

```javascript
function calculateLeague(xp) {
  if (xp >= 15000) return 'master'; // 15k+
  if (xp >= 10000) return 'diamond'; // 10k-14.9k
  if (xp >= 6000) return 'platinum'; // 6k-9.9k
  if (xp >= 3000) return 'gold'; // 3k-5.9k
  if (xp >= 1000) return 'silver'; // 1k-2.9k
  return 'bronze'; // 0-999
}
```

**Promotion Detection:**

```javascript
// Check if user is close to promotion (within 500 XP)
const leagueThresholds = {
  bronze: 1000,
  silver: 3000,
  gold: 6000,
  platinum: 10000,
  diamond: 15000,
};

const nextThreshold = leagueThresholds[currentLeague];
if (currentXP >= nextThreshold - 500) {
  user.promotion = 'up'; // Show "Promoted" badge
}
```

### AI-Powered Features

#### 1. Smart Lesson Recommendation

**Algorithm Flow:**

```mermaid
graph TD
    A[Get User History] --> B[Analyze Completed Lessons]
    B --> C[Extract Patterns]
    C --> D[Categories Learned]
    C --> E[Difficulty Progression]
    C --> F[Knowledge Gaps]
    D --> G[Gemini AI Analysis]
    E --> G
    F --> G
    G --> H[Score Available Lessons]
    H --> I[Consider Difficulty Balance]
    I --> J[Factor in Time of Day]
    J --> K[Return Top Recommendation]
    K --> L[Include Reasoning]
```

#### 2. Dynamic Test Generation

**Features:**

- Generates 20 unique MCQ questions per test
- Varies question difficulty based on lesson level
- Includes detailed explanations for each answer
- First test is free, regeneration costs 0.5 credit

**Question Structure:**

```javascript
{
  question: "What is the Virtual DOM in React?",
  options: [
    "A lightweight copy of the actual DOM",
    "A database for storing component data",
    "A routing system for navigation",
    "A state management library"
  ],
  correctAnswer: 0,
  explanation: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize rendering by calculating the minimum number of changes needed to update the real DOM."
}
```

#### 3. Continue Journey Algorithm

**Smart Pick Logic:**

```javascript
async function getContinueJourney(userId) {
  // 1. Get last completed lesson
  const lastCompletion = await getLastCompletion(userId);

  if (!lastCompletion) {
    // No history - recommend beginner lesson
    return getRecommendedBeginnerLesson();
  }

  // 2. Find lessons in same topic
  const sameTopic = await Lesson.find({
    userId,
    topic: lastCompletion.lesson.topic,
    isFullyGenerated: true,
    _id: { $nin: completedLessonIds },
  });

  if (sameTopic.length > 0) {
    // Continue same topic
    return sameTopic[0]; // Next lesson in series
  }

  // 3. Find next difficulty in same category
  const nextDifficulty = getNextDifficulty(lastCompletion.lesson.difficulty);
  const nextLesson = await Lesson.findOne({
    userId,
    category: lastCompletion.lesson.category,
    difficulty: nextDifficulty,
    isFullyGenerated: true,
    _id: { $nin: completedLessonIds },
  });

  if (nextLesson) {
    return nextLesson;
  }

  // 4. Explore new category
  return getRecommendedNewCategory(userId);
}
```

### Activity Tracking & Streaks

**Daily Activity Heatmap:**

```mermaid
graph LR
    A[User Completes Lesson] --> B{First Lesson Today?}
    B -->|Yes| C[Check Yesterday]
    B -->|No| D[Increment Daily Count]
    C -->|Active| E[Streak +1]
    C -->|Not Active| F[Reset Streak to 1]
    E --> G[Update Longest Streak]
    F --> G
    D --> H[Update Heatmap]
    G --> H
    H --> I[Calculate Streak Bonus]
    I --> J[Apply to XP]
```

**Heatmap Data Structure:**

```javascript
// User.dailyActivity (Map)
{
  "2025-11-01": 3,  // 3 lessons completed
  "2025-11-02": 5,  // 5 lessons completed
  "2025-11-03": 2,  // 2 lessons completed
  // ...
}
```

**Streak Calculation:**

```javascript
function updateStreak(user, completionDate) {
  const today = getDateString(completionDate);
  const lastLesson = user.stats.lastLessonDate;

  // Increment today's count
  const currentCount = user.dailyActivity.get(today) || 0;
  user.dailyActivity.set(today, currentCount + 1);

  // Update streak (only on first lesson of the day)
  if (currentCount === 0) {
    if (!lastLesson) {
      // First lesson ever
      user.stats.currentStreak = 1;
    } else if (isYesterday(lastLesson)) {
      // Consecutive day
      user.stats.currentStreak += 1;
    } else if (!isToday(lastLesson)) {
      // Gap - reset streak
      user.stats.currentStreak = 1;
    }

    // Update longest streak
    if (user.stats.currentStreak > user.stats.longestStreak) {
      user.stats.longestStreak = user.stats.currentStreak;
    }
  }

  user.stats.lastLessonDate = completionDate;
  return user;
}
```

### Badge Award System

**Automatic Badge Checking:**

```mermaid
graph TD
    A[Lesson Completed] --> B[Check All Badge Criteria]
    B --> C{Lessons Completed}
    C -->|= 1| D[Award 'First Step']
    C -->|= 25| E[Award 'Knowledge Seeker']
    C -->|= 100| F[Award 'Master Learner']
    B --> G{Current Streak}
    G -->|= 3| H[Award 'Streak Starter']
    G -->|= 7| I[Award 'Week Warrior']
    G -->|= 30| J[Award 'Unstoppable']
    B --> K{Perfect Score?}
    K -->|Yes| L[Award 'Perfect Score']
    D --> M[Award Badge + XP]
    E --> M
    F --> M
    H --> M
    I --> M
    J --> M
    L --> M
    M --> N[Show Notification]
    N --> O[Update Profile]
```

**Badge Progress Tracking:**

```javascript
// Real-time progress for locked badges
{
  badge: {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 25 lessons',
    emoji: '📚',
    xpReward: 500,
    rarity: 'rare'
  },
  earned: false,
  progress: {
    current: 18,
    target: 25,
    percentage: 72
  }
}
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**

```bash
git clone https://github.com/yourusername/DXTalent.git
cd DXTalent
```

2. **Create a Branch**

```bash
git checkout -b feature/your-feature-name
```

3. **Make Changes**

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation

5. **Commit and Push**

```bash
git add .
git commit -m "feat: add amazing feature"
git push origin feature/your-feature-name
```

6. **Create Pull Request**

- Go to GitHub and create a PR
- Describe your changes
- Link related issues
- Wait for review

### Areas We Need Help With

- 🐛 **Bug Fixes** - Report and fix bugs
- ✨ **New Features** - Propose and implement features
- 📖 **Documentation** - Improve docs and guides
- 🎨 **UI/UX** - Design improvements
- 🧪 **Testing** - Add test coverage
- 🌍 **Internationalization** - Add language support
- ♿ **Accessibility** - Improve WCAG compliance
- 🚀 **Performance** - Optimize code

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 DXTalent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Google Gemini AI** - For powerful AI lesson generation
- **Stripe** - For secure payment processing
- **MongoDB Atlas** - For reliable database hosting
- **Vercel** - For seamless frontend deployment
- **shadcn/ui** - For beautiful UI components
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For utility-first styling

---

### Report Issues

Found a bug? Please report it:

1. Check if issue already exists
2. Create detailed bug report
3. Include steps to reproduce
4. Add screenshots if applicable

### Feature Requests

Have an idea? We'd love to hear it:

1. Search existing feature requests
2. Create new feature request
3. Describe the use case
4. Explain expected behavior

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅

- [x] Core authentication system
- [x] AI lesson generation
- [x] Gamification features
- [x] Leaderboard system
- [x] Subscription management
- [x] Admin dashboard
- [x] Recruiter features

### Phase 2 (Q1 2026) 🚧

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Live coding challenges
- [ ] Peer-to-peer learning
- [ ] Video lessons integration
- [ ] Certificate generation
- [ ] Advanced analytics

### Phase 3 (Q2 2026) 📅

- [ ] AI mentor chatbot
- [ ] Code playground
- [ ] Community forums
- [ ] Study groups
- [ ] Marketplace for courses
- [ ] Integration with LinkedIn
- [ ] Corporate training packages

### Phase 4 (Q3 2026) 🎯

- [ ] VR/AR learning experiences
- [ ] Blockchain certificates
- [ ] AI-powered career guidance
- [ ] Job matching algorithm
- [ ] Salary insights
- [ ] Interview preparation
- [ ] Global hackathons

---

## 📊 Project Statistics

```
Total Lines of Code:     ~50,000+
Backend Lines:           ~15,000
Frontend Lines:          ~35,000
Number of Components:    100+
Number of API Endpoints: 75+
Database Models:         7
Tests Written:           150+
Documentation Pages:     20+
```

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=dipandhali2021/DXTalent&type=Date)](https://star-history.com/#dipandhali2021/DXTalent&Date)

---

## 💡 Pro Tips

### For Developers

1. **Use the Postman Collection** - Import `docs/DXTalent-API.postman_collection.json` for API testing
2. **Enable MongoDB Logging** - Set `mongoose.set('debug', true)` to see queries
3. **Use Environment Variables** - Never commit sensitive data
4. **Test Webhooks Locally** - Use Stripe CLI for webhook testing
5. **Monitor Performance** - Use React DevTools and Chrome DevTools

### For Learners

1. **Complete Daily Lessons** - Build your streak for bonus XP
2. **Focus on Perfect Scores** - Unlock achievement badges
3. **Explore Different Categories** - Earn "Skill Explorer" badge
4. **Check AI Recommendations** - Get personalized learning paths
5. **Track Your Progress** - Use the activity heatmap

### For Recruiters

1. **Filter by League** - Focus on top performers
2. **Check Completion Rates** - Assess dedication
3. **Review Skill Breakdown** - Match job requirements
4. **Monitor Activity** - Find active learners
5. **Use Advanced Search** - Find exact skill sets

---

## 🎉 Thank You!

Thank you for checking out **DXTalent**! We hope this platform helps you on your learning journey or helps you find the perfect talent for your team.

<div align="center">

**Made with ❤️ by the DXTalent Team**

[⬆ Back to Top](#-dxtalent---ai-powered-learning-platform)

</div>
