import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Predefined admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/admin')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p className="login-subtitle">Enter your credentials to access the dashboard</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <button type="submit" className="btn btn-primary login-btn">
            Sign In
          </button>
        </form>
        
        <div className="login-info">
          <p><strong>Demo Credentials:</strong></p>
          <p>Username: <code>admin</code></p>
          <p>Password: <code>admin123</code></p>
        </div>
      </div>
    </div>
  )
}

export default Login