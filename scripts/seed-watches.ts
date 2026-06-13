/**
 * Seed Script - Add Sample Watches to Firestore
 * 
 * Run with: npx tsx scripts/seed-watches.ts
 * 
 * Make sure to install tsx first: npm install -D tsx
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Load environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleWatches = [
  {
    brand: 'Rolex',
    model: 'Submariner',
    description: 'Iconic dive watch with timeless design and unmatched heritage.',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
  },
  {
    brand: 'Omega',
    model: 'Speedmaster Moonwatch',
    description: 'The first watch worn on the moon. A legend in watchmaking.',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80',
  },
  {
    brand: 'Patek Philippe',
    model: 'Nautilus',
    description: 'The pinnacle of luxury sports watches with distinctive porthole design.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
  },
  {
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    description: 'Revolutionary octagonal bezel design that redefined luxury watches.',
    image: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=80',
  },
  {
    brand: 'Cartier',
    model: 'Santos',
    description: 'The first purpose-built pilot watch with elegant square case.',
    image: 'https://images.unsplash.com/photo-1611706098656-9f3affe6c181?w=800&q=80',
  },
  {
    brand: 'TAG Heuer',
    model: 'Monaco',
    description: 'Iconic square chronograph made famous by Steve McQueen.',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
  },
];

async function seedWatches() {
  console.log('🌱 Starting to seed watches...\n');

  for (const watch of sampleWatches) {
    try {
      const docRef = await addDoc(collection(db, 'watches'), watch);
      console.log(`✅ Added: ${watch.brand} ${watch.model} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`❌ Failed to add ${watch.brand} ${watch.model}:`, error);
    }
  }

  console.log('\n🎉 Seeding complete!');
  process.exit(0);
}

seedWatches();
