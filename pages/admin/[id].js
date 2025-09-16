import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { db, auth } from "../../lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Button, Spinner } from "react-bootstrap"
 import { onAuthStateChanged } from "firebase/auth";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export default function EditProduct() {
  const router = useRouter()
  const { id } = router.query

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    shortdeskripsi: "",
    description: "",
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
          //fetchProducts();
  
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'admins', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
          } else {
            router.push(`/admin/${id}`);
          }
        } else {
          router.push('/admin/login');
        }
        //setLoading(false);
      });
      return () => unsubscribe();
    }, [])

  useEffect(() => {
    
    if (!id) return
    const fetchProduct = async () => {
      const docRef = doc(db, "product", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setForm({
          name: docSnap.data().name || "",
          price: docSnap.data().price || "",
          image: docSnap.data().image || "",
          shortdeskripsi: docSnap.data().shortdeskripsi || "",
          description: docSnap.data().description || "",
        })
      }
      setLoading(false)
    }
    fetchProduct()

    
  }, [id])




   


  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageBase64 = form.image
      if (file) {
        imageBase64 = await toBase64(file)
      }

      await updateDoc(doc(db, "product", id), {
        name: form.name,
        price: Number(form.price),
        image: imageBase64,
        shortdeskripsi: form.shortdeskripsi,
        description: form.description,
      })

      router.push("/admin")
    } catch (err) {
      console.error("Error updating product:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h3>Edit Produk</h3>
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

        {/* Harga Produk */}
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
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="img-thumbnail mt-2"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>

        {/* Tombol */}
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan"}
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
