import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await adminAPI.getAllFlights();
      setFlights(response.data);
    } catch (err) {
      setError('Error fetching flights');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Manage Flights</h2>
        {error && <div className="error">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Flight Number</th>
              <th>Route</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Total Seats</th>
              <th>Available</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.flightNumber}</td>
                <td>{flight.sourceAirport.code} → {flight.destinationAirport.code}</td>
                <td>{new Date(flight.departureTime).toLocaleString()}</td>
                <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                <td>{flight.totalSeats}</td>
                <td>{flight.availableSeats}</td>
                <td>${flight.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFlights;
