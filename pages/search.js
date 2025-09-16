import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function SearchPage() {
  const router = useRouter()
  const { query: searchQuery } = router.query
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!searchQuery) return

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, 'product'),
          where('name', '>=', searchQuery),
          where('name', '<=', searchQuery + '\uf8ff')
        )
        const snapshot = await getDocs(q)
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setResults(items)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [searchQuery])

  return (
    <div className="container mt-4">
      <h2>Search Results for "{searchQuery}"</h2>
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      {results.length === 0 && <p>No results found</p>}
    </div>
  )
}
