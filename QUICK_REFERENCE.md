# Quick Reference Card 📋

Quick commands and URLs for Watch Picker.

## 🚀 Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check code quality

# Data
npm run seed         # Add 6 sample watches to Firestore

# Deployment
vercel --prod        # Deploy to Vercel
netlify deploy       # Deploy to Netlify
```

## 🔗 URLs

### Local Development
- **User Voting**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

### Production (after deployment)
- **User Voting**: https://your-domain.vercel.app
- **Admin Dashboard**: https://your-domain.vercel.app/admin

## 🔑 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_PASSWORD=
```

## 🔥 Firebase Console Links

- **Main Console**: https://console.firebase.google.com/
- **Firestore**: Project → Firestore Database
- **Storage**: Project → Storage
- **Rules**: In each service, click "Rules" tab
- **Settings**: Click ⚙️ gear icon

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main voting page |
| `app/admin/page.tsx` | Admin dashboard |
| `lib/firebase.ts` | Firebase config |
| `lib/watches.ts` | Database operations |
| `types/index.ts` | TypeScript types |
| `.env.local` | Your configuration (git-ignored) |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Storage security rules |

## 🎨 Design Tokens

```css
/* Colors */
Primary:      #F59E0B   /* amber-500 */
Background:   #09090B   /* zinc-950 */
Secondary:    #18181B   /* zinc-900 */
Border:       #27272A   /* zinc-800 */
Text:         #FFFFFF   /* white */
Muted:        #A1A1AA   /* zinc-400 */

/* Typography */
Font: Inter (Google Fonts)
Sizes: text-sm, text-base, text-lg, text-xl, text-2xl, text-4xl, text-6xl

/* Spacing */
Gap: gap-4, gap-6, gap-8
Padding: p-4, p-6, p-8
Margin: mb-4, mb-6, mb-8
```

## 🐛 Quick Debugging

```bash
# Check Node version (need 18+)
node --version

# Check if Firebase variables loaded
npm run dev
# Look for Firebase errors in terminal

# Clear browser data
# Chrome: Ctrl+Shift+Delete
# Then restart dev server

# Check Firestore data
# Go to Firebase Console → Firestore Database
```

## 📊 Data Structure

### Watch Object
```typescript
{
  id: string
  brand: string
  model: string
  image: string
  description?: string
}
```

### Submission Object
```typescript
{
  id: string
  watchId: string
  watchBrand: string
  watchModel: string
  sessionId: string
  nickname?: string
  timestamp: Timestamp
}
```

## 🔒 Security Rules Template

### Firestore
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

### Storage
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

## 🎯 Common Tasks

### Add a Watch Manually
```typescript
// In Firebase Console → Firestore → watches collection
{
  brand: "Rolex",
  model: "Submariner",
  image: "https://...",
  description: "Iconic dive watch"
}
```

### Clear Votes (for testing)
```typescript
// In Firebase Console → Firestore
// Delete all documents in "submissions" collection
```

### Reset User Vote
```javascript
// In browser console (F12)
localStorage.clear()
// Then refresh page
```

### Export All Data
1. Go to `/admin`
2. Click "Export CSV"
3. File downloads: `watch-picker-results-YYYY-MM-DD.csv`

## 📱 Browser DevTools

### Check LocalStorage
```javascript
// Console (F12)
localStorage.getItem('watch_picker_session_id')
localStorage.getItem('watch_picker_submitted')
```

### Check Firebase Connection
```javascript
// Console (F12)
// Should log Firebase app details
console.log('Firebase loaded:', typeof firebase !== 'undefined')
```

### Monitor Network Requests
1. Press F12
2. Go to "Network" tab
3. Submit a vote
4. Look for Firestore API calls

## 🚨 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Can't login to admin | Check `.env.local` password, restart server |
| Images not loading | Use HTTPS URLs, check CORS |
| Votes not updating | Check Firestore rules, refresh page |
| Build fails | Run `npm install`, check console errors |
| Port 3000 busy | Use `PORT=3001 npm run dev` |

## 📚 Documentation Files

- **Getting Started**: [GETTING_STARTED.md](./GETTING_STARTED.md) - 15 min setup
- **Full README**: [README.md](./README.md) - Complete documentation
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Go to production
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix issues
- **Features**: [FEATURES.md](./FEATURES.md) - What's included
- **Summary**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Technical overview

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel Deploy](https://vercel.com/docs)

## 💡 Pro Tips

1. **Test locally first**: Always test changes with `npm run dev` before deploying
2. **Use incognito for testing**: Test votes in incognito to bypass localStorage
3. **Monitor Firebase usage**: Check Firebase Console → Usage tab
4. **Backup data regularly**: Export CSV from admin dashboard
5. **Keep passwords secure**: Never commit `.env.local` to git
6. **Use sample images**: Unsplash provides free watch images
7. **Check mobile view**: Use Chrome DevTools (F12) → Toggle device toolbar

---

**🎯 Most Used Commands**

```bash
npm run dev              # Start coding
npm run seed             # Add sample data
http://localhost:3000    # View site
/admin                   # Manage watches
```

**Keep this card handy while developing!** 📌
