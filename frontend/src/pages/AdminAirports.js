import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminAirports() {
  const [airports, setAirports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', city: '', country: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await adminAPI.getAllAirports();
      setAirports(response.data);
    } catch (err) {
      setError('Error fetching airports');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createAirport(formData);
      setFormData({ code: '', name: '', city: '', country: '' });
      setShowForm(false);
      fetchAirports();
    } catch (err) {
      setError('Error creating airport');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this airport?')) {
      try {
        await adminAPI.deleteAirport(id);
        fetchAirports();
      } catch (err) {
        setError('Error deleting airport');
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Manage Airports</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Airport'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Airport Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Airport Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Create Airport</button>
          </form>
        )}

        {error && <div className="error">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {airports.map((airport) => (
              <tr key={airport.id}>
                <td>{airport.code}</td>
                <td>{airport.name}</td>
                <td>{airport.city}</td>
                <td>{airport.country}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(airport.id)}
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

export default AdminAirports;
