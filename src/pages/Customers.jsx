import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { v4 as uuidv4 } from 'uuid'
import './Customers.css'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    idType: 'passport',
    idNumber: '',
    nationality: '',
    preferences: []
  })

  useEffect(() => {
    loadCustomers()
    // Initialize with sample data if empty
    if (customers.length === 0) {
      const sampleCustomers = [
        {
          id: uuidv4(),
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St, New York',
          idType: 'passport',
          idNumber: 'P12345678',
          nationality: 'American',
          preferences: ['Non-smoking', 'High floor'],
          totalBookings: 3,
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          address: '456 Park Ave, London',
          idType: 'driver-license',
          idNumber: 'DL87654321',
          nationality: 'British',
          preferences: ['Sea view', 'Early check-in'],
          totalBookings: 5,
          createdAt: new Date().toISOString()
        }
      ]
      saveCustomers(sampleCustomers)
    }
  }, [])

  const loadCustomers = () => {
    const savedCustomers = JSON.parse(localStorage.getItem('customers')) || []
    setCustomers(savedCustomers)
  }

  const saveCustomers = (customersList) => {
    localStorage.setItem('customers', JSON.stringify(customersList))
    loadCustomers()
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
    
    if (editingCustomer) {
      const updatedCustomers = customers.map(c =>
        c.id === editingCustomer.id
          ? { ...formData, id: editingCustomer.id, totalBookings: editingCustomer.totalBookings }
          : c
      )
      saveCustomers(updatedCustomers)
    } else {
      const newCustomer = {
        ...formData,
        id: uuidv4(),
        totalBookings: 0,
        createdAt: new Date().toISOString()
      }
      saveCustomers([...customers, newCustomer])
    }
    
    resetForm()
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      idType: customer.idType,
      idNumber: customer.idNumber,
      nationality: customer.nationality,
      preferences: customer.preferences
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This will not delete their bookings.')) {
      const updatedCustomers = customers.filter(c => c.id !== id)
      saveCustomers(updatedCustomers)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      idType: 'passport',
      idNumber: '',
      nationality: '',
      preferences: []
    })
    setEditingCustomer(null)
    setShowForm(false)
  }

  return (
    <Layout title="Customers Management">
      <div className="customers-page">
        <div className="page-header">
          <h2>Customers</h2>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ➕ Add Customer
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
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
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    className="form-control"
                    value={formData.nationality}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ID Type</label>
                  <select
                    name="idType"
                    className="form-control"
                    value={formData.idType}
                    onChange={handleInputChange}
                  >
                    <option value="passport">Passport</option>
                    <option value="driver-license">Driver's License</option>
                    <option value="national-id">National ID</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ID Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    className="form-control"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingCustomer ? 'Update' : 'Save'} Customer
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
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Nationality</th>
                  <th>ID Info</th>
                  <th>Total Bookings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No customers found. Add your first customer!</td>
                  </tr>
                ) : (
                  customers.map(customer => (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-info-cell">
                          <div className="customer-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{customer.name}</strong>
                            {customer.preferences.length > 0 && (
                              <div className="customer-preferences">
                                {customer.preferences.slice(0, 2).map((p, i) => (
                                  <span key={i} className="preference-tag">{p}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.nationality}</td>
                      <td>
                        <span className="id-badge">
                          {customer.idType}: {customer.idNumber}
                        </span>
                      </td>
                      <td>
                        <span className="bookings-count">{customer.totalBookings}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(customer)} className="btn btn-sm">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(customer.id)} className="btn btn-danger btn-sm">
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

export default Customers