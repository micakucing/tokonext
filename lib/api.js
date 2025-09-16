import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';


export async function fetchProducts() {
    const snap = await getDocs(collection(db, 'product'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}


export async function fetchProduct(id) {
    const ref = doc(db, 'product', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Product not found');
    return { id: snap.id, ...snap.data() };
}


export async function createOrder(order) {
    const ref = collection(db, 'orders');
    const res = await addDoc(ref, order);
    return res.id;
}