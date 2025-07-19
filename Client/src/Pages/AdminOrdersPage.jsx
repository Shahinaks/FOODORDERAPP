import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../layouts/AdminLayout';
import {
  Container,
  Table,
  Form,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

const AdminOrdersPage = () => {
  const { firebaseToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/orders', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      setOrders(data);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        }
      );
      toast.success('Order status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.put(
        `/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        }
      );
      toast.success('Order cancelled');
      fetchOrders();
    } catch {
      toast.error('Failed to cancel order');
    }
  };

  useEffect(() => {
    if (firebaseToken) fetchOrders();
  }, [firebaseToken]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const statusOptions = ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.orderStatus === statusFilter)
    : orders;

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <AdminLayout>
      <Container className="py-4">
        <h2 className="mb-4 text-center">Admin Order Management</h2>

        <Form.Group className="mb-3 d-flex gap-3 align-items-center flex-wrap">
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
          <>
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
                {currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(0, 8)}...</td>
                    <td>
                      {order.user && typeof order.user === 'object' && 'name' in order.user
                        ? order.user.name
                        : typeof order.user === 'string'
                        ? order.user
                        : 'Unknown'}
                    </td>
                    <td className="text-capitalize">{order.orderStatus}</td>
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

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center align-items-center mt-4 gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                First
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </Button>

              {[...Array(totalPages).keys()]
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )
                .map((num) => (
                  <Button
                    key={num + 1}
                    variant={currentPage === num + 1 ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => setCurrentPage(num + 1)}
                  >
                    {num + 1}
                  </Button>
                ))}

              <Button
                size="sm"
                variant="outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </Button>
            </div>
          </>
        )}
      </Container>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
