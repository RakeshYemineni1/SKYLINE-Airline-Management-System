import React, { useState, useEffect } from 'react';
import { getUser } from '../utils/auth';
import { customerAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

function Profile() {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadBookings();
  }, []);

  const loadUserData = () => {
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  };

  const loadBookings = async () => {
    try {
      const response = await customerAPI.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      console.log('Could not load bookings');
    }
  };

  const downloadTicket = async (bookingId) => {
    try {
      const response = await customerAPI.downloadTicket(bookingId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Could not download ticket');
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    background: colors.background,
    color: colors.text,
    padding: '20px'
  };

  const cardStyle = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    marginBottom: '30px'
  };

  const buttonStyle = {
    background: colors.primary,
    color: colors.background,
    border: 'none',
    padding: '8px 16px',
    cursor: 'pointer'
  };

  if (loading) return (
    <div style={{ ...pageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: colors.textSecondary }}>LOADING...</div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <div className="container">
        
        {/* Profile Header */}
        <div className="card" style={{ ...cardStyle, padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.background,
              fontSize: '32px',
              marginRight: '20px'
            }}>
              U
            </div>
            <div>
              <h1 style={{ margin: 0, color: colors.primary, fontSize: '28px' }}>
                {user?.firstName} {user?.lastName}
              </h1>
              <p style={{ margin: '5px 0', color: colors.textSecondary, fontSize: '16px' }}>{user?.email}</p>
              <span style={{ 
                background: user?.role === 'ADMIN' ? colors.error : colors.primary, 
                color: colors.background, 
                padding: '4px 12px', 
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {user?.role}
              </span>
            </div>
          </div>
          
          <div className="grid grid-2">
            <div>
              <h3 style={{ color: colors.primary, marginBottom: '10px' }}>CONTACT INFORMATION</h3>
              <p style={{ color: colors.text }}><strong>PHONE:</strong> {user?.phoneNumber || 'Not provided'}</p>
              <p style={{ color: colors.text }}><strong>MEMBER SINCE:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 style={{ color: colors.primary, marginBottom: '10px' }}>ACCOUNT STATUS</h3>
              <p style={{ color: colors.text }}><strong>STATUS:</strong> {user?.locked ? 'LOCKED' : 'ACTIVE'}</p>
              <p style={{ color: colors.text }}><strong>TOTAL BOOKINGS:</strong> {bookings.length}</p>
            </div>
          </div>
        </div>

        {/* Booking History */}
        <div className="card" style={{ ...cardStyle, padding: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: colors.primary }}>MY BOOKINGS</h2>
          
          {bookings.length === 0 ? (
            <div className="text-center" style={{ padding: '40px', color: colors.textSecondary }}>
              <p>NO BOOKINGS YET. START EXPLORING FLIGHTS!</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} style={{ 
                border: `1px solid ${colors.border}`, 
                padding: '20px', 
                marginBottom: '15px',
                background: colors.surface
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: colors.primary }}>
                      {booking.flight?.flightNumber} - {booking.flight?.airline}
                    </h3>
                    <div className="grid grid-2 mb-20">
                      <div>
                        <p style={{ color: colors.text }}><strong>ROUTE:</strong> {booking.flight?.sourceAirport?.city} → {booking.flight?.destinationAirport?.city}</p>
                        <p style={{ color: colors.text }}><strong>PASSENGER:</strong> {booking.passengerName}</p>
                        <p style={{ color: colors.text }}><strong>SEATS:</strong> {booking.numberOfSeats}</p>
                      </div>
                      <div>
                        <p style={{ color: colors.text }}><strong>DEPARTURE:</strong> {new Date(booking.flight?.departureTime).toLocaleString()}</p>
                        <p style={{ color: colors.text }}><strong>BOOKING DATE:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                        <p style={{ color: colors.text }}><strong>REFERENCE:</strong> {booking.bookingReference}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ 
                        background: booking.paymentStatus === 'COMPLETED' ? colors.primary : colors.warning, 
                        color: colors.background, 
                        padding: '4px 8px', 
                        fontSize: '12px' 
                      }}>
                        {booking.paymentStatus}
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: colors.primary }}>
                        ₹{booking.totalAmount}
                      </span>
                    </div>
                  </div>
                  
                  {booking.paymentStatus === 'COMPLETED' && (
                    <button 
                      onClick={() => downloadTicket(booking.id)}
                      className="btn"
                      style={buttonStyle}
                    >
                      DOWNLOAD TICKET
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;