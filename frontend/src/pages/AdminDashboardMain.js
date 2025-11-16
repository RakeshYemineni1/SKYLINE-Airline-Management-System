import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { clearAuth, getUser } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

function AdminDashboardMain() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [stats, setStats] = useState({ users: 0, flights: 0, airports: 0, bookings: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [data, setData] = useState({
    flights: [], airports: [], users: [], bookings: []
  });
  const [showAddForms, setShowAddForms] = useState({
    flight: false, airport: false
  });
  const [newFlight, setNewFlight] = useState({
    flightNumber: '', airline: '', sourceAirportId: '', destinationAirportId: '',
    departureTime: '', arrivalTime: '', totalSeats: '', price: ''
  });
  const [newAirport, setNewAirport] = useState({
    code: '', name: '', city: '', country: ''
  });

  const user = getUser();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [flights, airports, users, bookings] = await Promise.all([
        adminAPI.getAllFlights(),
        adminAPI.getAllAirports(),
        adminAPI.getAllUsers(),
        adminAPI.getAllBookings()
      ]);
      
      setData({
        flights: flights.data,
        airports: airports.data,
        users: users.data,
        bookings: bookings.data
      });
      
      setStats({
        flights: flights.data.length,
        airports: airports.data.length,
        users: users.data.length,
        bookings: bookings.data.length
      });
      
      setRecentBookings(bookings.data.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
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
      setShowAddForms({ ...showAddForms, flight: false });
      loadDashboardData();
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
      setShowAddForms({ ...showAddForms, airport: false });
      loadDashboardData();
      alert('Airport added successfully!');
    } catch (err) {
      alert('Error adding airport');
    }
  };

  const deleteFlight = async (id) => {
    if (window.confirm('Delete this flight?')) {
      try {
        await adminAPI.deleteFlight(id);
        loadDashboardData();
      } catch (err) {
        alert('Error deleting flight');
      }
    }
  };

  const deleteAirport = async (id) => {
    if (window.confirm('Delete this airport?')) {
      try {
        await adminAPI.deleteAirport(id);
        loadDashboardData();
      } catch (err) {
        alert('Error deleting airport');
      }
    }
  };

  const toggleUserLock = async (id) => {
    try {
      await adminAPI.toggleUserLock(id);
      loadDashboardData();
    } catch (err) {
      alert('Error updating user');
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    background: colors.background,
    color: colors.text
  };

  const headerStyle = {
    background: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    padding: '15px 0'
  };

  const cardStyle = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    marginBottom: '20px'
  };

  const inputStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    padding: '10px'
  };

  const buttonStyle = {
    background: colors.primary,
    color: colors.background,
    border: 'none'
  };

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    border: 'none',
    background: isActive ? colors.primary : colors.surface,
    color: isActive ? colors.background : colors.text,
    cursor: 'pointer',
    fontWeight: '500'
  });

  return (
    <div style={pageStyle}>
      
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: colors.primary, fontSize: '24px' }}>ADMIN DASHBOARD</h1>
            <p style={{ margin: '5px 0 0 0', color: colors.textSecondary }}>Welcome, {user?.firstName}</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: colors.error, color: colors.background, border: 'none', cursor: 'pointer' }}>
            LOGOUT
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* Navigation */}
        <div className="card" style={{ ...cardStyle, padding: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { key: 'overview', label: 'OVERVIEW' },
              { key: 'flights', label: 'FLIGHTS' },
              { key: 'airports', label: 'AIRPORTS' },
              { key: 'users', label: 'USERS' },
              { key: 'bookings', label: 'BOOKINGS' }
            ].map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                style={tabStyle(activeSection === section.key)}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-4 mb-20">
              {[
                { title: 'FLIGHTS', count: stats.flights, icon: '' },
                { title: 'AIRPORTS', count: stats.airports, icon: '' },
                { title: 'USERS', count: stats.users, icon: '' },
                { title: 'BOOKINGS', count: stats.bookings, icon: '' }
              ].map((stat, index) => (
                <div key={index} className="card text-center" style={cardStyle}>

                  <h3 style={{ margin: '0 0 5px 0', fontSize: '24px', color: colors.primary }}>{stat.count}</h3>
                  <p style={{ margin: 0, color: colors.textSecondary }}>{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div className="card" style={cardStyle}>
              <h3 style={{ marginBottom: '15px', color: colors.primary }}>RECENT BOOKINGS</h3>
              {recentBookings.map(booking => (
                <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                  <div>
                    <strong style={{ color: colors.text }}>{booking.passengerName}</strong> - {booking.flight?.flightNumber}
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                  </div>
                  <span style={{ color: colors.primary, fontWeight: 'bold' }}>₹{booking.totalAmount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flights Section */}
        {activeSection === 'flights' && (
          <div className="card" style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: colors.primary }}>FLIGHT MANAGEMENT</h3>
              <button onClick={() => setShowAddForms({ ...showAddForms, flight: !showAddForms.flight })} className="btn" style={buttonStyle}>
                + ADD FLIGHT
              </button>
            </div>

            {showAddForms.flight && (
              <form onSubmit={addFlight} style={{ background: colors.surface, padding: '20px', marginBottom: '20px' }}>
                <div className="grid grid-2 mb-20">
                  <input placeholder="Flight Number" value={newFlight.flightNumber} onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})} style={inputStyle} required />
                  <select value={newFlight.airline} onChange={(e) => setNewFlight({...newFlight, airline: e.target.value})} style={inputStyle} required>
                    <option value="">Select Airline</option>
                    <option value="IndiGo">IndiGo</option>
                    <option value="Air India">Air India</option>
                    <option value="SpiceJet">SpiceJet</option>
                    <option value="Vistara">Vistara</option>
                    <option value="GoAir">GoAir</option>
                    <option value="AirAsia India">AirAsia India</option>
                    <option value="Alliance Air">Alliance Air</option>
                    <option value="Akasa Air">Akasa Air</option>
                  </select>
                  <select value={newFlight.sourceAirportId} onChange={(e) => setNewFlight({...newFlight, sourceAirportId: e.target.value})} style={inputStyle} required>
                    <option value="">Select Source Airport</option>
                    {data.airports.map(airport => <option key={airport.id} value={airport.id}>{airport.city} ({airport.code})</option>)}
                  </select>
                  <select value={newFlight.destinationAirportId} onChange={(e) => setNewFlight({...newFlight, destinationAirportId: e.target.value})} style={inputStyle} required>
                    <option value="">Select Destination Airport</option>
                    {data.airports.map(airport => <option key={airport.id} value={airport.id}>{airport.city} ({airport.code})</option>)}
                  </select>
                  <input type="datetime-local" value={newFlight.departureTime} onChange={(e) => setNewFlight({...newFlight, departureTime: e.target.value})} style={inputStyle} required />
                  <input type="datetime-local" value={newFlight.arrivalTime} onChange={(e) => setNewFlight({...newFlight, arrivalTime: e.target.value})} style={inputStyle} required />
                  <input type="number" placeholder="Total Seats" value={newFlight.totalSeats} onChange={(e) => setNewFlight({...newFlight, totalSeats: e.target.value})} style={inputStyle} required />
                  <input type="number" step="0.01" placeholder="Price" value={newFlight.price} onChange={(e) => setNewFlight({...newFlight, price: e.target.value})} style={inputStyle} required />
                </div>
                <button type="submit" className="btn" style={buttonStyle}>ADD FLIGHT</button>
              </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.surface }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>FLIGHT</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>ROUTE</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>PRICE</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.flights.map(flight => (
                  <tr key={flight.id}>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>
                      <strong>{flight.flightNumber}</strong><br/>
                      <small style={{ color: colors.textSecondary }}>{flight.airline}</small>
                    </td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>
                      {flight.sourceAirport?.city} → {flight.destinationAirport?.city}
                    </td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>₹{flight.price}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
                      <button onClick={() => deleteFlight(flight.id)} style={{ padding: '5px 10px', background: colors.error, color: colors.background, border: 'none', cursor: 'pointer' }}>DELETE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Airports Section */}
        {activeSection === 'airports' && (
          <div className="card" style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: colors.primary }}>AIRPORT MANAGEMENT</h3>
              <button onClick={() => setShowAddForms({ ...showAddForms, airport: !showAddForms.airport })} className="btn" style={buttonStyle}>
                + ADD AIRPORT
              </button>
            </div>

            {showAddForms.airport && (
              <form onSubmit={addAirport} style={{ background: colors.surface, padding: '20px', marginBottom: '20px' }}>
                <div className="grid grid-2 mb-20">
                  <input placeholder="Airport Code (JFK)" value={newAirport.code} onChange={(e) => setNewAirport({...newAirport, code: e.target.value.toUpperCase()})} style={inputStyle} required />
                  <input placeholder="Airport Name" value={newAirport.name} onChange={(e) => setNewAirport({...newAirport, name: e.target.value})} style={inputStyle} required />
                  <input placeholder="City" value={newAirport.city} onChange={(e) => setNewAirport({...newAirport, city: e.target.value})} style={inputStyle} required />
                  <input placeholder="Country" value={newAirport.country} onChange={(e) => setNewAirport({...newAirport, country: e.target.value})} style={inputStyle} required />
                </div>
                <button type="submit" className="btn" style={buttonStyle}>ADD AIRPORT</button>
              </form>
            )}

            <div className="grid grid-3">
              {data.airports.map(airport => (
                <div key={airport.id} className="card" style={{ ...cardStyle, padding: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: colors.primary }}>{airport.code}</h4>
                  <p style={{ margin: '5px 0', fontWeight: '600', color: colors.text }}>{airport.name}</p>
                  <p style={{ margin: '5px 0', color: colors.textSecondary }}>{airport.city}, {airport.country}</p>
                  <button onClick={() => deleteAirport(airport.id)} style={{ padding: '5px 10px', background: colors.error, color: colors.background, border: 'none', cursor: 'pointer', marginTop: '10px' }}>DELETE</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="card" style={cardStyle}>
            <h3 style={{ marginBottom: '20px', color: colors.primary }}>USER MANAGEMENT</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.surface }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>USER</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>EMAIL</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>ROLE</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>STATUS</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>{user.firstName} {user.lastName}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>{user.email}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ background: user.role === 'ADMIN' ? colors.error : colors.primary, color: colors.background, padding: '2px 8px', fontSize: '12px' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>{user.locked ? 'LOCKED' : 'ACTIVE'}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
                      <button onClick={() => toggleUserLock(user.id)} style={{ padding: '5px 10px', background: user.locked ? colors.primary : colors.warning, color: colors.background, border: 'none', cursor: 'pointer' }}>
                        {user.locked ? 'UNLOCK' : 'LOCK'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bookings Section */}
        {activeSection === 'bookings' && (
          <div className="card" style={cardStyle}>
            <h3 style={{ marginBottom: '20px', color: colors.primary }}>BOOKING MANAGEMENT</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.surface }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>REFERENCE</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>PASSENGER</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>FLIGHT</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>AMOUNT</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.map(booking => (
                  <tr key={booking.id}>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>{booking.bookingReference}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>{booking.passengerName}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>{booking.flight?.flightNumber}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>₹{booking.totalAmount}</td>
                    <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ background: booking.paymentStatus === 'COMPLETED' ? colors.primary : colors.warning, color: colors.background, padding: '2px 8px', fontSize: '12px' }}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardMain;