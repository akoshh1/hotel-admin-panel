import { Link, useNavigate } from 'react-router-dom'
import './Layout.css'

const Layout = ({ children, title }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🏨 Hotel Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-link">
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/rooms" className="nav-link">
            <span>🛏️</span> Rooms
          </Link>
          <Link to="/admin/bookings" className="nav-link">
            <span>📅</span> Bookings
          </Link>
          <Link to="/admin/customers" className="nav-link">
            <span>👥</span> Customers
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <span>🚪</span> Logout
          </button>
        </nav>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>{title}</h1>
          <div className="user-info">
            Hotel Administrator
          </div>
        </header>
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout