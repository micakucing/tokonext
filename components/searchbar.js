// components/SearchBar.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Button } from 'react-bootstrap'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return

    // arahkan ke halaman search / results dengan query
    router.push(`/search?query=${encodeURIComponent(query)}`)
    setQuery('') // reset input
  }

  return (
    <Form className="d-flex mt-4 mt-xl-0 ms-0 ms-xl-3" onSubmit={handleSearch}>
      <Form.Control
        type="text"
        placeholder="Cari Produk..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="me-2"
      />
      <Button type="submit" variant="primary">
        Cari
      </Button>
    </Form>
  )
}
