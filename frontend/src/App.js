import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboardMain from './pages/AdminDashboardMain';
import AdminUsers from './pages/AdminUsers';
import AdminAirports from './pages/AdminAirports';
import AdminFlights from './pages/AdminFlights';
import AdminBookings from './pages/AdminBookings';
import { isAuthenticated, isAdmin, isCustomer } from './utils/auth';

function PrivateRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminOnly>
              <AdminDashboardMain />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute adminOnly>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/airports"
          element={
            <PrivateRoute adminOnly>
              <AdminAirports />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/flights"
          element={
            <PrivateRoute adminOnly>
              <AdminFlights />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <PrivateRoute adminOnly>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
