import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Table, Container, Spinner, Alert, Pagination } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../layouts/AdminLayout';

const ITEMS_PER_PAGE = 5;

const AdminPaymentsPage = () => {
  const { firebaseToken } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
      {[...Array(totalPages)].map((_, i) => (
        <Pagination.Item
          key={i}
          active={i + 1 === currentPage}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );

  return (
    <AdminLayout>
      <Container className="py-4">
        <h3 className="mb-4">All Payments (Admin)</h3>
        {loading ? (
          <Spinner animation="border" />
        ) : payments.length === 0 ? (
          <Alert variant="info">No payment records found.</Alert>
        ) : (
          <>
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
                {paginatedPayments.map((p, i) => (
                  <tr key={p._id}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
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
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </Container>
    </AdminLayout>
  );
};

export default AdminPaymentsPage;
