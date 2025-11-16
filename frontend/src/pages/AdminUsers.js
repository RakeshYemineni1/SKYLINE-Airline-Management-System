import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users');
    }
  };

  const handleToggleLock = async (id) => {
    try {
      await adminAPI.toggleUserLock(id);
      fetchUsers();
    } catch (err) {
      setError('Error toggling user lock');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Error deleting user');
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Manage Users</h2>
        {error && <div className="error">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role}</td>
                <td>{user.locked ? 'Locked' : 'Active'}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleToggleLock(user.id)}
                    style={{ marginRight: '5px' }}
                  >
                    {user.locked ? 'Unlock' : 'Lock'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user.id)}
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

export default AdminUsers;
