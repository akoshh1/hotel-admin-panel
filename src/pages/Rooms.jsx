import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { v4 as uuidv4 } from 'uuid'
import './Rooms.css'

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [editingRoom, setEditingRoom] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'standard',
    pricePerNight: '',
    capacity: '',
    amenities: ['WiFi', 'TV'],
    status: 'available',
    description: ''
  })

  const roomTypes = [
    { value: 'standard', label: 'Standard Room' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'family', label: 'Family Room' },
    { value: 'executive', label: 'Executive Suite' }
  ]

  const amenitiesList = [
    'WiFi', 'TV', 'AC', 'Mini Bar', 'Room Service', 
    'Sea View', 'Balcony', 'Jacuzzi', 'Kitchen', 'Pet Friendly'
  ]

  useEffect(() => {
    loadRooms()
    // Initialize with sample data if empty
    if (rooms.length === 0) {
      const sampleRooms = [
        {
          id: uuidv4(),
          roomNumber: '101',
          roomType: 'standard',
          pricePerNight: 99.99,
          capacity: 2,
          amenities: ['WiFi', 'TV', 'AC'],
          status: 'available',
          description: 'Cozy standard room with city view',
          createdAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          roomNumber: '201',
          roomType: 'deluxe',
          pricePerNight: 149.99,
          capacity: 3,
          amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Sea View'],
          status: 'occupied',
          description: 'Spacious deluxe room with ocean view',
          createdAt: new Date().toISOString()
        }
      ]
      saveRooms(sampleRooms)
    }
  }, [])

  const loadRooms = () => {
    const savedRooms = JSON.parse(localStorage.getItem('rooms')) || []
    setRooms(savedRooms)
  }

  const saveRooms = (roomsList) => {
    localStorage.setItem('rooms', JSON.stringify(roomsList))
    loadRooms()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingRoom) {
      // Update existing room
      const updatedRooms = rooms.map(r =>
        r.id === editingRoom.id
          ? { ...formData, id: editingRoom.id, updatedAt: new Date().toISOString() }
          : r
      )
      saveRooms(updatedRooms)
    } else {
      // Add new room
      const newRoom = {
        ...formData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      saveRooms([...rooms, newRoom])
    }
    
    resetForm()
  }

  const handleEdit = (room) => {
    setEditingRoom(room)
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      amenities: room.amenities,
      status: room.status,
      description: room.description
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room? All associated bookings will be affected.')) {
      const updatedRooms = rooms.filter(r => r.id !== id)
      saveRooms(updatedRooms)
    }
  }

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      roomType: 'standard',
      pricePerNight: '',
      capacity: '',
      amenities: ['WiFi', 'TV'],
      status: 'available',
      description: ''
    })
    setEditingRoom(null)
    setShowForm(false)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return '#2ecc71'
      case 'occupied': return '#e74c3c'
      case 'maintenance': return '#f39c12'
      case 'cleaning': return '#3498db'
      default: return '#95a5a6'
    }
  }

  const getRoomTypeLabel = (type) => {
    const roomType = roomTypes.find(rt => rt.value === type)
    return roomType ? roomType.label : type
  }

  return (
    <Layout title="Rooms Management">
      <div className="rooms-page">
        <div className="page-header">
          <h2>Hotel Rooms</h2>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            ➕ Add Room
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Room Number *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    className="form-control"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 101, 201-A"
                  />
                </div>
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    name="roomType"
                    className="form-control"
                    value={formData.roomType}
                    onChange={handleInputChange}
                  >
                    {roomTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Night ($) *</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    className="form-control"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity (Guests) *</label>
                  <select
                    name="capacity"
                    className="form-control"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select capacity</option>
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                    ))}
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
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-grid">
                  {amenitiesList.map(amenity => (
                    <div key={amenity} className="amenity-checkbox">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleCheckboxChange(amenity)}
                      />
                      <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Room features, view, special notes..."
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingRoom ? 'Update' : 'Save'} Room
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
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Type</th>
                  <th>Price/Night</th>
                  <th>Capacity</th>
                  <th>Amenities</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No rooms found. Add your first room!</td>
                  </tr>
                ) : (
                  rooms.map(room => (
                    <tr key={room.id}>
                      <td>
                        <strong>{room.roomNumber}</strong>
                      </td>
                      <td>
                        <span className="type-badge">{getRoomTypeLabel(room.roomType)}</span>
                      </td>
                      <td>${parseFloat(room.pricePerNight).toFixed(2)}</td>
                      <td>
                        <span className="capacity-badge">{room.capacity} Guests</span>
                      </td>
                      <td>
                        <div className="amenities-list">
                          {room.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="amenity-tag">{a}</span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="amenity-more">+{room.amenities.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: `${getStatusColor(room.status)}20`,
                            color: getStatusColor(room.status),
                            border: `1px solid ${getStatusColor(room.status)}`
                          }}
                        >
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(room)} className="btn btn-sm">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(room.id)} className="btn btn-danger btn-sm">
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

export default Rooms