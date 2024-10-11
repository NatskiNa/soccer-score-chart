// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCJR8yVgBJjRf-I9vIvyiNp-jiR5FodcyM',
  authDomain: 'soccer-point-chart.firebaseapp.com',
  projectId: 'soccer-point-chart',
  storageBucket: 'soccer-point-chart.appspot.com',
  messagingSenderId: '633998353730',
  appId: '1:633998353730:web:4af1f933a3fd35a25254db',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth };
