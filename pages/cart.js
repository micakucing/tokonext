import { useCart } from "../context/CartContext"
import { Button, Table, Form } from "react-bootstrap"

export default function CartPage() {
  const { cart, removeFromCart, updateQty } = useCart()
  const total = cart?.reduce((acc, item) => acc + item.price * item.qty, 0) || 0

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      alert("Keranjang kosong!")
      return
    }

    let message = "Halo, saya ingin memesan produk berikut:%0A%0A"
    cart.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} (x${item.qty}) - Rp ${(
        item.price * item.qty
      ).toLocaleString()}%0A`
    })
    message += `%0ATotal: Rp ${total.toLocaleString()}%0A%0A`
    message += "Terima kasih telah memesan di toko kami 🙏"

    const phone = "6281234567890" // ganti dengan nomor WhatsApp toko
    const url = `https://wa.me/${phone}?text=${message}`
    window.open(url, "_blank")
  }

  return (
    <div className="container mt-4">
      <h3>Keranjang Belanja</h3>
      {(!cart || cart.length === 0) ? (
        <p>Keranjang masih kosong</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td style={{ width: "120px" }}>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>Rp {item.price.toLocaleString()}</td>
                  <td>Rp {(item.price * item.qty).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5>Total: Rp {total.toLocaleString()}</h5>
          <Button variant="success" onClick={handleCheckout}>
            Checkout via WhatsApp
          </Button>
        </>
      )}
    </div>
  )
}
