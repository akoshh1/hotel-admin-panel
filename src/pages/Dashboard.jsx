import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    revenue: 0,
    occupancyRate: 0
  })

  useEffect(() => {
    // Load data from localStorage
    const rooms = JSON.parse(localStorage.getItem('rooms')) || []
    const bookings = JSON.parse(localStorage.getItem('bookings')) || []
    const customers = JSON.parse(localStorage.getItem('customers')) || []
    
    const today = new Date().toISOString().split('T')[0]
    const todayCheckIns = bookings.filter(b => b.checkInDate === today && b.status === 'confirmed').length
    const todayCheckOuts = bookings.filter(b => b.checkOutDate === today && b.status === 'checked-in').length
    
    const activeBookings = bookings.filter(b => ['confirmed', 'checked-in'].includes(b.status))
    const occupiedRooms = [...new Set(activeBookings.map(b => b.roomId))].length
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0
    
    const revenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

    setStats({
      totalBookings: bookings.length,
      totalRooms: rooms.length,
      todayCheckIns,
      todayCheckOuts,
      revenue: revenue.toFixed(2),
      occupancyRate,
      totalCustomers: customers.length
    })
  }, [])

  return (
    <Layout title="Hotel Dashboard Overview">
      <div className="dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3498db20', color: '#3498db' }}>
              📅
            </div>
            <div className="stat-info">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#2ecc7120', color: '#2ecc71' }}>
              🛏️
            </div>
            <div className="stat-info">
              <h3>{stats.totalRooms}</h3>
              <p>Total Rooms</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f39c1220', color: '#f39c12' }}>
              👤
            </div>
            <div className="stat-info">
              <h3>{stats.totalCustomers}</h3>
              <p>Total Customers</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#9b59b620', color: '#9b59b6' }}>
              💰
            </div>
            <div className="stat-info">
              <h3>${stats.revenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e74c3c20', color: '#e74c3c' }}>
              🔄
            </div>
            <div className="stat-info">
              <h3>{stats.todayCheckIns}</h3>
              <p>Today's Check-ins</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#1abc9c20', color: '#1abc9c' }}>
              📊
            </div>
            <div className="stat-info">
              <h3>{stats.occupancyRate}%</h3>
              <p>Occupancy Rate</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-content">
          <div className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => window.location.href = '/admin/rooms'}>
                <span>➕</span> Add New Room
              </button>
              <button className="action-btn" onClick={() => window.location.href = '/admin/bookings'}>
                <span>📅</span> Create Booking
              </button>
              <button className="action-btn" onClick={() => window.location.href = '/admin/customers'}>
                <span>👤</span> Add New Customer
              </button>
            </div>
          </div>
          
          <div className="card">
            <h2>Recent Bookings</h2>
            <ul className="activity-list">
              <li>✅ New booking from John Doe (Room 101)</li>
              <li>🔄 Check-in completed for Room 205</li>
              <li>💰 Payment received for Booking #BKG-001</li>
              <li>⚠️ Room 301 maintenance scheduled</li>
              <li>📧 Confirmation sent to customer@email.com</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard