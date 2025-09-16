import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { app } from '../../lib/firebase'

const db = getFirestore(app)

export default function ProductTable() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', price: '', image: '' })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'product'))
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setProducts(items)
    setLoading(false)
  }

  const handleShowModal = (product = null) => {
    setEditingProduct(product)
    setFormData(
      product ? { name: product.name, price: product.price, image: product.image } : { name: '', price: '', image: '' }
    )
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setEditingProduct(null)
    setFormData({ name: '', price: '', image: '' })
    setShowModal(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (editingProduct) {
      // update produk
      const docRef = doc(db, 'product', editingProduct.id)
      await updateDoc(docRef, {
        name: formData.name,
        price: Number(formData.price),
        image: formData.image
      })
    } else {
      // tambah produk baru
      await addDoc(collection(db, 'product'), {
        name: formData.name,
        price: Number(formData.price),
        image: formData.image
      })
    }
    await fetchProducts()
    handleCloseModal()
  }

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      await deleteDoc(doc(db, 'product', id))
      await fetchProducts()
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Daftar Produk</h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Tambah Produk
        </Button>
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
                  {p.image ? <img src={p.image} alt={p.name} width="50" /> : '-'}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleShowModal(p)}
                  >
                    Edit
                  </Button>
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
              <td colSpan={4} className="text-center">Belum ada produk</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal Tambah/Edit */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL Gambar</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
