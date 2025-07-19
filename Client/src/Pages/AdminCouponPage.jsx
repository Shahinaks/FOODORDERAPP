import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Button, Form, Table, Alert, Pagination } from 'react-bootstrap';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';

const AdminCouponPage = () => {
  const { firebaseToken } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discountPercentage: '', expirationDate: '' });
  const [error, setError] = useState('');

  const [activePage, setActivePage] = useState(1);
  const [expiredPage, setExpiredPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/coupons', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      setCoupons(res.data);
    } catch {
      setError('Failed to fetch coupons');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/coupons', form, {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      setForm({ code: '', discountPercentage: '', expirationDate: '' });
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/coupons/${id}`, {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      fetchCoupons();
    } catch {
      setError('Delete failed');
    }
  };

  useEffect(() => {
    if (firebaseToken) fetchCoupons();
  }, [firebaseToken]);

  const validCoupons = coupons.filter(c => c.isActive && new Date(c.expirationDate) > new Date());
  const expiredCoupons = coupons.filter(c => !c.isActive || new Date(c.expirationDate) <= new Date());

  const paginatedCoupons = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderPagination = (totalItems, currentPage, onPageChange) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, idx) => idx + 1);

    return (
      <Pagination className="mt-2">
        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h2>Manage Coupons</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Label>Code</Form.Label>
            <Form.Control
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Discount (%)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              max={100}
              value={form.discountPercentage}
              onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="date"
              value={form.expirationDate}
              onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
              required
            />
          </Form.Group>
          <Button type="submit">Create Coupon</Button>
        </Form>

        <h4>Active Coupons</h4>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount %</th>
              <th>Expires</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCoupons(validCoupons, activePage).map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.discountPercentage}</td>
                <td>{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(coupon._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {renderPagination(validCoupons.length, activePage, setActivePage)}

        {expiredCoupons.length > 0 && (
          <>
            <h4 className="mt-4">Expired/Inactive Coupons</h4>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount %</th>
                  <th>Expires</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCoupons(expiredCoupons, expiredPage).map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.code}</td>
                    <td>{coupon.discountPercentage}</td>
                    <td>{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(coupon._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {renderPagination(expiredCoupons.length, expiredPage, setExpiredPage)}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCouponPage;
