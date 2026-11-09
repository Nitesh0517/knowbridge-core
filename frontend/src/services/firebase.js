/**
 * Firebase Authentication Service for KnowBridge AI
 * Provides email/password registration, login, logout, password reset,
 * and seamless fallback/demo mode if Firebase keys are not provided.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoDummyKeyKnowBridgeHackathon2025",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "knowbridge-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "knowbridge-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "knowbridge-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029384756",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029384756:web:abcdef123456"
};

const hasRealFirebaseConfig = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('DemoDummyKey')
);

let app = null;
let auth = null;

if (hasRealFirebaseConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } catch (err) {
    console.warn('[Firebase] Initialization error, falling back to local auth mode:', err.message);
  }
}

export const authService = {
  isConfigured: () => hasRealFirebaseConfig && Boolean(auth),

  login: async (email, password) => {
    if (authService.isConfigured()) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('knowbridge_token', token);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split('@')[0],
      };
    } else {
      // Local development/demo authentication
      const demoUser = {
        uid: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'Lead Architect',
        organization: 'KnowBridge Enterprise Workspace'
      };
      localStorage.setItem('knowbridge_token', 'demo-token-' + Date.now());
      localStorage.setItem('knowbridge_user', JSON.stringify(demoUser));
      return demoUser;
    }
  },

  register: async (email, password, displayName, organization) => {
    if (authService.isConfigured()) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('knowbridge_token', token);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || email.split('@')[0],
        organization: organization || 'My Organization'
      };
    } else {
      const demoUser = {
        uid: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        displayName: displayName || email.split('@')[0],
        organization: organization || 'My Organization',
        role: 'Lead Architect'
      };
      localStorage.setItem('knowbridge_token', 'demo-token-' + Date.now());
      localStorage.setItem('knowbridge_user', JSON.stringify(demoUser));
      return demoUser;
    }
  },

  logout: async () => {
    if (authService.isConfigured()) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem('knowbridge_token');
    localStorage.removeItem('knowbridge_user');
  },

  resetPassword: async (email) => {
    if (authService.isConfigured()) {
      await sendPasswordResetEmail(auth, email);
    }
    return true;
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem('knowbridge_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return {
      uid: 'demo_user_123',
      email: 'lead.architect@knowbridge.ai',
      displayName: 'Elena Rostova',
      role: 'Incoming Lead Architect',
      organization: 'FinTech Dynamics Corp'
    };
  }
};
