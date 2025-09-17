/*import { useEffect, useState } from "react"
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
      <div className="d-flex d-sm-block d-md-flex justify-content-between mb-3">
        <h3>Dashboard Admin</h3>
        <Link href="/admin/add" className="btn btn-primary">
          Tambah Produk
        </Link>
      </div>
      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table striped bordered hover style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "600px", // biar ada scroll kalau layar kecil
        }}>
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
    </div>
  )
}

*/


import { useEffect, useState } from "react";
import Link from "next/link";
import { db, auth } from "../../lib/firebase"
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  where,
  doc,
  deleteDoc, getDoc
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/router';

export default function AddProduct() {

  const router = useRouter();

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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const itemsPerPage = 5;
  const [lastDoc, setLastDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  // Modal Hapus
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const fetchProducts = async (direction = "first") => {
    setLoading(true);
    try {
      let q;
      if (search.trim() !== "") {
        q = query(
          collection(db, "product"),
          where("name", ">=", search),
          where("name", "<=", search + "\uf8ff"),
          orderBy("name"),
          limit(itemsPerPage)
        );
        setPage(1);
      } else if (direction === "next" && lastDoc) {
        q = query(collection(db, "product"),
          orderBy("name"),
          startAfter(lastDoc),
          limit(itemsPerPage)
        );
        setPage((prev) => prev + 1);
      } else {
        q = query(
          collection(db, "product"),
          orderBy("name"),
          limit(itemsPerPage)
        );
        setPage(1);
      }

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(list);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setIsLastPage(list.length < itemsPerPage);
      } else {
        setProducts([]);
        setIsLastPage(true);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts("first");
  };

  const handleReset = () => {
    setSearch("");
    fetchProducts("first");
  };

  const confirmDelete = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteDoc(doc(db, "product", selectedProduct.id));
      alert(`Produk "${selectedProduct.name}" berhasil dihapus`);
      setShowModal(false);
      setSelectedProduct(null);
      fetchProducts("first");
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
      alert("Terjadi kesalahan saat menghapus produk");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Daftar Produk</h3>
      <Link href="/admin/add" className="btn btn-primary mb-3">
        Tambah Produk
      </Link>
      {/* Search Form */}
      <form className="d-flex mb-3" onSubmit={handleSearch}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary me-2">
          Cari
        </button>
        {search.trim() !== "" && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </form>

      <div className="table-responsive" style={{ overflowX: "auto", width: "100%" }}>
        <table className="table table-bordered table-striped" style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "600px", // biar ada scroll kalau layar kecil
        }}>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1 + (page - 1) * itemsPerPage}</td>
                  <td>{p.name}</td>
                  <td>Rp {p.price}</td>
                  <td>{p.shortdeskripsi || "-"}</td>
                  <td>
                    <Link
                      href={`/admin/${p.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => confirmDelete(p)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Tidak ada produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {search.trim() === "" && (
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => fetchProducts("first")}
          >
            ⬅️ Prev
          </button>
          <span>Halaman {page}</span>
          <button
            className="btn btn-outline-primary"
            disabled={isLastPage}
            onClick={() => fetchProducts("next")}
          >
            Next ➡️
          </button>
        </div>
      )}

      {/* Modal Bootstrap Konfirmasi Hapus */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Konfirmasi Hapus</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Apakah Anda yakin ingin menghapus produk{" "}
                <strong>{selectedProduct?.name}</strong>?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
