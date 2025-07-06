import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
const API = import.meta.env.VITE_API_URL;

const MyPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('/payments/my', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Container className="py-4">
      <h3 className="mb-4">My Payments</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : payments.length === 0 ? (
        <Alert variant="info">No payments found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
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
                <td>{p.order?._id || '—'}</td>
                <td>₹{p.amount.toFixed(2)}</td>
                <td>{p.method}</td>
                <td>
                  <span className={`badge bg-${p.status === 'completed' ? 'success' : 'secondary'}`}>
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

export default MyPaymentsPage;
