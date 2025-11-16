import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('flights');
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [showAddAirport, setShowAddAirport] = useState(false);
  
  const [newFlight, setNewFlight] = useState({
    flightNumber: '', airline: '', sourceAirportId: '', destinationAirportId: '',
    departureTime: '', arrivalTime: '', totalSeats: '', price: ''
  });
  
  const [newAirport, setNewAirport] = useState({
    code: '', name: '', city: '', country: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [flightsRes, airportsRes, usersRes, bookingsRes] = await Promise.all([
        adminAPI.getAllFlights(),
        adminAPI.getAllAirports(),
        adminAPI.getAllUsers(),
        adminAPI.getAllBookings()
      ]);
      setFlights(flightsRes.data);
      setAirports(airportsRes.data);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const addFlight = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createFlight({
        flightNumber: newFlight.flightNumber,
        airline: newFlight.airline,
        sourceAirport: { id: parseInt(newFlight.sourceAirportId) },
        destinationAirport: { id: parseInt(newFlight.destinationAirportId) },
        departureTime: newFlight.departureTime,
        arrivalTime: newFlight.arrivalTime,
        totalSeats: parseInt(newFlight.totalSeats),
        availableSeats: parseInt(newFlight.totalSeats),
        price: parseFloat(newFlight.price)
      });
      setNewFlight({ flightNumber: '', airline: '', sourceAirportId: '', destinationAirportId: '', departureTime: '', arrivalTime: '', totalSeats: '', price: '' });
      setShowAddFlight(false);
      loadData();
      alert('Flight added successfully!');
    } catch (err) {
      alert('Error adding flight: ' + (err.response?.data?.message || err.message));
    }
  };

  const addAirport = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createAirport(newAirport);
      setNewAirport({ code: '', name: '', city: '', country: '' });
      setShowAddAirport(false);
      loadData();
      alert('Airport added successfully!');
    } catch (err) {
      alert('Error adding airport');
    }
  };

  const deleteFlight = async (id) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        await adminAPI.deleteFlight(id);
        loadData();
        alert('Flight deleted successfully!');
      } catch (err) {
        alert('Error deleting flight');
      }
    }
  };

  const deleteAirport = async (id) => {
    if (window.confirm('Are you sure you want to delete this airport?')) {
      try {
        await adminAPI.deleteAirport(id);
        loadData();
        alert('Airport deleted successfully!');
      } catch (err) {
        alert('Error deleting airport');
      }
    }
  };

  const toggleUserLock = async (id) => {
    try {
      await adminAPI.toggleUserLock(id);
      loadData();
    } catch (err) {
      alert('Error updating user status');
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await adminAPI.deleteBooking(id);
        loadData();
        alert('Booking deleted successfully!');
      } catch (err) {
        alert('Error deleting booking');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '28px' }}>Admin Dashboard</h1>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Manage flights, airports, users, and bookings</p>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e1e5e9' }}>
          {[
            { key: 'flights', label: 'Flights', count: flights.length },
            { key: 'airports', label: 'Airports', count: airports.length },
            { key: 'users', label: 'Users', count: users.length },
            { key: 'bookings', label: 'Bookings', count: bookings.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '15px 20px',
                border: 'none',
                background: activeTab === tab.key ? '#f8f9fa' : 'transparent',
                borderBottom: activeTab === tab.key ? '3px solid #007bff' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
          
          {/* Flights Tab */}
          {activeTab === 'flights' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Flight Management</h2>
                <button 
                  onClick={() => setShowAddFlight(!showAddFlight)}
                  style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  + Add Flight
                </button>
              </div>

              {showAddFlight && (
                <form onSubmit={addFlight} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <input placeholder="Flight Number" value={newFlight.flightNumber} onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})} required />
                    <input placeholder="Airline" value={newFlight.airline} onChange={(e) => setNewFlight({...newFlight, airline: e.target.value})} required />
                    <select value={newFlight.sourceAirportId} onChange={(e) => setNewFlight({...newFlight, sourceAirportId: e.target.value})} required>
                      <option value="">Select Source Airport</option>
                      {airports.map(airport => <option key={airport.id} value={airport.id}>{airport.city} ({airport.code})</option>)}
                    </select>
                    <select value={newFlight.destinationAirportId} onChange={(e) => setNewFlight({...newFlight, destinationAirportId: e.target.value})} required>
                      <option value="">Select Destination Airport</option>
                      {airports.map(airport => <option key={airport.id} value={airport.id}>{airport.city} ({airport.code})</option>)}
                    </select>
                    <input type="datetime-local" placeholder="Departure Time" value={newFlight.departureTime} onChange={(e) => setNewFlight({...newFlight, departureTime: e.target.value})} required />
                    <input type="datetime-local" placeholder="Arrival Time" value={newFlight.arrivalTime} onChange={(e) => setNewFlight({...newFlight, arrivalTime: e.target.value})} required />
                    <input type="number" placeholder="Total Seats" value={newFlight.totalSeats} onChange={(e) => setNewFlight({...newFlight, totalSeats: e.target.value})} required />
                    <input type="number" step="0.01" placeholder="Price" value={newFlight.price} onChange={(e) => setNewFlight({...newFlight, price: e.target.value})} required />
                  </div>
                  <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Flight</button>
                </form>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Flight</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Route</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Schedule</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Seats</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Price</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map(flight => (
                      <tr key={flight.id}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          <div><strong>{flight.flightNumber}</strong></div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{flight.airline}</div>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          {flight.sourceAirport?.city} → {flight.destinationAirport?.city}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          <div>{new Date(flight.departureTime).toLocaleString()}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{new Date(flight.arrivalTime).toLocaleString()}</div>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          {flight.availableSeats}/{flight.totalSeats}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          ${flight.price}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                          <button onClick={() => deleteFlight(flight.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Airports Tab */}
          {activeTab === 'airports' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Airport Management</h2>
                <button 
                  onClick={() => setShowAddAirport(!showAddAirport)}
                  style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  + Add Airport
                </button>
              </div>

              {showAddAirport && (
                <form onSubmit={addAirport} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <input placeholder="Airport Code (e.g., JFK)" value={newAirport.code} onChange={(e) => setNewAirport({...newAirport, code: e.target.value.toUpperCase()})} required />
                    <input placeholder="Airport Name" value={newAirport.name} onChange={(e) => setNewAirport({...newAirport, name: e.target.value})} required />
                    <input placeholder="City" value={newAirport.city} onChange={(e) => setNewAirport({...newAirport, city: e.target.value})} required />
                    <input placeholder="Country" value={newAirport.country} onChange={(e) => setNewAirport({...newAirport, country: e.target.value})} required />
                  </div>
                  <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Airport</button>
                </form>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                {airports.map(airport => (
                  <div key={airport.id} style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{airport.code}</h3>
                    <p style={{ margin: '5px 0', fontWeight: '600' }}>{airport.name}</p>
                    <p style={{ margin: '5px 0', color: '#666' }}>{airport.city}, {airport.country}</p>
                    <button onClick={() => deleteAirport(airport.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>User Management</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>User</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {user.firstName} {user.lastName}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{user.email}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{ background: user.role === 'ADMIN' ? '#ff5722' : '#4caf50', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {user.locked ? 'Locked' : 'Active'}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <button onClick={() => toggleUserLock(user.id)} style={{ padding: '5px 10px', background: user.locked ? '#28a745' : '#ffc107', color: user.locked ? 'white' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          {user.locked ? 'Unlock' : 'Lock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Booking Management</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Reference</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Flight</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Passenger</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Amount</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{booking.bookingReference}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {booking.flight?.flightNumber} - {booking.flight?.airline}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{booking.passengerName}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>${booking.totalAmount}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{ background: booking.paymentStatus === 'COMPLETED' ? '#4caf50' : '#ff9800', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <button onClick={() => deleteBooking(booking.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;