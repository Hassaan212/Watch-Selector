# Watch Picker 🕐✨

> A production-ready, mobile-first web application for collecting watch preferences through a beautiful, interactive interface.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🎯 What is Watch Picker?

Send someone a private link to help settle a debate. They see a gorgeous collection of luxury watches, select their favorite, and **boom** - their choice instantly appears on your real-time admin dashboard.

Perfect for:
- 🎁 Gift selection surveys
- 💬 Settling watch debates
- 📊 Preference polling
- 🔍 Market research
- 🎨 Design feedback

---

## ✨ Highlights

<table>
<tr>
<td width="50%">

### 👥 **User Experience**
- 🌑 Luxury dark theme
- ✨ Smooth animations
- 📱 Mobile-first responsive
- 🚫 Duplicate vote prevention
- ⚡ Lightning fast

</td>
<td width="50%">

### 📊 **Admin Dashboard**
- 🔐 Password protected
- 📈 Real-time analytics
- 🏆 Rankings & charts
- ➕ Add/delete watches
- 📤 CSV export

</td>
</tr>
</table>

---

## 🚀 Quick Start

Get up and running in **15 minutes**!

```bash
# 1. Install dependencies
cd watch-picker
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Firebase config

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

**📖 Detailed Setup**: See [GETTING_STARTED.md](./GETTING_STARTED.md)

---

## 📸 Screenshots

### User Voting Interface
```
┌─────────────────────────────────────┐
│  Help me settle a debate 😄        │
│  Which watch would you wear?       │
│                                     │
│  ┌────┐  ┌────┐  ┌────┐           │
│  │ ⌚ │  │ ⌚ │  │ ⌚ │           │
│  │Rol │  │Ome │  │Pat │           │
│  └────┘  └────┘  └────┘           │
│                                     │
│  [ Submit My Choice ]              │
└─────────────────────────────────────┘
```

### Admin Dashboard
```
┌─────────────────────────────────────┐
│  Watch Picker Admin                │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ 47  │ │ #1  │ │67.2%│          │
│  │Votes│ │Rolex│ │ Top │          │
│  └─────┘ └─────┘ └─────┘          │
│  Rankings  |  Recent  |  Chart    │
└─────────────────────────────────────┘
```

---

A modern, mobile-first web application for collecting watch preferences through a beautiful, interactive interface.

---

## 📚 Documentation

We've created comprehensive guides for every stage:

| Guide | Description | Time |
|-------|-------------|------|
| [🚀 GETTING_STARTED.md](./GETTING_STARTED.md) | Complete setup from scratch | 15 min |
| [📖 SETUP_GUIDE.md](./SETUP_GUIDE.md) | Detailed Firebase setup | 20 min |
| [☁️ DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to production | 10 min |
| [🐛 TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Fix common issues | - |
| [✨ FEATURES.md](./FEATURES.md) | Complete feature list | - |
| [📋 PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Technical overview | - |
| [⚡ QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Commands & shortcuts | - |
| [📱 MOBILE_PERFORMANCE_SUMMARY.md](./MOBILE_PERFORMANCE_SUMMARY.md) | Mobile optimization overview | - |

**New to the project?** Start with [GETTING_STARTED.md](./GETTING_STARTED.md)!

**Want to understand mobile optimizations?** See [MOBILE_PERFORMANCE_SUMMARY.md](./MOBILE_PERFORMANCE_SUMMARY.md)!

---

## 🛠 Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with SSR | 15.x |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **Tailwind CSS** | Utility-first styling | 4.x |
| **Framer Motion** | Smooth animations | 12.x |
| **Firebase** | Backend & database | 12.x |
| **Lucide React** | Beautiful icons | Latest |

---

## Features

### User Experience
- 🎨 **Elegant luxury aesthetic** with dark theme
- 📱 **Fully responsive** for mobile and desktop
- ⚡ **Mobile Performance Mode** - Optimized for mid-range Android phones (40% faster rendering)
- ✨ **Smooth animations** using Framer Motion
- 🎯 **Single-selection interface** with visual feedback
- 🚫 **Duplicate prevention** via browser session tracking

### Admin Dashboard
- 🔐 **Password protected** access
- 📊 **Real-time statistics** with Firestore listeners
- 🏆 **Rankings and leaderboard**
- 📈 **Visual charts** showing vote distribution
- 📝 **Submission history** with timestamps
- ➕ **Watch management** (add/remove watches)
- 📤 **Image upload** support via Firebase Storage
- 💾 **CSV export** for results
- 🔗 **Shareable links** generation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Vercel (recommended)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

## Setup Instructions

### 1. Clone and Install

```bash
cd watch-picker
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location
4. Enable **Firebase Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in production mode
5. Get your Firebase config:
   - Go to Project Settings (⚙️ icon)
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Copy the firebaseConfig object

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Set a secure admin password
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
```

### 4. Firestore Security Rules

In Firebase Console, go to Firestore Database → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to watches collection
    match /watches/{watchId} {
      allow read: if true;
      allow write: if false; // Only allow writes through admin dashboard
    }
    
    // Allow write-only access to submissions (prevent reading other submissions)
    match /submissions/{submissionId} {
      allow read: if false; // Only admin can read
      allow create: if true; // Anyone can submit
      allow update, delete: if false;
    }
  }
}
```

### 5. Firebase Storage Rules

Go to Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /watches/{fileName} {
      allow read: if true;
      allow write: if false; // Only through admin dashboard
    }
  }
}
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. User opens the link: `https://your-domain.com/`
2. Browse available watches
3. Click to select one watch
4. Click "Submit My Choice" button
5. Success screen appears
6. Cannot submit again from same browser

### For Admin

1. Navigate to: `https://your-domain.com/admin`
2. Enter admin password
3. View dashboard with:
   - Total votes
   - Most popular watch
   - Rankings with percentages
   - Vote distribution chart
   - Recent submissions
4. Switch to "Manage Watches" tab to:
   - Add new watches (upload image or provide URL)
   - Delete existing watches
5. Export results as CSV

## Project Structure

```
watch-picker/
├── app/
│   ├── page.tsx              # Main voting page
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── WatchCard.tsx         # Watch selection card
│   ├── SuccessScreen.tsx     # Post-submission screen
│   └── admin/
│       ├── StatsCard.tsx     # Statistics card
│       ├── RankingsList.tsx  # Rankings display
│       ├── VotesChart.tsx    # Vote distribution chart
│       ├── SubmissionsList.tsx   # Recent submissions
│       └── WatchManagement.tsx   # Add/remove watches
├── lib/
│   ├── firebase.ts           # Firebase initialization
│   ├── watches.ts            # Firestore operations
│   └── sessionId.ts          # Session management
├── types/
│   └── index.ts              # TypeScript types
└── .env.local                # Environment variables
```

## Firestore Data Structure

### Collections

#### `watches`
```typescript
{
  id: string,           // Auto-generated
  brand: string,        // e.g., "Rolex"
  model: string,        // e.g., "Submariner"
  image: string,        // URL to image
  description?: string  // Optional description
}
```

#### `submissions`
```typescript
{
  id: string,           // Auto-generated
  watchId: string,      // Reference to watch
  watchBrand: string,   // Denormalized for performance
  watchModel: string,   // Denormalized for performance
  sessionId: string,    // Browser session identifier
  nickname?: string,    // Optional user nickname
  timestamp: Timestamp  // Firebase Timestamp
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Alternative: Deploy to Netlify, Railway, etc.

All major Next.js hosting providers are supported.

## Customization

### Change Color Scheme

Edit Tailwind classes in components. Current theme uses:
- Primary: `amber-500` (gold/luxury theme)
- Background: `zinc-950`, `zinc-900`
- Text: `white`, `zinc-400`

### Add More Watch Fields

1. Update `types/index.ts` - add fields to `Watch` interface
2. Update `components/admin/WatchManagement.tsx` - add form inputs
3. Update `components/WatchCard.tsx` - display new fields

### Custom Domain

Configure in your hosting provider's settings.

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules
- Ensure Firebase config is correct in `.env.local`

### Images not loading
- Check Firebase Storage rules
- Verify image URLs are accessible
- Check browser console for CORS errors

### Votes not appearing in real-time
- Verify Firestore real-time listener is working
- Check browser console for errors
- Ensure proper Firebase initialization

## Security Considerations

- ✅ Admin password stored in environment variables
- ✅ Firestore rules prevent unauthorized access
- ✅ Session-based duplicate prevention
- ⚠️ For production, consider implementing proper authentication
- ⚠️ Consider adding rate limiting to prevent spam

## License

MIT License - feel free to use for your own projects!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Firebase
