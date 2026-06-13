import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { Watch, Submission } from '@/types';

const WATCHES_COLLECTION = 'watches';
const SUBMISSIONS_COLLECTION = 'submissions';

// Watch Management
export async function getWatches(): Promise<Watch[]> {
  try {
    const querySnapshot = await getDocs(collection(db, WATCHES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Watch[];
  } catch (error) {
    console.error('Error fetching watches:', error);
    return [];
  }
}

export async function addWatch(watch: Omit<Watch, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, WATCHES_COLLECTION), watch);
  return docRef.id;
}

export async function deleteWatch(watchId: string): Promise<void> {
  await deleteDoc(doc(db, WATCHES_COLLECTION, watchId));
}

// Submission Management
export async function submitVote(
  watchId: string,
  watchBrand: string,
  watchModel: string,
  sessionId: string,
  nickname?: string
): Promise<void> {
  await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
    watchId,
    watchBrand,
    watchModel,
    sessionId,
    nickname: nickname || null,
    timestamp: Timestamp.now(),
  });
}

export async function getSubmissions(): Promise<Submission[]> {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        watchId: data.watchId,
        watchBrand: data.watchBrand,
        watchModel: data.watchModel,
        sessionId: data.sessionId,
        nickname: data.nickname,
        timestamp: data.timestamp?.toDate() || new Date(),
      };
    }) as Submission[];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}
