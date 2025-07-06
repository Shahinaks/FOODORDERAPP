import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { getAuth } from 'firebase/auth';
import {
  Container,
  Table,
  Form,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL;

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      const { data } = await axios.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axios.put(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axios.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to cancel order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusOptions = ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.orderStatus === statusFilter)
    : orders;

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Admin Order Management</h2>

      <Form.Group className="mb-3 d-flex gap-3 align-items-center">
        <Form.Label>Status Filter:</Form.Label>
        <Form.Select
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Form.Select>
        <Button variant="secondary" onClick={fetchOrders}>
          Refresh
        </Button>
      </Form.Group>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Alert variant="info">No orders found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(0, 8)}...</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{order.orderStatus}</td>
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className="d-flex gap-2 flex-wrap">
                  <Form.Select
                    size="sm"
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Form.Select>
                  {order.orderStatus !== 'cancelled' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminOrdersPage;
