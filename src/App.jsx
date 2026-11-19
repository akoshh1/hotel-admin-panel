import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Bookings from './pages/Bookings'
import Customers from './pages/Customers'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
        <Route path="/admin/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
        <Route path="/admin/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App