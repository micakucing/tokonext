import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { db } from "../../lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button, Spinner, Modal } from "react-bootstrap"
import { useCart } from "../../context/CartContext"

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showZoom, setShowZoom] = useState(false)
   const { addToCart } = useCart()

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, "product", id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() })
          } else {
            setProduct(null)
          }
        } catch (err) {
          console.error(err)
          setProduct(null)
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <h3>Produk tidak ditemukan</h3>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 text-center">
          {product.image && (
            <>
              {/* Hover zoom */}
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid rounded shadow zoomable"
                style={{
                  maxHeight: "400px",
                  cursor: "zoom-in",
                  transition: "transform 0.3s ease",
                }}
                onClick={() => setShowZoom(true)}
              />

              {/* Modal zoom */}
              <Modal
                show={showZoom}
                onHide={() => setShowZoom(false)}
                size="lg"
                centered
              >
                <Modal.Body className="text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                  />
                </Modal.Body>
              </Modal>
            </>
          )}
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h4 className="text-success">
            Rp {product.price.toLocaleString()}
          </h4>
          <p>
            {product.description}
          </p>
          <Button
            variant="primary"
            onClick={() => addToCart(product)}
          >
            Tambah ke Keranjang
          </Button>
        </div>
      </div>

      <style jsx>{`
        .zoomable:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}
