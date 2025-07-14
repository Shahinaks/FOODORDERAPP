import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
const API = import.meta.env.VITE_API_URL;

const AdminPaymentsPage = () => {
  const { firebaseToken } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPayments = async () => {
    try {
      const res = await axios.get('/payments/all', {
        headers: {
          Authorization: `Bearer ${firebaseToken}`,
        },
      });
      setPayments(res.data);
    } catch (err) {
      console.error('Admin payment fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firebaseToken) fetchAllPayments();
  }, [firebaseToken]);

  return (
    <Container className="py-4">
      <h3 className="mb-4">All Payments (Admin)</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : payments.length === 0 ? (
        <Alert variant="info">No payment records found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Order</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.user?.name || '—'}</td>
                <td>{p.order?._id || '—'}</td>
                <td>₹{p.amount.toFixed(2)}</td>
                <td>{p.method}</td>
                <td>
                  <span className={`badge bg-${
                    p.status === 'completed'
                      ? 'success'
                      : p.status === 'pending'
                      ? 'warning'
                      : 'danger'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td>{new Date(p.paidAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminPaymentsPage;
