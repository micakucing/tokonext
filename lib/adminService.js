import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"
import { app } from "./firebase"

const db = getFirestore(app)

export async function isAdmin(email) {
  if (!email) return false
  const q = query(collection(db, "admins"), where("email", "==", email))
  const snapshot = await getDocs(q)
  return !snapshot.empty
}
