import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaBell, FaTrash } from 'react-icons/fa';
import axios from '../api/axiosInstance';
import AdminLayout from '../layouts/AdminLayout';

const ITEMS_PER_PAGE = 6;

const AdminNotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { firebaseToken } = useAuth();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/notifications');
      setNotifications(Array.isArray(res.data) ? res.data.reverse() : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !message.trim()) return;
    try {
      await axios.post(
        '/notifications',
        { title, message },
        {
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
          },
        }
      );
      setTitle('');
      setMessage('');
      fetchNotifications();
    } catch (err) {
      console.error('Create error:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (firebaseToken) fetchNotifications();
  }, [firebaseToken]);

  // Pagination logic
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <AdminLayout>
      <div className="container py-5" style={{ minHeight: '100vh' }}>
        <h2 className="mb-4 text-center text-dark fw-bold">📢 Admin Notifications</h2>

        <div className="p-4 mb-5 rounded shadow-sm bg-white border" style={{ maxWidth: '600px', margin: '0 auto' }}>
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

        {loading ? (
          <div className="text-center text-muted">Loading notifications...</div>
        ) : paginatedNotifications.length > 0 ? (
          <>
            <div className="row g-4">
              {paginatedNotifications.map((n) => (
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
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(n._id)}>
                        <FaTrash className="me-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-center align-items-center mt-4">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="mx-2 text-muted">Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-outline-secondary ms-2"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted">No notifications found.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNotificationPage;
