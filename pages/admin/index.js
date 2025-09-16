import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, Button } from "react-bootstrap"
import { db, auth } from "../../lib/firebase"
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore"
 import { onAuthStateChanged } from "firebase/auth";
//import { isAdmin } from '../../lib/adminService'

  import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const router = useRouter();
 
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "product"))
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await deleteDoc(doc(db, "product", id))
      fetchProducts()
    }
  }

  useEffect(() => {
        fetchProducts();

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'admins', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
        } else {
          router.push('/admin/');
        }
      } else {
        router.push('/admin/login');
      }
      //setLoading(false);
    });
    return () => unsubscribe();
  }, [])

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Dashboard Admin</h3>
        <Link href="/admin/add" className="btn btn-primary">
          Tambah Produk
        </Link>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Harga</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>Rp {p.price.toLocaleString()}</td>
                <td>
                  {p.image && (
                    <img src={p.image} alt={p.name} width="60" />
                  )}
                </td>
                <td>
                  <Link
                    href={`/admin/${p.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Belum ada produk
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
