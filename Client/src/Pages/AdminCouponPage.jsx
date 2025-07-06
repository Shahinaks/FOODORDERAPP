import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Button, Form, Table, Alert } from 'react-bootstrap';

const AdminCouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', discountPercentage: '', expirationDate: '' });
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/coupons');
      setCoupons(res.data);
    } catch {
      setError('Failed to fetch coupons');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/coupons', form);
      setForm({ code: '', discountPercentage: '', expirationDate: '' });
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch {
      setError('Delete failed');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const validCoupons = coupons.filter(c => c.isActive && new Date(c.expirationDate) > new Date());
  const expiredCoupons = coupons.filter(c => !c.isActive || new Date(c.expirationDate) <= new Date());

  return (
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
          {validCoupons.map((coupon) => (
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
              {expiredCoupons.map((coupon) => (
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
        </>
      )}
    </div>
  );
};

export default AdminCouponPage;
