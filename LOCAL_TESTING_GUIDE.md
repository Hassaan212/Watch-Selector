# Local Testing Guide 🧪

Complete checklist for testing Watch Picker locally before deployment.

---

## Prerequisites ✅

Before testing, make sure:
- [ ] `.env.local` file exists with all 7 variables filled in
- [ ] Firebase project created
- [ ] Firestore enabled with rules published
- [ ] Storage enabled with rules published
- [ ] Dev server running (`npm run dev`)

---

## Test 1: Page Loads (1 min)

### Steps:
1. Open http://localhost:3000
2. Wait for page to load

### Expected Result:
```
✅ Page loads without errors
✅ See heading: "Help me settle a debate 😄"
✅ See subheading: "Which watch would you wear?"
✅ Either see watches OR "No watches available yet"
✅ Dark theme with luxury aesthetic
✅ No console errors (press F12 to check)
```

### If Failed:
- Check browser console (F12) for errors
- Verify `.env.local` has correct Firebase values
- Restart dev server: `Ctrl+C` then `npm run dev`

---

## Test 2: Admin Login (1 min)

### Steps:
1. Go to http://localhost:3000/admin
2. Enter admin password from `.env.local`
3. Click "Login"

### Expected Result:
```
✅ Login page appears with password field
✅ Can type password
✅ Clicking Login redirects to dashboard
✅ See "Watch Picker Admin" header
✅ See tabs: "Overview" and "Manage Watches"
```

### If Failed:
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`
- Password is case-sensitive
- Clear browser cache and try again

---

## Test 3: Add First Watch (2 min)

### Steps:
1. In admin dashboard, click "Manage Watches" tab
2. Click "Add Watch" button
3. Fill in form:
   - Brand: `Rolex`
   - Model: `Submariner`  
   - Description: `Iconic dive watch`
   - Image URL: `https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80`
4. Click "Add Watch"

### Expected Result:
```
✅ Modal opens with form
✅ Can type in all fields
✅ Image preview shows below URL field
✅ "Add Watch" button is clickable
✅ Modal closes after submission
✅ New watch appears in grid
✅ No errors in console
```

### If Failed:
- Check Firestore rules are published
- Check image URL is valid (paste in new tab)
- Check browser console for errors
- Verify Storage is enabled

---

## Test 4: Watch Appears on Main Page (1 min)

### Steps:
1. Go back to http://localhost:3000
2. Refresh page if needed

### Expected Result:
```
✅ Rolex Submariner card appears
✅ Image loads correctly
✅ Brand name "ROLEX" in gold/amber
✅ Model name "Submariner" in white
✅ Description visible (if provided)
✅ Card has hover effect (scale up slightly)
✅ Dark background with luxury theme
```

### If Failed:
- Hard refresh: `Ctrl+Shift+R`
- Check Firestore Database in Firebase Console
- Should see "watches" collection with 1 document

---

## Test 5: Select a Watch (1 min)

### Steps:
1. On main page, click the Rolex card
2. Observe the changes

### Expected Result:
```
✅ Card border turns amber/gold
✅ Checkmark appears in top-right corner
✅ Card has glow effect
✅ Submit button slides up from bottom
✅ Button says "Submit My Choice"
✅ Clicking another area doesn't deselect
```

### If Failed:
- Check console for JavaScript errors
- Verify Framer Motion is installed: `npm list framer-motion`

---

## Test 6: Submit Vote (2 min)

### Steps:
1. With watch selected, click "Submit My Choice"
2. Wait for submission

### Expected Result:
```
✅ Button shows loading spinner
✅ Button text changes to "Submitting..."
✅ After 1-2 seconds, see success screen
✅ Green checkmark animation
✅ Text: "Thanks! 🙏"
✅ Text: "Your vote has been recorded"
✅ Can't go back to vote again
```

### If Failed:
- Check Firestore rules allow submissions creation
- Check browser console for errors
- Verify internet connection
- Check Firebase Console → Firestore → submissions collection

---

## Test 7: Vote Appears in Admin (1 min)

### Steps:
1. Keep success screen open in one tab
2. Open new tab: http://localhost:3000/admin
3. Login if needed
4. Check "Overview" tab

### Expected Result:
```
✅ Total Votes shows: 1
✅ Most Popular shows: Rolex Submariner
✅ Top Vote % shows: 100%
✅ Rankings list shows Rolex with 🏆 trophy icon
✅ Vote chart shows 100% bar for Rolex
✅ Recent Submissions shows your vote with timestamp
```

### If Failed:
- Refresh admin dashboard
- Check if vote is in Firestore Console
- Check browser console for errors

---

## Test 8: Real-Time Updates (2 min)

### Steps:
1. Open TWO browser windows side-by-side:
   - Window A: http://localhost:3000/admin (logged in)
   - Window B: http://localhost:3000 (in INCOGNITO mode)
2. In Window B, select a watch and submit
3. Watch Window A

### Expected Result:
```
✅ Window A updates WITHOUT refreshing
✅ Vote count increases immediately
✅ New submission appears in "Recent Submissions"
✅ Chart updates automatically
✅ Rankings update in real-time
✅ Takes less than 2 seconds
```

### If Failed:
- Check Firestore real-time listener is working
- Look for websocket errors in console
- Verify Firebase connection is active

---

## Test 9: Duplicate Prevention (1 min)

### Steps:
1. In regular browser (not incognito), submit a vote
2. Try to go back to main page
3. Try to submit another vote

### Expected Result:
```
✅ After submitting, automatically redirected to success page
✅ Going to main page shows success screen again
✅ Cannot vote twice from same browser
✅ LocalStorage has "watch_picker_submitted": "true"
```

### If Failed:
- Check localStorage in DevTools (F12 → Application tab)
- Clear localStorage to reset: `localStorage.clear()`

---

## Test 10: Add Multiple Watches (3 min)

### Steps:
1. Go to admin dashboard
2. Add 2-3 more watches using these sample data:

**Watch 2:**
- Brand: `Omega`
- Model: `Speedmaster`
- Image: `https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80`

**Watch 3:**
- Brand: `Patek Philippe`
- Model: `Nautilus`
- Image: `https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80`

### Expected Result:
```
✅ Each watch adds successfully
✅ All watches appear in admin grid
✅ All watches appear on main page
✅ Grid layout adjusts responsively
✅ 1 column on mobile, 2-3 columns on desktop
```

---

## Test 11: Mobile Responsive (2 min)

### Steps:
1. Press F12 (DevTools)
2. Click device toggle icon (📱) or press `Ctrl+Shift+M`
3. Select "iPhone 12 Pro" or similar
4. Navigate through app

### Expected Result:
```
✅ Main page: watches stack vertically
✅ Cards are full width with proper spacing
✅ Submit button is full width at bottom
✅ Admin dashboard: stats cards stack
✅ Admin: charts are readable
✅ Admin: forms are usable
✅ No horizontal scrolling
✅ Touch targets are large enough
```

---

## Test 12: Image Upload (2 min)

### Steps:
1. Go to admin → Manage Watches
2. Click "Add Watch"
3. Instead of URL, click "Upload Image"
4. Select an image from your computer
5. Fill in brand/model
6. Submit

### Expected Result:
```
✅ File picker opens
✅ Selected filename appears
✅ Image preview shows
✅ Upload works when submitting
✅ Watch appears with uploaded image
✅ Image is accessible from main page
```

### If Failed:
- Check Storage rules are published
- Check Firebase Storage is enabled
- Look for CORS errors in console

---

## Test 13: Delete Watch (1 min)

### Steps:
1. In admin → Manage Watches
2. Find a watch card
3. Click "Delete" button
4. Confirm deletion

### Expected Result:
```
✅ Confirmation dialog appears
✅ After confirming, watch disappears from grid
✅ Watch is removed from main page
✅ Vote stats update if it had votes
```

---

## Test 14: CSV Export (1 min)

### Steps:
1. Make sure you have at least 2 votes
2. Go to admin → Overview tab
3. Click "Export CSV" button

### Expected Result:
```
✅ CSV file downloads automatically
✅ Filename includes timestamp
✅ File opens in Excel/Google Sheets
✅ Contains columns: Brand, Model, Timestamp, Session ID
✅ All votes are listed
```

---

## Test 15: Browser Compatibility (5 min)

Test in multiple browsers if available:

### Chrome:
```
✅ All features work
✅ Animations are smooth
✅ No console errors
```

### Firefox:
```
✅ All features work
✅ Animations work
✅ Firebase connects
```

### Safari (if on Mac):
```
✅ All features work
✅ LocalStorage works
✅ Image uploads work
```

### Edge:
```
✅ All features work
✅ Same as Chrome
```

---

## Test 16: Error Handling (2 min)

### Test Offline Behavior:
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to submit a vote

### Expected Result:
```
✅ Shows error message or loading state
✅ Doesn't crash or freeze
✅ Recovers when going back online
```

---

## Test 17: Performance (2 min)

### Steps:
1. Open DevTools → Network tab
2. Hard refresh: `Ctrl+Shift+F5`
3. Check load times

### Expected Result:
```
✅ Initial load: < 3 seconds
✅ Firebase SDK loads: < 1 second  
✅ Watch data loads: < 500ms
✅ Animations run at 60fps
✅ No jank or stuttering
✅ Images lazy load
```

---

## Complete Testing Checklist

Quick checklist of all tests:

- [ ] Test 1: Page loads
- [ ] Test 2: Admin login
- [ ] Test 3: Add first watch
- [ ] Test 4: Watch appears on main page
- [ ] Test 5: Select a watch
- [ ] Test 6: Submit vote
- [ ] Test 7: Vote appears in admin
- [ ] Test 8: Real-time updates
- [ ] Test 9: Duplicate prevention
- [ ] Test 10: Add multiple watches
- [ ] Test 11: Mobile responsive
- [ ] Test 12: Image upload
- [ ] Test 13: Delete watch
- [ ] Test 14: CSV export
- [ ] Test 15: Browser compatibility
- [ ] Test 16: Error handling
- [ ] Test 17: Performance

---

## Common Issues During Testing

### Issue: "Permission Denied"
**Fix:** Re-publish Firestore rules (Step 5 in FIREBASE_SETUP.md)

### Issue: Images don't load
**Fix:** Use HTTPS URLs, check Storage rules

### Issue: Real-time updates don't work
**Fix:** Check websocket connection, try different network

### Issue: Can't delete watches
**Fix:** This is normal - admin deletes work client-side

### Issue: Slow performance
**Fix:** Check network tab, optimize images, check Firebase quotas

---

## Ready for Production?

If all tests pass, you're ready to deploy! See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Pre-Deployment Checklist:
- [ ] All 17 tests pass
- [ ] No console errors
- [ ] Mobile works perfectly
- [ ] Admin dashboard functional
- [ ] Real-time updates work
- [ ] Images load correctly
- [ ] Performance is acceptable
- [ ] Tested in multiple browsers

---

## Need Help?

- 🐛 Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 📖 Read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- 📋 See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**Happy testing! 🎉**
