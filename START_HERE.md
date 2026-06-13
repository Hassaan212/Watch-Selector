# 🚀 START HERE - Watch Picker Setup

Welcome! This guide will get you testing locally in **15 minutes**.

---

## What You Need

✅ **Node.js 18+** - Check: `node --version`  
✅ **npm** - Check: `npm --version`  
✅ **Google Account** - For Firebase (free)  
✅ **10-15 minutes** - That's it!

---

## Quick Start (15 minutes)

### 1️⃣ Install Dependencies (2 min)

```bash
cd watch-picker
npm install
```

Wait for packages to install...

### 2️⃣ Set Up Firebase (8 min)

**🔥 Follow this guide step-by-step:**

📖 **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** ← Open this file!

It shows you:
- How to create Firebase project (2 min)
- Enable Firestore and Storage (2 min)
- Where to find your 6 credentials (3 min)
- How to set security rules (2 min)

**Visual guide available:** [FIREBASE_VISUAL_GUIDE.txt](./FIREBASE_VISUAL_GUIDE.txt)

### 3️⃣ Configure Environment (2 min)

Your `.env.local` file is already created! Just need to fill in values:

1. Open `.env.local` in your editor
2. Replace these values from Firebase Console:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# This one you can keep as-is for testing:
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 4️⃣ Start Development Server (1 min)

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

### 5️⃣ Add Your First Watch (2 min)

1. Open: **http://localhost:3000/admin**
2. Login with password: `admin123`
3. Click "Manage Watches" tab
4. Click "Add Watch" button
5. Fill in:
   - Brand: `Rolex`
   - Model: `Submariner`
   - Image URL: `https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80`
6. Click "Add Watch"

### 6️⃣ Test Voting!

1. Go to: **http://localhost:3000**
2. See your Rolex card! 🎉
3. Click to select it
4. Click "Submit My Choice"
5. See success screen ✅

---

## 🎉 You're Done!

Your Watch Picker is working locally!

---

## What's Next?

### Test Everything (optional but recommended)
📋 **[LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)** - Complete test checklist

### Deploy to Production
🚀 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Go live with Vercel (10 min)

### Customize
✨ **[FEATURES.md](./FEATURES.md)** - See what you can customize

---

## Helpful Resources

| Document | Purpose | When to Use |
|----------|---------|-------------|
| 📖 **[README.md](./README.md)** | Complete documentation | Reference |
| 🔥 **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** | Detailed Firebase guide | Setup |
| 🧪 **[LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md)** | Test everything | Before deploy |
| 🚀 **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Go to production | When ready |
| 🐛 **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Fix issues | When stuck |
| ⚡ **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Quick commands | Daily use |
| 📋 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Technical details | Understanding |

---

## Quick Commands

```bash
# Start development
npm run dev

# Add sample watches (6 watches automatically)
npm run seed

# Build for production
npm run build

# Open in browser
# http://localhost:3000          ← Main page
# http://localhost:3000/admin    ← Admin dashboard
```

---

## Common Issues

### "Module not found"
```bash
npm install
```

### "Firebase error"
- Check `.env.local` has all 6 Firebase values
- Restart dev server: `Ctrl+C` then `npm run dev`

### "Permission denied"
- Check Firestore rules are published
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) Step 5

### Admin password doesn't work
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`
- Make sure it matches (case-sensitive!)

### Images don't load
- Use HTTPS URLs (not HTTP)
- Try the Unsplash URL provided above

**More help:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Project Structure

```
watch-picker/
├── app/
│   ├── page.tsx              ← Main voting page
│   ├── admin/page.tsx        ← Admin dashboard
│   └── globals.css           ← Styles
├── components/
│   ├── WatchCard.tsx         ← Watch display card
│   └── admin/                ← Admin components
├── lib/
│   ├── firebase.ts           ← Firebase config
│   └── watches.ts            ← Database operations
├── types/
│   └── index.ts              ← TypeScript types
├── .env.local                ← Your config (EDIT THIS!)
└── Documentation files       ← Guides like this one
```

---

## Support

1. ✅ Read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) carefully
2. ✅ Check browser console (F12) for errors
3. ✅ Try [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
4. ✅ Verify all environment variables are set
5. ✅ Restart dev server after changes

---

## Tips

💡 **Use incognito mode** to test multiple votes  
💡 **Check browser console** (F12) for errors  
💡 **Clear localStorage** to reset votes: `localStorage.clear()`  
💡 **Use sample images** from Unsplash for testing  
💡 **Admin password** can be changed in `.env.local`  

---

## Ready to Begin?

**👉 Next Step:** Open [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) and follow it step-by-step!

**Questions?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Good luck! 🚀**
