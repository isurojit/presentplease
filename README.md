# 🟢 PresentPlease — Setup Guide

**PresentPlease** is a full-stack attendance tracking app built with **React + Node.js/Express + MongoDB + Firebase Auth**.

---

## 📁 Project Structure

```
presentplease/
├── package.json            ← root (runs both client + server together)
├── client/                 ← React frontend
│   ├── public/index.html
│   ├── .env                ← Firebase config (fill this in)
│   └── src/
│       ├── App.js / App.css
│       ├── firebase/config.js
│       ├── context/AuthContext.js
│       ├── utils/api.js
│       ├── pages/
│       │   ├── LoginPage.js
│       │   └── Dashboard.js
│       └── components/
│           ├── ClockWidget.js
│           ├── AttendanceTable.js
│           ├── AttendanceCalendar.js
│           └── StatsGrid.js
└── server/                 ← Express backend
    ├── index.js
    ├── firebase.js
    ├── .env                ← MongoDB URI + Firebase Admin (fill this in)
    ├── models/
    │   ├── Attendance.js
    │   └── User.js
    ├── controllers/
    │   └── attendanceController.js
    ├── middleware/
    │   └── auth.js
    └── routes/
        ├── attendance.js
        └── user.js
```

---

## ✅ Prerequisites

Install these before starting:

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community  
  OR use **MongoDB Atlas** (free cloud) → https://www.mongodb.com/atlas
- A **Firebase** project (free) → https://console.firebase.google.com

---

## 🔥 Step 1: Set Up Firebase

### 1.1 Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → Name it `presentplease` → Continue
3. Disable Google Analytics (optional) → **Create project**

### 1.2 Enable Authentication

1. In the Firebase console, click **Authentication** (left sidebar)
2. Click **"Get started"**
3. Under **Sign-in method**, enable:
   - ✅ **Email/Password**
   - ✅ **Google**

### 1.3 Get Frontend Config (for React)

1. In Firebase console → **Project settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **"</>"** (Web app)
3. Register the app, name it `presentplease-web`
4. Copy the `firebaseConfig` values

Fill in `client/.env`:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=presentplease-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=presentplease-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=presentplease-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abcdef
REACT_APP_API_URL=http://localhost:5000/api
```

### 1.4 Get Service Account (for Node.js server)

1. Firebase console → **Project settings** → **Service accounts** tab
2. Click **"Generate new private key"** → Download the JSON file
3. Open the JSON and copy the values

Fill in `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/presentplease
CLIENT_URL=http://localhost:3000

FIREBASE_PROJECT_ID=presentplease-xxxxx
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@presentplease.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgk...\n-----END PRIVATE KEY-----\n"
```

> ⚠️ The private key must be in double quotes and have `\n` for newlines (not actual line breaks).

---

## 🍃 Step 2: Set Up MongoDB

### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start it: `mongod` (or it runs as a service)
3. Use: `MONGO_URI=mongodb://localhost:27017/presentplease`

### Option B: MongoDB Atlas (Free Cloud)

1. Go to https://www.mongodb.com/atlas → Create free account
2. Create a **free M0 cluster**
3. Under **Database Access** → Add a user with password
4. Under **Network Access** → Allow IP `0.0.0.0/0` (or your IP)
5. Click **Connect** → **Connect your application** → Copy the URI
6. Replace `<password>` in the URI with your DB user password
7. Use: `MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/presentplease`

---

## 📦 Step 3: Install Dependencies

From the project root (`presentplease/`):

```bash
# Install root tools
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

---

## 🚀 Step 4: Run the App

From the project root:

```bash
npm run dev
```

This runs both:
- **Backend** at → http://localhost:5000
- **Frontend** at → http://localhost:3000

Open your browser and go to **http://localhost:3000** 🎉

---

## 🏗️ Features

| Feature | Description |
|---|---|
| 🔐 Login / Sign up | Email/Password + Google OAuth via Firebase |
| ⏩ Clock In | One-click clock-in with location type |
| ⏹ Clock Out | One-click clock-out, auto-calculates hours |
| 📍 Location | In Office / Outside Office / Remote |
| 📊 Stats | Monthly summary (days present, hours, office vs remote) |
| 📋 Table | Full attendance log with month navigation |
| 📅 Calendar | Visual monthly calendar with color-coded dots |
| 🔒 Auth Guard | All API routes protected with Firebase JWT tokens |
| 💾 Persistence | All data stored in MongoDB, synced to user UID |

---

## 🌐 API Endpoints

All routes require `Authorization: Bearer <firebase-token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/sync` | Sync Firebase user to MongoDB |
| GET | `/api/user/profile` | Get user profile |
| POST | `/api/attendance/clock-in` | Clock in (with locationType) |
| POST | `/api/attendance/clock-out` | Clock out |
| GET | `/api/attendance/today` | Get today's record |
| GET | `/api/attendance/month?year=&month=` | Get records by month |
| GET | `/api/attendance/all?page=&limit=` | Get all records (paginated) |

---

## 🚢 Deployment

### Frontend (Vercel or Netlify)

1. Build: `cd client && npm run build`
2. Deploy the `client/build/` folder
3. Set environment variables in Vercel/Netlify dashboard

### Backend (Railway, Render, or Heroku)

1. Deploy the `server/` folder
2. Set all `server/.env` variables in the platform dashboard
3. Use MongoDB Atlas URI for production

### Update `client/.env` for production:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

---

## 🔧 Troubleshooting

**"Firebase token invalid"** → Make sure `FIREBASE_PRIVATE_KEY` has `\n` not real newlines  
**"MongoDB connection failed"** → Check `MONGO_URI`, ensure MongoDB is running  
**"CORS error"** → Check `CLIENT_URL` in `server/.env` matches your frontend URL  
**Google sign-in popup blocked** → Allow popups in browser for localhost  
**"Already clocked in"** → Each user can only clock in once per day; refresh the page  

---

Built with ❤️ using React, Express, MongoDB, and Firebase.
