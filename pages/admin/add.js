import { useEffect, useState } from "react"
import { db, auth } from "../../lib/firebase"
import { collection, addDoc, getDoc, doc } from "firebase/firestore"
import { useRouter } from "next/router"
import { Button } from "react-bootstrap"
 import { onAuthStateChanged } from "firebase/auth";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function AddProduct() {
  const router = useRouter()


  useEffect(() => {
          //fetchProducts();
  
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'admins', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
          } else {
            router.push('/admin/add');
          }
        } else {
          router.push('/admin/login');
        }
        //setLoading(false);
      });
      return () => unsubscribe();
    }, [])


  const [form, setForm] = useState({
    name: "",
    price: "",
    shortdeskripsi: "",
    description: "",
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageBase64 = ""
      if (file) {
        imageBase64 = await toBase64(file)
      }

      await addDoc(collection(db, "product"), {
        name: form.name,
        price: Number(form.price),
        image: imageBase64,
        shortdeskripsi: form.shortdeskripsi,
        description: form.description,
      })

      router.push("/admin")
    } catch (err) {
      console.error("Error adding product:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4 mb-4">
      <h3>Tambah Produk</h3>
      <form onSubmit={handleSubmit}>
        {/* Nama Produk */}
        <div className="mb-3">
          <label className="form-label">Nama Produk</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Harga */}
        <div className="mb-3">
          <label className="form-label">Harga</label>
          <input
            type="number"
            className="form-control"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        {/* Deskripsi Singkat */}
        <div className="mb-3">
          <label className="form-label">Deskripsi Singkat</label>
          <textarea
            className="form-control"
            rows="2"
            value={form.shortdeskripsi}
            onChange={(e) => setForm({ ...form, shortdeskripsi: e.target.value })}
          />
        </div>

        {/* Deskripsi Lengkap */}
        <div className="mb-3">
          <label className="form-label">Deskripsi Lengkap</label>
          <textarea
            className="form-control"
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Upload Gambar */}
        <div className="mb-3">
          <label className="form-label">Gambar Produk</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <div className="mt-2 text-muted">{file.name}</div>
          )}
        </div>

        {/* Tombol */}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => router.push("/admin")}
        >
          Batalkan
        </Button>
      </form>
    </div>
  )
}
