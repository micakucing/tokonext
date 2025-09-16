import 'bootstrap/dist/css/bootstrap.min.css'
 import { CartProvider } from '../context/CartContext'
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Header />
      <Component {...pageProps} />
    </CartProvider>
  )
}

export default MyApp
