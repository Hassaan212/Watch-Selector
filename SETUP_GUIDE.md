# Quick Setup Guide 🚀

Follow these steps to get Watch Picker up and running.

## Step 1: Install Dependencies

```bash
cd watch-picker
npm install
```

## Step 2: Create Firebase Project

1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `watch-picker` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 3: Enable Firestore

1. In Firebase Console, click **"Firestore Database"** in left menu
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose your preferred location
5. Click **"Enable"**

## Step 4: Enable Storage

1. Click **"Storage"** in left menu
2. Click **"Get started"**
3. Click **"Next"** (keep default rules)
4. Choose same location as Firestore
5. Click **"Done"**

## Step 5: Get Firebase Config

1. Click the ⚙️ (Settings) icon → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **`</>`** (Web) icon
4. Register app name: `watch-picker`
5. **Copy the firebaseConfig object** - you'll need these values!

Example config you'll see:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "watch-picker-xxxxx.firebaseapp.com",
  projectId: "watch-picker-xxxxx",
  storageBucket: "watch-picker-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 6: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and paste your Firebase values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=watch-picker-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=watch-picker-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=watch-picker-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

NEXT_PUBLIC_ADMIN_PASSWORD=mySecurePassword123
```

## Step 7: Update Firestore Security Rules

1. In Firebase Console → **Firestore Database** → **Rules** tab
2. Replace the rules with:

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

3. Click **"Publish"**

## Step 8: Update Storage Security Rules

1. In Firebase Console → **Storage** → **Rules** tab
2. Replace the rules with:

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

3. Click **"Publish"**

## Step 9: Run the App

```bash
npm run dev
```

Open http://localhost:3000

## Step 10: Add Your First Watch

1. Go to http://localhost:3000/admin
2. Enter your admin password (from `.env.local`)
3. Click **"Manage Watches"** tab
4. Click **"Add Watch"**
5. Fill in:
   - Brand: `Rolex`
   - Model: `Submariner`
   - Description: `Iconic dive watch with timeless design`
   - Image: Upload a photo or paste URL
6. Click **"Add Watch"**

## Step 11: Test Voting

1. Go to http://localhost:3000
2. Select a watch
3. Click **"Submit My Choice"**
4. You should see the success screen!
5. Go back to `/admin` to see the vote recorded

## 🎉 Success!

Your Watch Picker app is now fully set up!

---

## Next Steps

### Add More Watches
Use the admin dashboard to add more luxury watches:
- Rolex Daytona
- Patek Philippe Nautilus
- Audemars Piguet Royal Oak
- Omega Speedmaster
- Cartier Santos

### Share the Link
Send `https://your-domain.com/` to your friends!

### Deploy to Production
See [README.md](./README.md) for deployment instructions.

---

## Troubleshooting

**Problem: "Firebase config not found"**
- Solution: Check `.env.local` exists and has correct values
- Restart dev server after changing `.env.local`

**Problem: "Permission denied" in Firestore**
- Solution: Double-check security rules are published
- Make sure rules match exactly as shown in Step 7 & 8

**Problem: Can't upload images**
- Solution: Verify Storage is enabled and rules are correct
- Check browser console for specific errors

**Problem: Admin password not working**
- Solution: Check `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`
- Make sure there are no extra spaces

**Problem: Votes not showing in real-time**
- Solution: Check browser console for Firebase errors
- Verify Firestore rules allow submissions creation

---

Need more help? Check the full [README.md](./README.md) or open an issue!
