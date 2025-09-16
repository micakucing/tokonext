import Link from 'next/link'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, logout, db } from '../lib/firebase'
import SearchBar from './searchbar'
import { doc, getDoc } from "firebase/firestore"


export default function Header() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const { cart } = useCart()
  const totalItems = cart?.length || 0
  const totalPrice = cart?.reduce((sum, item) => sum + (item.price || 0), 0) || 0


  useEffect(() => {

 const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {
                 setUser(user)

        const userDoc = await getDoc(doc(db, 'admins', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
         // fetchDashboardData();
         setIsAdmin(true)
        } else {
         // router.push('/admin/');
         setIsAdmin(false)
        }
      } else {
        //router.push('/admin/login');
      }
    //  setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);


  const handleLogout = async () => {
    await logout()
    router.push('/admin/login');
  }
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container className="mt-4 mb-4">
        <Navbar.Brand as={Link} href="/">Toko Online</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

            <Nav.Link as={Link} href="/cart">
              Keranjang ({totalItems})
            </Nav.Link>
            {isAdmin ? (
              <>
                <span className="me-2">Admin</span>
                <Button variant="outline-danger" onClick={handleLogout}>Keluar</Button>
              </>
            ) : user ? (
              <Button variant="outline-danger" onClick={handleLogout}>Keluar</Button>
            ) : (
              <Button variant="outline-primary" onClick={() => router.push('/admin/login')}>masuk</Button>
            )}
            <SearchBar className="me-3" />
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
