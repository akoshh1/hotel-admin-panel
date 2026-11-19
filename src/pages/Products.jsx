import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { v4 as uuidv4 } from 'uuid'
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    status: 'active'
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || []
    setProducts(savedProducts)
  }

  const saveProducts = (productsList) => {
    localStorage.setItem('products', JSON.stringify(productsList))
    loadProducts()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id
          ? { ...formData, id: editingProduct.id, updatedAt: new Date().toISOString() }
          : p
      )
      saveProducts(updatedProducts)
    } else {
      // Add new product
      const newProduct = {
        ...formData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      saveProducts([...products, newProduct])
    }
    
    resetForm()
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id)
      saveProducts(updatedProducts)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Electronics',
      price: '',
      stock: '',
      status: 'active'
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  return (
    <Layout title="Products Management">
      <div className="products-page">
        <div className="page-header">
          <h2>Products</h2>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ➕ Add Product
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingProduct ? 'Update' : 'Save'} Product
                </button>
                <button type="button" onClick={resetForm} className="btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No products found. Add your first product!</td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>${parseFloat(product.price).toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`status-badge status-${product.status}`}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(product)} className="btn btn-sm">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Products