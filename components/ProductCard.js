import { Card, Button } from "react-bootstrap"
import Link from "next/link"
import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <Card className="h-100 shadow-sm">
      {product.image && (
        <Card.Img
          variant="top"
          src={product.image}
          style={{ objectFit: "cover", height: "200px" }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>Rp {product.price.toLocaleString()}</Card.Text>
        <div className="mt-auto d-flex justify-content-between">
          <Link href={`/product/${product.id}`} passHref>
            <Button variant="outline-primary" size="sm">
              Detail
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => addToCart(product)}>
            Tambah
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
