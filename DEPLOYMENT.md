# Deployment Guide 🚀

This guide covers deploying your Watch Picker app to production.

## Prerequisites

- ✅ Firebase project set up
- ✅ App tested locally
- ✅ GitHub repository (recommended)

## Option 1: Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js apps with zero configuration needed.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/watch-picker.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import your `watch-picker` repository
5. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is live! 🎉

**Your URLs:**
- User voting: `https://your-app.vercel.app`
- Admin dashboard: `https://your-app.vercel.app/admin`

### Step 5: Update Firebase Config

Add your Vercel domain to Firebase authorized domains:
1. Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add your Vercel domain: `your-app.vercel.app`

### Continuous Deployment

Every push to `main` branch will automatically deploy! 🔄

---

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub

(Same as Vercel - see above)

### Step 2: Import to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repo
4. Build settings (Netlify auto-detects):
   - Build command: `npm run build`
   - Publish directory: `.next`

### Step 3: Add Environment Variables

In Netlify site settings → Environment variables, add all Firebase config variables.

### Step 4: Deploy

Click **"Deploy site"** and wait for build to complete.

---

## Option 3: Deploy to Railway

### Step 1: Push to GitHub

(Same as above)

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `watch-picker` repository
4. Add environment variables in project settings
5. Railway will auto-detect Next.js and deploy

---

## Post-Deployment Checklist

### 1. Test User Flow
- [ ] Visit your production URL
- [ ] Select a watch
- [ ] Submit vote
- [ ] Verify success screen appears
- [ ] Try to submit again (should be prevented)

### 2. Test Admin Dashboard
- [ ] Visit `/admin` on production
- [ ] Login with admin password
- [ ] Verify real-time vote appears
- [ ] Test adding a new watch
- [ ] Test uploading an image
- [ ] Export CSV
- [ ] Test deleting a watch

### 3. Performance Check
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Check mobile responsiveness
- [ ] Test animations are smooth
- [ ] Verify images load quickly

### 4. Security Check
- [ ] Verify Firestore rules are in production mode
- [ ] Test that users can't read other submissions
- [ ] Confirm admin password works
- [ ] Check no secrets are exposed in client

---

## Custom Domain Setup

### Vercel
1. Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records with your provider

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `watch-picker-xxxxx` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin dashboard password | `SecurePass123!` |

---

## Updating Your Deployment

### Vercel/Netlify (with Git integration)
Simply push to your GitHub repository:
```bash
git add .
git commit -m "Update feature"
git push
```
Auto-deploys in 2-3 minutes! ✨

### Manual Deployment
Use the platform's CLI:

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Troubleshooting

### Build Fails
- Check build logs for errors
- Verify all environment variables are set
- Test `npm run build` locally first

### Firebase Connection Issues
- Verify all Firebase env vars are correct
- Check Firebase Console for API restrictions
- Ensure authorized domains are configured

### Images Not Loading
- Check Storage CORS configuration
- Verify image URLs are accessible
- Check browser console for errors

### Admin Password Not Working
- Double-check `NEXT_PUBLIC_ADMIN_PASSWORD` value
- Clear browser cache and try again
- Verify no typos or extra spaces

---

## Production Optimization Tips

1. **Enable Firebase App Check** (advanced security)
2. **Set up Firebase Analytics** to track usage
3. **Configure CDN caching** for images
4. **Set up monitoring** (Vercel Analytics, Google Analytics)
5. **Enable Vercel Speed Insights** for performance monitoring
6. **Add OG tags** for better social media sharing
7. **Set up error tracking** (Sentry)

---

## Scaling Considerations

If you expect high traffic:

1. **Upgrade Firebase plan** (free tier has limits)
2. **Enable Firestore indexes** for better query performance
3. **Implement rate limiting** to prevent abuse
4. **Add caching layer** for watch data
5. **Consider Cloud Functions** for complex operations
6. **Set up backup strategy** for Firestore data

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Documentation](https://firebase.google.com/docs)

Need help? Open an issue on GitHub!
