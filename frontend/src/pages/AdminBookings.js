import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Error fetching bookings');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await adminAPI.deleteBooking(id);
        fetchBookings();
      } catch (err) {
        setError('Error deleting booking');
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>All Bookings</h2>
        {error && <div className="error">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Flight</th>
              <th>Passenger</th>
              <th>Email</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.bookingReference}</td>
                <td>{booking.flight.flightNumber}</td>
                <td>{booking.passengerName}</td>
                <td>{booking.passengerEmail}</td>
                <td>{booking.numberOfSeats}</td>
                <td>${booking.totalAmount}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookings;
