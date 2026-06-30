import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

const getFirebaseConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
});

export const getFirebaseApp = () => {
  const config = getFirebaseConfig();
  if (!config.apiKey) {
    throw new Error("VITE_FIREBASE_API_KEY environment variable is missing. Please check your .env configuration.");
  }
  return getApps().length > 0 ? getApp() : initializeApp(config);
};

export const getFirebaseAuth = (): Auth => {
  return getAuth(getFirebaseApp());
};

export const getGoogleProvider = (): GoogleAuthProvider => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.events');
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  provider.addScope('https://www.googleapis.com/auth/calendar.freebusy');
  return provider;
};
