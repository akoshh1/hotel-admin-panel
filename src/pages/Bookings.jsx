import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { v4 as uuidv4 } from 'uuid'
import './Bookings.css'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [rooms, setRooms] = useState([])
  const [customers, setCustomers] = useState([])
  const [editingBooking, setEditingBooking] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customerId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    totalPrice: '',
    status: 'pending',
    specialRequests: ''
  })

  useEffect(() => {
    loadData()
    // Initialize with sample data if empty
    const existingBookings = JSON.parse(localStorage.getItem('bookings')) || []
    if (existingBookings.length === 0) {
      const sampleBookings = [
        {
          id: uuidv4(),
          bookingNumber: `BKG-${Date.now().toString().slice(-6)}`,
          customerId: 'guest-001',
          customerName: 'John Doe',
          roomId: 'room-001',
          roomNumber: '101',
          checkInDate: '2024-12-15',
          checkOutDate: '2024-12-18',
          nights: 3,
          guests: 2,
          totalPrice: 299.97,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      ]
      localStorage.setItem('bookings', JSON.stringify(sampleBookings))
      loadData()
    }
  }, [])

  const loadData = () => {
    const savedBookings = JSON.parse(localStorage.getItem('bookings')) || []
    const savedRooms = JSON.parse(localStorage.getItem('rooms')) || []
    const savedCustomers = JSON.parse(localStorage.getItem('customers')) || []
    
    setBookings(savedBookings)
    setRooms(savedRooms)
    setCustomers(savedCustomers)
  }

  const saveBookings = (bookingsList) => {
    localStorage.setItem('bookings', JSON.stringify(bookingsList))
    loadData()
  }

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  const calculateTotalPrice = (roomId, nights) => {
    const room = rooms.find(r => r.id === roomId)
    return room ? (room.pricePerNight * nights).toFixed(2) : 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...formData, [name]: value }

    // Recalculate price when dates or room change
    if ((name === 'checkInDate' || name === 'checkOutDate' || name === 'roomId') && 
        updatedForm.checkInDate && updatedForm.checkOutDate && updatedForm.roomId) {
      const nights = calculateNights(updatedForm.checkInDate, updatedForm.checkOutDate)
      updatedForm.totalPrice = calculateTotalPrice(updatedForm.roomId, nights)
    }

    setFormData(updatedForm)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const selectedRoom = rooms.find(r => r.id === formData.roomId)
    const selectedCustomer = customers.find(c => c.id === formData.customerId)
    const nights = calculateNights(formData.checkInDate, formData.checkOutDate)
    
    const bookingData = {
      ...formData,
      id: editingBooking ? editingBooking.id : uuidv4(),
      bookingNumber: editingBooking ? editingBooking.bookingNumber : `BKG-${Date.now().toString().slice(-6)}`,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Guest',
      roomNumber: selectedRoom ? selectedRoom.roomNumber : 'N/A',
      nights: nights,
      createdAt: editingBooking ? editingBooking.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingBooking) {
      const updatedBookings = bookings.map(b =>
        b.id === editingBooking.id ? bookingData : b
      )
      saveBookings(updatedBookings)
    } else {
      saveBookings([...bookings, bookingData])
    }
    
    resetForm()
  }

  const handleEdit = (booking) => {
    setEditingBooking(booking)
    setFormData({
      customerId: booking.customerId,
      roomId: booking.roomId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      status: booking.status,
      specialRequests: booking.specialRequests || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const updatedBookings = bookings.filter(b => b.id !== id)
      saveBookings(updatedBookings)
    }
  }

  const handleStatusChange = (id, newStatus) => {
    const updatedBookings = bookings.map(b =>
      b.id === id ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b
    )
    saveBookings(updatedBookings)
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      roomId: '',
      checkInDate: '',
      checkOutDate: '',
      guests: 1,
      totalPrice: '',
      status: 'pending',
      specialRequests: ''
    })
    setEditingBooking(null)
    setShowForm(false)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#2ecc71'
      case 'pending': return '#f39c12'
      case 'checked-in': return '#3498db'
      case 'checked-out': return '#9b59b6'
      case 'cancelled': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  const getAvailableRooms = () => {
    const today = new Date().toISOString().split('T')[0]
    return rooms.filter(room => {
      // Check if room is under maintenance
      if (room.status === 'maintenance') return false
      
      // Check for overlapping bookings
      const hasConflict = bookings.some(booking => 
        booking.roomId === room.id && 
        booking.status !== 'cancelled' &&
        ((formData.checkInDate <= booking.checkOutDate && formData.checkOutDate >= booking.checkInDate) ||
         (!formData.checkInDate && booking.checkOutDate >= today))
      )
      
      return !hasConflict
    })
  }

  return (
    <Layout title="Bookings Management">
      <div className="bookings-page">
        <div className="page-header">
          <h2>Hotel Bookings</h2>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ➕ New Booking
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3>{editingBooking ? 'Edit Booking' : 'Create New Booking'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer *</label>
                  <select
                    name="customerId"
                    className="form-control"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.email})
                      </option>
                    ))}
                    <option value="walk-in">Walk-in Guest</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Room *</label>
                  <select
                    name="roomId"
                    className="form-control"
                    value={formData.roomId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Room</option>
                    {getAvailableRooms().map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} - {room.roomType} (${room.pricePerNight}/night)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date *</label>
                  <input
                    type="date"
                    name="checkInDate"
                    className="form-control"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date *</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    className="form-control"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    required
                    min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    name="guests"
                    className="form-control"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Total Price ($)</label>
                  <input
                    type="number"
                    name="totalPrice"
                    className="form-control"
                    value={formData.totalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    readOnly
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
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked-in">Checked-in</option>
                    <option value="checked-out">Checked-out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  name="specialRequests"
                  className="form-control"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any special requirements..."
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingBooking ? 'Update' : 'Create'} Booking
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
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking #</th>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No bookings found. Create your first booking!</td>
                  </tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.bookingNumber}</strong>
                      </td>
                      <td>{booking.customerName}</td>
                      <td>Room {booking.roomNumber}</td>
                      <td>{booking.checkInDate}</td>
                      <td>{booking.checkOutDate}</td>
                      <td>${parseFloat(booking.totalPrice).toFixed(2)}</td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="status-select"
                          style={{ 
                            backgroundColor: `${getStatusColor(booking.status)}20`,
                            color: getStatusColor(booking.status),
                            borderColor: getStatusColor(booking.status)
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked-in">Checked-in</option>
                          <option value="checked-out">Checked-out</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(booking)} className="btn btn-sm">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(booking.id)} className="btn btn-danger btn-sm">
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

export default Bookings