import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from '../api/axiosInstance';
import { getAuth } from 'firebase/auth';
const API = import.meta.env.VITE_API_URL;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const { data } = await axios.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const cardStyle = (read) => ({
    borderLeft: `5px solid ${read ? '#ccc' : '#0d6efd'}`,
    borderRadius: '14px',
    backgroundColor: read ? '#ffffff' : '#f5f9ff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    padding: '1rem',
    transition: '0.3s ease',
  });

  const titleStyle = {
    fontWeight: '600',
    fontSize: '1.1rem',
    color: '#333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const textStyle = {
    fontSize: '0.95rem',
    color: '#444',
    marginTop: '0.5rem',
    lineHeight: '1.4',
  };

  const timeStyle = {
    fontSize: '0.75rem',
    color: '#888',
    marginTop: '0.75rem',
    display: 'block',
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center" style={{ fontWeight: 'bold', color: '#222' }}>
        🔔 Notifications
      </h3>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : notifications.length === 0 ? (
        <Alert variant="info" className="text-center" style={{ fontSize: '0.95rem' }}>
          No notifications yet.
        </Alert>
      ) : (
        notifications.map((note) => (
          <Card key={note._id} className="mb-3" style={cardStyle(note.read)}>
            <Card.Body>
              <div style={titleStyle}>
                {note.title}
                {!note.read && <Badge bg="primary">New</Badge>}
              </div>
              <div style={textStyle}>{note.message}</div>
              <small style={timeStyle}>
                {new Date(note.createdAt).toLocaleString()}
              </small>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default NotificationPage;
