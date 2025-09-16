import { useState } from 'react'
import { useRouter } from 'next/router'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { Form, Button, Container, Alert } from 'react-bootstrap'
import { app } from '../../lib/firebase'
import { isAdmin } from '../../lib/adminService'

export default function AdminLogin() {
  const auth = getAuth(app)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userEmail = userCredential.user.email
      const allowed = await isAdmin(userEmail)

      if (allowed) {
        router.push('/admin/')
      } else {
        setError('Akses ditolak. Anda bukan admin.')
        await signOut(auth)
      }
    } catch (err) {
      setError('Email atau password salah')
    }
  }



  

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-3">Admin Login</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  )
}
