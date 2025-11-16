import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { customerAPI, authAPI } from '../services/api';
import { isAuthenticated, setAuth } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const flight = location.state?.flight;

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    flightId: flight?.id,
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    passportNumber: '',
    numberOfSeats: 1,
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const pageStyle = {
    minHeight: '100vh',
    background: colors.background,
    color: colors.text,
    padding: '20px'
  };

  const cardStyle = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    marginBottom: '20px'
  };

  const inputStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.text
  };

  const buttonStyle = {
    background: colors.primary,
    color: colors.background,
    border: 'none'
  };

  if (!flight) {
    return (
      <div style={pageStyle}>
        <div className="container">
          <div className="error" style={{ background: colors.surface, color: colors.error, border: `1px solid ${colors.error}` }}>
            NO FLIGHT SELECTED
          </div>
        </div>
      </div>
    );
  }

  const handleTravelerSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated()) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authAPI.login(authData);
      setAuth(response.data.token, response.data.user);
      setStep(2);
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await customerAPI.createBooking(bookingData);
      setSuccess('Booking successful! Reference: ' + response.data.bookingReference);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div style={pageStyle}>
      <div className="container">
        
        {/* Flight Details */}
        <div className="card" style={cardStyle}>
          <h2 style={{ color: colors.primary, marginBottom: '15px' }}>FLIGHT DETAILS</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '5px 0', fontSize: '18px' }}>
                <strong style={{ color: colors.primary }}>{flight.flightNumber}</strong> - {flight.airline}
              </p>
              <p style={{ margin: '5px 0', color: colors.textSecondary }}>
                {flight.sourceAirport?.name || flight.source} → {flight.destinationAirport?.name || flight.destination}
              </p>
              <p style={{ margin: '5px 0', color: colors.textSecondary }}>
                {new Date(flight.departureTime).toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>
                ₹{flight.price}
              </div>
              <div style={{ color: colors.textSecondary, fontSize: '14px' }}>per seat</div>
            </div>
          </div>
        </div>

        {/* Step 1: Traveler Details */}
        {step === 1 && (
          <div className="card" style={cardStyle}>
            <h2 style={{ color: colors.primary, marginBottom: '20px' }}>TRAVELER DETAILS</h2>
            <form onSubmit={handleTravelerSubmit}>
              <div className="grid grid-2 mb-20">
                <div className="form-group">
                  <label style={{ color: colors.text }}>PASSENGER NAME</label>
                  <input
                    type="text"
                    value={bookingData.passengerName}
                    onChange={(e) => setBookingData({ ...bookingData, passengerName: e.target.value })}
                    style={inputStyle}
                    placeholder="Full name as per ID"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: colors.text }}>EMAIL</label>
                  <input
                    type="email"
                    value={bookingData.passengerEmail}
                    onChange={(e) => setBookingData({ ...bookingData, passengerEmail: e.target.value })}
                    style={inputStyle}
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: colors.text }}>PHONE NUMBER</label>
                  <input
                    type="tel"
                    value={bookingData.passengerPhone}
                    onChange={(e) => setBookingData({ ...bookingData, passengerPhone: e.target.value })}
                    style={inputStyle}
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: colors.text }}>PASSPORT NUMBER</label>
                  <input
                    type="text"
                    value={bookingData.passportNumber}
                    onChange={(e) => setBookingData({ ...bookingData, passportNumber: e.target.value })}
                    style={inputStyle}
                    placeholder="Passport number (optional)"
                  />
                </div>
              </div>
              <div className="form-group">
                <label style={{ color: colors.text }}>NUMBER OF SEATS</label>
                <input
                  type="number"
                  min="1"
                  max={flight.availableSeats}
                  value={bookingData.numberOfSeats}
                  onChange={(e) => setBookingData({ ...bookingData, numberOfSeats: parseInt(e.target.value) })}
                  style={inputStyle}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ ...buttonStyle, width: '100%' }}>
                CONTINUE
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Login */}
        {step === 3 && (
          <div className="card" style={cardStyle}>
            <h2 style={{ color: colors.primary, marginBottom: '20px' }}>LOGIN TO CONTINUE</h2>
            {error && (
              <div className="error" style={{ 
                background: colors.surface, 
                color: colors.error, 
                border: `1px solid ${colors.error}`,
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}
            <form onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label style={{ color: colors.text }}>EMAIL</label>
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  style={inputStyle}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: colors.text }}>PASSWORD</label>
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  style={inputStyle}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ ...buttonStyle, width: '100%' }}>
                LOGIN & CONTINUE
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="card" style={cardStyle}>
            <h2 style={{ color: colors.primary, marginBottom: '20px' }}>PAYMENT DETAILS</h2>
            {error && (
              <div className="error" style={{ 
                background: colors.surface, 
                color: colors.error, 
                border: `1px solid ${colors.error}`,
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}
            {success && (
              <div className="success" style={{ 
                background: colors.surface, 
                color: colors.primary, 
                border: `1px solid ${colors.primary}`,
                marginBottom: '20px'
              }}>
                {success}
              </div>
            )}
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid grid-2 mb-20">
                <div className="form-group">
                  <label style={{ color: colors.text }}>CARD NUMBER</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={bookingData.cardNumber}
                    onChange={(e) => setBookingData({ ...bookingData, cardNumber: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: colors.text }}>EXPIRY DATE</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={bookingData.cardExpiry}
                    onChange={(e) => setBookingData({ ...bookingData, cardExpiry: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label style={{ color: colors.text }}>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={bookingData.cardCvv}
                  onChange={(e) => setBookingData({ ...bookingData, cardCvv: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div style={{ 
                background: colors.surface, 
                padding: '20px', 
                marginBottom: '20px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: colors.text }}>SEATS: {bookingData.numberOfSeats}</span>
                  <span style={{ color: colors.text }}>₹{flight.price} × {bookingData.numberOfSeats}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                  <span style={{ color: colors.primary }}>TOTAL AMOUNT:</span>
                  <span style={{ color: colors.primary }}>₹{flight.price * bookingData.numberOfSeats}</span>
                </div>
              </div>
              
              <button type="submit" className="btn btn-success" style={{ ...buttonStyle, width: '100%' }}>
                PAY & CONFIRM BOOKING
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;