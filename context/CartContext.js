import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Ambil dari localStorage saat pertama kali load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  // Simpan ke localStorage setiap ada perubahan cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Tambah ke keranjang
  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id)
    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      )
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  // Hapus item dari keranjang
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  // Update qty item
  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id)
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, qty: qty } : item
        )
      )
    }
  }

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQty }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
