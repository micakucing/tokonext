import { useState } from 'react'
import { fetchProducts } from '../lib/api'
import ProductCard from '../components/ProductCard'
import { Container, Row, Col, Pagination } from 'react-bootstrap'

export async function getServerSideProps() {
  try {
    const products = await fetchProducts()
    return { props: { products } }
  } catch (err) {
    return { props: { products: [] } }
  }
}

export default function Home({ products }) {
  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Produk</h2>
      <Row>
        {currentProducts.map((p) => (
          <Col key={p.id} md={4} sm={6} className="mb-4">
            <ProductCard product={p} />
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  )
}
