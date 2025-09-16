// Import the functions you need from the SDKs you need

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'; // Import fungsi getFirestore

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyDDckwD3oV4iTnSZe4j4qvbizNvzKtQCR8",

  authDomain: "datatoko-4414e.firebaseapp.com",

  projectId: "datatoko-4414e",

  storageBucket: "datatoko-4414e.firebasestorage.app",

  messagingSenderId: "308851631308",

  appId: "1:308851631308:web:8e8090f9f1bbbce07b8e69"

};




//const app = initializeApp(firebaseConfig);


// Inisialisasi Firebase jika belum ada
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]

// Ambil instance Auth
const auth = getAuth(app)

// Fungsi logout
const logout = async () => {
  try {
    await signOut(auth)
    console.log('Logout berhasil')
  } catch (error) {
    console.error('Logout gagal:', error)
  }
}



// Inisialisasi Firestore dan tetapkan ke variabel 'db'
const db = getFirestore(app);

// Ekspor db agar dapat digunakan di file lain




// Bisa export auth juga untuk login/cek user
export { app, auth, logout, db }