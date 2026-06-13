# Troubleshooting Guide 🔧

Common issues and their solutions.

## Setup Issues

### ❌ "Module not found" errors

**Problem:** Missing dependencies after cloning.

**Solution:**
```bash
cd watch-picker
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Firebase config not found"

**Problem:** Environment variables not loaded.

**Solutions:**
1. Verify `.env.local` exists in root directory
2. Check all variables are set (no empty values)
3. Restart dev server after changing `.env.local`
```bash
# Stop server (Ctrl+C)
npm run dev
```

### ❌ Port 3000 already in use

**Problem:** Another process is using port 3000.

**Solution:**
```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

---

## Firebase Issues

### ❌ "Permission denied" in Firestore

**Problem:** Security rules blocking access.

**Symptoms:**
- Can't load watches
- Can't submit votes
- Console error: `PERMISSION_DENIED`

**Solution:**
1. Go to Firebase Console → Firestore → Rules
2. Verify rules match:
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
3. Click "Publish"
4. Wait 30 seconds for propagation

### ❌ "Firebase App not initialized"

**Problem:** Firebase config incorrect or missing.

**Solution:**
1. Check `.env.local` has all 6 Firebase variables
2. Verify values match Firebase Console
3. Check for typos (especially `NEXT_PUBLIC_` prefix)
4. Restart dev server

### ❌ Can't upload images

**Problem:** Storage not enabled or rules incorrect.

**Solution:**
1. Enable Storage in Firebase Console
2. Update Storage rules:
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
3. Publish rules
4. Clear browser cache

### ❌ "Quota exceeded" error

**Problem:** Free tier limits reached.

**Firebase Free Tier Limits:**
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 10 GB/month transfer

**Solution:**
1. Upgrade to Blaze (pay-as-you-go) plan
2. Or reduce usage:
   - Limit watch images size
   - Implement caching
   - Optimize queries

---

## Admin Dashboard Issues

### ❌ Admin password not working

**Problem:** Password doesn't match.

**Symptoms:**
- "Incorrect password" alert
- Can't access dashboard

**Solution:**
1. Check `.env.local`:
```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_password_here
```
2. Verify no spaces before/after password
3. Password is case-sensitive
4. Restart dev server after changing
5. Clear browser cache
6. Try incognito/private mode

### ❌ Votes not appearing in real-time

**Problem:** Firestore listener not working.

**Solution:**
1. Check browser console for errors
2. Verify Firestore rules allow submissions creation
3. Check network tab for websocket connection
4. Hard refresh page (Ctrl+Shift+R)
5. Check if multiple tabs are open (session conflict)

### ❌ Can't delete watches

**Problem:** Permissions or network issue.

**Solution:**
1. Check console for specific error
2. Verify logged into admin dashboard
3. Check Firebase connection
4. Try clearing cache
5. Check Firestore rules (though delete is client-side)

---

## UI/Display Issues

### ❌ Images not loading

**Problem:** Image URLs invalid or CORS issue.

**Symptoms:**
- Broken image icons
- Console errors about CORS

**Solution:**
1. Check image URL is valid (test in new tab)
2. Use HTTPS URLs (not HTTP)
3. For Unsplash: ensure URL is complete
4. For Firebase Storage: check CORS configuration
5. Add domain to `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-domain.com',
    },
  ],
}
```

### ❌ Animations not working

**Problem:** Framer Motion not loaded or browser issue.

**Solution:**
1. Check if Framer Motion installed:
```bash
npm list framer-motion
```
2. Reinstall if needed:
```bash
npm install framer-motion
```
3. Clear browser cache
4. Try different browser
5. Check browser console for errors

### ❌ Layout broken on mobile

**Problem:** Tailwind CSS not applied or viewport issue.

**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Check viewport meta tag in layout.tsx
3. Verify Tailwind CSS working:
```bash
npm run dev
# Check if CSS updates appear
```
4. Clear browser cache
5. Test in Chrome DevTools mobile view

---

## Build/Deploy Issues

### ❌ Build fails with TypeScript errors

**Problem:** Type errors in code.

**Solution:**
```bash
# Check types
npm run build

# See specific errors
npx tsc --noEmit
```
Fix reported errors or temporarily:
```typescript
// tsconfig.json - NOT recommended for production
{
  "compilerOptions": {
    "strict": false
  }
}
```

### ❌ Vercel deployment fails

**Problem:** Environment variables missing or build error.

**Solution:**
1. Check Vercel build logs for specific error
2. Verify all env vars are set in Vercel dashboard
3. Check vars have `NEXT_PUBLIC_` prefix
4. Try deploying from local:
```bash
npm install -g vercel
vercel --prod
```
5. Check Next.js version compatibility

### ❌ "Module not found" on deploy

**Problem:** Missing dependency in package.json.

**Solution:**
```bash
# Ensure all deps are in package.json
npm install <missing-package> --save
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

---

## Performance Issues

### ❌ Slow page load

**Problem:** Large images or too many requests.

**Solution:**
1. Optimize images (compress, resize)
2. Use WebP format
3. Implement image lazy loading
4. Enable Next.js Image optimization
5. Check Network tab in DevTools

### ❌ Animations laggy

**Problem:** Heavy animations or slow device.

**Solution:**
1. Use `transform` and `opacity` only (GPU accelerated)
2. Reduce animation complexity
3. Use `will-change` CSS property sparingly
4. Test on target devices
5. Consider disabling animations on low-end devices

---

## Data Issues

### ❌ Duplicate votes

**Problem:** Session ID not working.

**Solution:**
1. Check localStorage in DevTools:
   - Should have `watch_picker_session_id`
   - Should have `watch_picker_submitted`
2. Verify `sessionId.ts` is imported correctly
3. Check browser allows localStorage
4. For testing, clear localStorage:
```javascript
// Browser console
localStorage.clear()
```

### ❌ Wrong vote counts

**Problem:** Calculation error or duplicate data.

**Solution:**
1. Check Firestore console for duplicate entries
2. Verify calculation logic in admin dashboard
3. Export CSV and verify data
4. Delete test submissions if needed

### ❌ CSV export empty

**Problem:** No submissions or permissions issue.

**Solution:**
1. Verify submissions exist in Firestore
2. Check console for errors
3. Try different browser
4. Check if admin session is valid

---

## Browser-Specific Issues

### Chrome
- Clear cache: Ctrl+Shift+Delete
- DevTools: F12
- Force reload: Ctrl+Shift+R

### Firefox
- Clear cache: Ctrl+Shift+Delete
- DevTools: F12
- Force reload: Ctrl+F5

### Safari
- Clear cache: Cmd+Option+E
- DevTools: Cmd+Option+I
- Force reload: Cmd+Shift+R

### Edge
- Same as Chrome

---

## Getting Help

### Before asking for help:

1. ✅ Check this troubleshooting guide
2. ✅ Look at browser console (F12)
3. ✅ Check Firebase Console for errors
4. ✅ Verify all environment variables
5. ✅ Try in incognito mode
6. ✅ Try different browser
7. ✅ Clear cache and restart

### When reporting issues:

Include:
- 🔴 Exact error message
- 🔴 Browser and version
- 🔴 Steps to reproduce
- 🔴 Console output
- 🔴 Screenshots if relevant
- 🔴 What you've already tried

### Useful debugging commands:

```bash
# Check Node version (need 18+)
node --version

# Check npm version
npm --version

# Verify environment variables loaded
npm run dev
# Then check console output

# Check Firebase connection
# In browser console:
console.log(window.firebase)

# Check build locally
npm run build
npm run start
```

---

## Still stuck?

1. 📖 Read the [README.md](./README.md)
2. 📝 Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. 🚀 Review [DEPLOYMENT.md](./DEPLOYMENT.md)
4. 💬 Open an issue on GitHub
5. 🔥 Check Firebase documentation
6. ⚡ Review Next.js documentation

---

**Remember:** 
- Most issues are configuration-related
- Always check browser console first
- Restart dev server after config changes
- Clear cache when in doubt
