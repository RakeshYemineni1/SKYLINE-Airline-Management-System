import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

function Home() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [searchData, setSearchData] = useState({ source: '', destination: '', date: '' });
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAllFlights, setShowAllFlights] = useState(false);

  useEffect(() => {
    loadAirports();
    loadAllFlights();
  }, []);

  const loadAirports = async () => {
    try {
      const response = await publicAPI.getAllAirports();
      setAirports(response.data);
    } catch (err) {
      console.log('Could not load airports');
    }
  };

  const loadAllFlights = async () => {
    try {
      const response = await publicAPI.getAllFlights();
      console.log('All flights response:', response.data);
      const futureFlights = response.data.filter(flight => 
        new Date(flight.departureTime) > new Date()
      );
      console.log('Future flights:', futureFlights);
      setAllFlights(futureFlights);
    } catch (err) {
      console.error('Could not load flights:', err);
      setError('Could not load flights');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowAllFlights(false);
    try {
      const response = await publicAPI.searchFlights(searchData);
      setFlights(response.data);
      setError(response.data.length === 0 ? 'No flights found' : '');
    } catch (err) {
      setError('Search failed');
    }
    setLoading(false);
  };

  const showAllAvailableFlights = () => {
    setShowAllFlights(true);
    setFlights([]);
    setError('');
    if (allFlights.length === 0) {
      loadAllFlights();
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
    color: colors.text,
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

  const flightCardStyle = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    padding: '20px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const displayFlights = showAllFlights ? allFlights : flights;

  return (
    <div style={pageStyle}>
      <div className="container">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 style={{ fontSize: '48px', marginBottom: '10px', color: colors.primary }}>
            FLIGHT SEARCH
          </h1>
          <p style={{ color: colors.textSecondary }}>Find your perfect flight</p>
        </div>

        {/* Search Form */}
        <div className="card" style={cardStyle}>
          <form onSubmit={handleSearch}>
            <div className="grid grid-3 mb-20">
              
              <div className="form-group">
                <label style={{ color: colors.text }}>FROM</label>
                <select
                  value={searchData.source}
                  onChange={(e) => setSearchData({ ...searchData, source: e.target.value })}
                  style={inputStyle}
                  required
                >
                  <option value="">Select departure city</option>
                  {airports.map(airport => (
                    <option key={airport.id} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ color: colors.text }}>TO</label>
                <select
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  style={inputStyle}
                  required
                >
                  <option value="">Select destination city</option>
                  {airports.map(airport => (
                    <option key={airport.id} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ color: colors.text }}>DATE</label>
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  style={inputStyle}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ 
                  ...buttonStyle,
                  flex: 1,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'SEARCHING...' : 'SEARCH FLIGHTS'}
              </button>
              
              <button 
                type="button" 
                onClick={showAllAvailableFlights}
                className="btn"
                style={{ 
                  background: colors.surface,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  padding: '12px 24px'
                }}
              >
                VIEW ALL FLIGHTS
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error" style={{ 
            background: colors.surface, 
            color: colors.error, 
            border: `1px solid ${colors.error}` 
          }}>
            {error}
          </div>
        )}

        {/* Flight Results */}
        {showAllFlights && allFlights.length === 0 && (
          <div className="text-center" style={{ padding: '40px', color: colors.textSecondary }}>
            <p>NO FLIGHTS AVAILABLE AT THE MOMENT</p>
          </div>
        )}
        
        {displayFlights.length > 0 && (
          <div>
            <h2 style={{ color: colors.primary, marginBottom: '20px' }}>
              {showAllFlights ? `ALL AVAILABLE FLIGHTS (${displayFlights.length})` : `SEARCH RESULTS (${displayFlights.length})`}
            </h2>
            {displayFlights.map((flight) => (
              <div key={flight.id} style={flightCardStyle}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: colors.text }}>
                      {flight.flightNumber}
                    </h3>
                    <span style={{ 
                      background: colors.surface, 
                      color: colors.primary, 
                      padding: '4px 8px', 
                      marginLeft: '10px', 
                      fontSize: '12px',
                      border: `1px solid ${colors.border}`
                    }}>
                      {flight.airline}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                      {flight.sourceAirport?.city || flight.source}
                    </span>
                    <span style={{ margin: '0 15px', color: colors.textSecondary }}>→</span>
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                      {flight.destinationAirport?.city || flight.destination}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: colors.textSecondary }}>
                    <span>{new Date(flight.departureTime).toLocaleString()}</span>
                    <span>{new Date(flight.arrivalTime).toLocaleString()}</span>
                    <span>{flight.availableSeats} seats</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary, marginBottom: '10px' }}>
                    ₹{flight.price}
                  </div>
                  <button 
                    onClick={() => navigate('/booking', { state: { flight } })}
                    className="btn"
                    style={{ 
                      background: colors.primary, 
                      color: colors.background,
                      border: 'none'
                    }}
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;