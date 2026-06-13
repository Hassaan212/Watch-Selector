# Firebase Setup - Step by Step 🔥

This guide shows you **exactly** where to find each Firebase credential.

## Overview

You need **6 Firebase values** + **1 admin password** to run Watch Picker locally.

---

## Step 1: Create Firebase Project (2 minutes)

### 1.1 Go to Firebase Console
🔗 **https://console.firebase.google.com/**

### 1.2 Create New Project
1. Click **"Add project"** (or **"Create a project"** if it's your first)
2. Enter project name: `watch-picker-dev` (or any name you like)
3. Click **"Continue"**
4. **Disable Google Analytics** (toggle OFF) - not needed for this project
5. Click **"Create project"**
6. Wait 30-60 seconds
7. Click **"Continue"**

✅ You now have a Firebase project!

---

## Step 2: Enable Firestore Database (1 minute)

### 2.1 Open Firestore
In the left sidebar, find and click:
```
🗄️ Firestore Database
```

### 2.2 Create Database
1. Click the **"Create database"** button
2. **Select mode**: Choose **"Start in production mode"** (we'll add rules next)
3. **Select location**: Choose the closest to you:
   - `us-central` (Iowa) - USA
   - `europe-west` (Belgium) - Europe
   - `asia-southeast1` (Singapore) - Asia
4. Click **"Enable"**
5. Wait 30 seconds

✅ Firestore is ready!

---

## Step 3: Enable Firebase Storage (1 minute)

### 3.1 Open Storage
In the left sidebar, click:
```
🗂️ Storage
```

### 3.2 Get Started
1. Click **"Get started"**
2. Click **"Next"** (keep default security rules)
3. **Select location**: Use the **same location** as Firestore
4. Click **"Done"**

✅ Storage is ready!

---

## Step 4: Get Firebase Credentials (3 minutes)

This is where you get the 6 values for `.env.local`

### 4.1 Open Project Settings
1. Click the **⚙️ (gear icon)** next to "Project Overview" in top-left
2. Click **"Project settings"**

### 4.2 Register Web App
Scroll down to **"Your apps"** section (near bottom of page)

**If you see "There are no apps in your project":**
1. Click the **`</>`** icon (Web platform icon)
2. Enter app nickname: `watch-picker-web`
3. ❌ **UN-check** "Also set up Firebase Hosting" (not needed)
4. Click **"Register app"**
5. You'll see a code block with `firebaseConfig`
6. Click **"Continue to console"**

**If you already have a web app:**
- Just scroll down to see existing apps

### 4.3 View Config
In the "Your apps" section, you'll see your web app:

1. Look for the section labeled **"SDK setup and configuration"**
2. Select **"Config"** (not "npm")
3. You'll see a JavaScript object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "watch-picker-dev-xxxxx.firebaseapp.com",
  projectId: "watch-picker-dev-xxxxx",
  storageBucket: "watch-picker-dev-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012"
};
```

### 4.4 Copy Values to .env.local

Open your `.env.local` file and replace the values:

| Firebase Config | .env.local Variable |
|----------------|---------------------|
| `apiKey` | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `authDomain` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| `storageBucket` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `NEXT_PUBLIC_FIREBASE_APP_ID` |

**Example `.env.local` with real values:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=watch-picker-dev-a1b2c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=watch-picker-dev-a1b2c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=watch-picker-dev-a1b2c.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012

NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

✅ All credentials are set!

---

## Step 5: Set Security Rules (2 minutes)

These rules control who can read/write your data.

### 5.1 Firestore Rules

1. Go to **Firestore Database** (left sidebar)
2. Click the **"Rules"** tab (top menu)
3. **Delete everything** in the editor
4. **Paste this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Watches collection - anyone can read, no one can write directly
    match /watches/{watchId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Submissions collection - anyone can create, no one can read/update/delete
    match /submissions/{submissionId} {
      allow read: if false;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

5. Click **"Publish"**
6. Confirm by clicking **"Publish"** again

✅ Firestore rules are live!

### 5.2 Storage Rules

1. Go to **Storage** (left sidebar)
2. Click the **"Rules"** tab (top menu)
3. **Delete everything** in the editor
4. **Paste this:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Watches images - anyone can read, no one can write directly
    match /watches/{fileName} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

5. Click **"Publish"**
6. Confirm by clicking **"Publish"** again

✅ Storage rules are live!

---

## Step 6: Test Your Setup (2 minutes)

### 6.1 Start Development Server

```bash
npm run dev
```

### 6.2 Check for Errors

Look at the terminal output. You should see:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

**If you see Firebase errors**, check:
- All 6 Firebase values are correctly copied
- No extra spaces or quotes in `.env.local`
- You saved the `.env.local` file
- You restarted the dev server after editing

### 6.3 Open in Browser

Go to: **http://localhost:3000**

You should see:
```
Help me settle a debate 😄
Which watch would you wear?

No watches available yet.
```

✅ Firebase is connected! (No watches yet - we'll add them next)

---

## Step 7: Add Your First Watch (2 minutes)

### 7.1 Go to Admin Dashboard

Open: **http://localhost:3000/admin**

### 7.2 Login
- Enter password: `admin123` (or whatever you set in `.env.local`)
- Click **"Login"**

### 7.3 Add a Watch
1. Click **"Manage Watches"** tab (top)
2. Click **"Add Watch"** button
3. Fill in the form:
   - **Brand**: `Rolex`
   - **Model**: `Submariner`
   - **Description**: `Iconic dive watch with timeless design`
   - **Image URL**: `https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80`
4. Click **"Add Watch"**

✅ Your first watch is added!

### 7.4 View on Main Page
Go back to: **http://localhost:3000**

You should now see the Rolex Submariner card!

---

## 🎉 Success!

Your Watch Picker is now fully set up and working locally!

### What You Can Do Now:

1. **Add more watches** via `/admin` → Manage Watches
2. **Test voting** by selecting a watch and submitting
3. **View dashboard** to see real-time vote updates
4. **Open in incognito** to test multiple votes

---

## 🚨 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Check `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
- Make sure there are no spaces or quotes around the value

### Error: "Missing or insufficient permissions"
- Firestore rules not published correctly
- Go back to Step 5.1 and re-publish rules
- Wait 30 seconds and try again

### Error: "Firebase: Firebase App named '[DEFAULT]' already exists"
- This is usually fine, just refresh the page
- If it persists, restart dev server

### Can't login to admin
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`
- Make sure password matches exactly (case-sensitive)
- Clear browser cache and try again

### Images not loading
- Check image URL starts with `https://` (not `http://`)
- Try the Unsplash URL provided above
- Check browser console (F12) for CORS errors

---

## 📝 Quick Reference

### Where to Find Things in Firebase Console:

| What | Where |
|------|-------|
| **Firestore data** | Firestore Database → Data tab |
| **Firestore rules** | Firestore Database → Rules tab |
| **Storage files** | Storage → Files tab |
| **Storage rules** | Storage → Rules tab |
| **Project settings** | ⚙️ gear icon → Project settings |
| **Firebase config** | Project settings → Your apps (scroll down) |
| **Usage stats** | Usage tab (left sidebar) |

### Firebase Console Link:
🔗 **https://console.firebase.google.com/project/YOUR_PROJECT_ID**

Replace `YOUR_PROJECT_ID` with your actual project ID from `.env.local`

---

## 🆘 Still Stuck?

1. ✅ Check that all 6 Firebase values are in `.env.local`
2. ✅ Verify rules are published (Step 5)
3. ✅ Restart dev server: `Ctrl+C` then `npm run dev`
4. ✅ Clear browser cache: `Ctrl+Shift+Delete`
5. ✅ Try incognito mode
6. ✅ Check browser console (F12) for errors
7. ✅ Read [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🎯 Next Steps

- ✨ Add more watches (Omega, Patek Philippe, etc.)
- 📊 Test the voting and dashboard
- 🚀 When ready, deploy to production: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Happy building! 🚀**
