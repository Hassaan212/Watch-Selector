# Getting Started 🚀

Complete guide to get Watch Picker running in 15 minutes!

## Prerequisites

Before you begin, make sure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm or yarn package manager
- ✅ A Google account (for Firebase)
- ✅ Code editor (VS Code recommended)
- ✅ Git (optional, for version control)

Check your Node version:
```bash
node --version  # Should be v18.x or higher
npm --version   # Should be v8.x or higher
```

---

## Step 1: Install Project (2 minutes)

```bash
# Navigate to project directory
cd watch-picker

# Install all dependencies
npm install
```

**What gets installed:**
- Next.js, React, TypeScript
- Firebase SDK
- Tailwind CSS
- Framer Motion
- Lucide React icons

---

## Step 2: Create Firebase Project (3 minutes)

### 2.1 Create Project
1. Go to https://console.firebase.google.com/
2. Click **"Create a project"** (or **"Add project"**)
3. Enter project name: **watch-picker**
4. Disable Google Analytics (optional for this project)
5. Click **"Create project"**
6. Wait 30 seconds for project creation

### 2.2 Enable Firestore Database
1. In left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add rules next)
4. Select your location (choose closest to your users)
5. Click **"Enable"**

### 2.3 Enable Storage
1. In left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Keep default security rules
4. Use same location as Firestore
5. Click **"Done"**

---

## Step 3: Get Firebase Configuration (2 minutes)

### 3.1 Register Web App
1. Click the ⚙️ gear icon → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click the **`</>`** icon (Add web app)
4. Enter app nickname: **watch-picker-web**
5. ✅ Check "Also set up Firebase Hosting" (optional)
6. Click **"Register app"**

### 3.2 Copy Configuration
You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "watch-picker-xxxxx.firebaseapp.com",
  projectId: "watch-picker-xxxxx",
  storageBucket: "watch-picker-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**KEEP THIS WINDOW OPEN** - you'll need these values!

---

## Step 4: Configure Environment (3 minutes)

### 4.1 Create Environment File
```bash
# Copy the example file
cp .env.local.example .env.local

# Or on Windows CMD:
copy .env.local.example .env.local
```

### 4.2 Edit Environment File
Open `.env.local` in your code editor and paste your Firebase values:

```env
# Firebase Configuration (from Step 3)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=watch-picker-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=watch-picker-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=watch-picker-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Admin Password (create your own secure password)
NEXT_PUBLIC_ADMIN_PASSWORD=MySecurePassword123!
```

**⚠️ Important:**
- Don't use quotes around values
- No spaces before or after `=`
- Change the admin password to something secure!

---

## Step 5: Set Up Firebase Rules (3 minutes)

### 5.1 Firestore Security Rules
1. Go to Firebase Console → **Firestore Database**
2. Click **"Rules"** tab
3. Replace everything with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /watches/{watchId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /submissions/{submissionId} {
      allow read: if false;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

4. Click **"Publish"**

### 5.2 Storage Security Rules
1. Go to Firebase Console → **Storage**
2. Click **"Rules"** tab
3. Replace everything with this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /watches/{fileName} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

4. Click **"Publish"**

---

## Step 6: Start Development Server (1 minute)

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.x
- Local:        http://localhost:3000
- Ready in 2.3s
```

**🎉 Success!** Open http://localhost:3000 in your browser

---

## Step 7: Add Sample Watches (2 minutes)

You have two options:

### Option A: Use Admin Dashboard (Recommended for Beginners)
1. Go to http://localhost:3000/admin
2. Enter your admin password (from `.env.local`)
3. Click **"Manage Watches"** tab
4. Click **"Add Watch"** button
5. Fill in the form:
   - **Brand**: Rolex
   - **Model**: Submariner
   - **Description**: Iconic dive watch with timeless design
   - **Image URL**: `https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80`
6. Click **"Add Watch"**
7. Repeat for more watches!

### Option B: Use Seed Script (Advanced)
```bash
# This adds 6 sample watches automatically
npm run seed
```

**Sample Watches Included:**
- Rolex Submariner
- Omega Speedmaster Moonwatch
- Patek Philippe Nautilus
- Audemars Piguet Royal Oak
- Cartier Santos
- TAG Heuer Monaco

---

## Step 8: Test the App (3 minutes)

### 8.1 Test User Voting
1. Open http://localhost:3000
2. You should see: **"Help me settle a debate 😄"**
3. Browse the watch cards
4. Click to select one watch (it should highlight)
5. Click **"Submit My Choice"** button
6. See success screen ✅

### 8.2 Test Admin Dashboard
1. Go to http://localhost:3000/admin
2. Login with your password
3. You should see:
   - Total votes: 1
   - Most popular: Your selected watch
   - Rankings list
   - Vote chart
   - Your submission in "Recent Submissions"

### 8.3 Test Real-time Updates
1. Open two browser windows:
   - Window 1: http://localhost:3000/admin
   - Window 2: http://localhost:3000 (in incognito mode)
2. Submit a vote in Window 2
3. Watch Window 1 update instantly! ⚡

---

## 🎉 You're Done!

Your Watch Picker app is now fully functional!

---

## Next Steps

### Share with Friends
1. Keep dev server running (`npm run dev`)
2. Share your local URL: http://localhost:3000
3. Or deploy to production (see [DEPLOYMENT.md](./DEPLOYMENT.md))

### Customize
- **Add more watches**: Use admin dashboard
- **Change colors**: Edit Tailwind classes in components
- **Modify text**: Edit `app/page.tsx`
- **Add features**: Check [FEATURES.md](./FEATURES.md) for ideas

### Deploy to Production
See detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick Vercel deployment:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Add sample watches
npm run seed

# Check for errors
npm run lint
```

---

## Common Issues

### "Can't find module 'firebase'"
```bash
npm install
```

### "Permission denied" in browser
- Check Firestore rules are published
- Restart dev server

### Admin password doesn't work
- Check `.env.local` has correct password
- Restart dev server after changing `.env.local`

### Images not loading
- Check image URLs are valid HTTPS URLs
- Try the Unsplash URLs from seed script

**More help:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Resources

- 📖 [Full README](./README.md)
- 🔧 [Setup Guide](./SETUP_GUIDE.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🐛 [Troubleshooting](./TROUBLESHOOTING.md)
- ✨ [Features List](./FEATURES.md)

---

## Need Help?

1. Check documentation files in this repo
2. Look at browser console (F12) for errors
3. Verify all environment variables are set
4. Try in incognito mode
5. Open an issue on GitHub

---

**Happy building! 🚀**

Questions? Issues? Feedback? We'd love to hear from you!
