import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBell, FaTrash } from 'react-icons/fa';
import axios from '../api/axiosInstance';

const AdminNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { firebaseToken } = useAuth();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setNotifications([]);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !message.trim()) return;
    try {
      await axios.post('/notifications', { title, message });
      setTitle('');
      setMessage('');
      fetchNotifications();
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    if (firebaseToken) {
      fetchNotifications();
    }
  }, [firebaseToken]);

  return (
    <div className="container py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <h2 className="mb-4 text-center text-dark fw-bold">📢 Admin Notifications</h2>

      <div
        className="p-4 mb-5 rounded shadow-sm bg-white border"
        style={{ maxWidth: '600px', margin: '0 auto' }}
      >
        <input
          type="text"
          className="form-control mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notification Title"
        />
        <textarea
          className="form-control mb-3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Notification Message"
        />
        <button className="btn btn-primary w-100" onClick={handleCreate}>
          ➕ Create Notification
        </button>
      </div>

      <div className="row g-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n._id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <FaBell className="text-primary me-2" />
                    <h5 className="card-title mb-0">{n.title}</h5>
                  </div>
                  <p className="card-text small text-muted">{n.message}</p>
                </div>
                <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(n._id)}
                  >
                    <FaTrash className="me-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted">No notifications found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminNotificationPage;
