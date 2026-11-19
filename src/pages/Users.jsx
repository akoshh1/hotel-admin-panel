import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { v4 as uuidv4 } from 'uuid'
import './Users.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    department: 'Management',
    status: 'active'
  })

  useEffect(() => {
    loadUsers()
    // Initialize with sample data if empty
    if (users.length === 0) {
      const sampleUsers = [
        {
          id: uuidv4(),
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          department: 'Management',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'manager',
          department: 'Sales',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ]
      saveUsers(sampleUsers)
    }
  }, [])

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || []
    setUsers(savedUsers)
  }

  const saveUsers = (usersList) => {
    localStorage.setItem('users', JSON.stringify(usersList))
    loadUsers()
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
    
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? { ...formData, id: editingUser.id }
          : u
      )
      saveUsers(updatedUsers)
    } else {
      // Add new user
      const newUser = {
        ...formData,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      }
      saveUsers([...users, newUser])
    }
    
    resetForm()
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== id)
      saveUsers(updatedUsers)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      department: 'Management',
      status: 'active'
    })
    setEditingUser(null)
    setShowForm(false)
  }

  return (
    <Layout title="Users Management">
      <div className="users-page">
        <div className="page-header">
          <h2>Users</h2>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ➕ Add User
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
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
                  <label>Role</label>
                  <select
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="Management">Management</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Development">Development</option>
                    <option value="Support">Support</option>
                  </select>
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
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingUser ? 'Update' : 'Save'} User
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
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No users found. Add your first user!</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`status-badge status-${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(user)} className="btn btn-sm">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">
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

export default Users