import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL;

const AdminActivityPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/admin-activity'); 
      setLogs(data);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      toast.error('Failed to load admin activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Admin Activity Logs</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : logs.length === 0 ? (
        <Alert variant="info">No activity logs found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Admin</th>
              <th>Action</th>
              <th>Target Type</th>
              <th>Target ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.admin?.name || 'Unknown'} ({log.admin?.email})</td>
                <td>{log.action}</td>
                <td>{log.targetType || '—'}</td>
                <td>{log.targetId || '—'}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminActivityPage;
