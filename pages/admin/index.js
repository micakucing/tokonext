import { useEffect, useState } from "react"
import Link from "next/link"
import { Table, Button } from "react-bootstrap"
import { db } from "../../lib/firebase"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { getAuth } from 'firebase/auth'
import nookies from 'nookies'

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context) // ambil cookies
    const token = cookies.token || null

    // Jika token tidak ada → redirect ke login
    if (!token) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false
        }
      }
    }

    // Bisa juga decode token dan cek email admin
    const adminEmails = ['admin@admin.com'] // daftar admin
    if (!adminEmails.includes(token.email)) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false
        }
      }
    }

    return {
      props: {} // user valid, render halaman admin
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false
      }
    }
  }
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "product"))
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      await deleteDoc(doc(db, "products", id))
      fetchProducts()
    }
  }

  useEffect(() => {
    fetchProducts()
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
