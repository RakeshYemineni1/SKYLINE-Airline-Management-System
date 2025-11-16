import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await customerAPI.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Error fetching bookings');
    }
  };

  const handleDownloadTicket = async (id) => {
    try {
      const response = await customerAPI.downloadTicket(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Error downloading ticket');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>My Bookings</h2>
        {error && <div className="error">{error}</div>}
        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Flight</th>
                <th>Passenger</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.bookingReference}</td>
                  <td>{booking.flight.flightNumber}</td>
                  <td>{booking.passengerName}</td>
                  <td>{booking.numberOfSeats}</td>
                  <td>${booking.totalAmount}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDownloadTicket(booking.id)}
                    >
                      Download Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
