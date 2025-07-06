import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {
  Container, Table, Button, Form, Row, Col, Pagination,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const API = import.meta.env.VITE_API_URL;

const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  const pageSize = 5;

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders/my-orders');
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Error fetching user orders', err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setToastMessage('Not logged in');
        setShowToast(true);
        return;
      }

      const token = await user.getIdToken();

      const res = await axios.put(`/orders/${orderId}/cancel`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setToastMessage(res.data.message);
      setShowToast(true);

      fetchOrders(); // Refresh orders list
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Cancel failed');
      setShowToast(true);
      console.error('Cancel failed', err.response?.data || err.message);
    }
  };




  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchOrders();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = [...orders];
    if (statusFilter) {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }
    if (searchText) {
      result = result.filter((order) =>
        order.restaurant?.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [statusFilter, searchText, orders]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedOrders = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status) => {
    const statusMap = {
      placed: 'secondary',
      confirmed: 'primary',
      preparing: 'warning',
      'out-for-delivery': 'info',
      delivered: 'success',
      cancelled: 'danger',
    };
    return <span className={`badge bg-${statusMap[status] || 'dark'} text-capitalize`}>{status}</span>;
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4">My Orders</h3>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by restaurant name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Restaurant</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ordered At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, i) => (
            <tr key={order._id}>
              <td>{(currentPage - 1) * pageSize + i + 1}</td>
              <td>
                {order.restaurant ? (
                  <Link to={`/restaurant/${order.restaurant._id}`}>
                    {order.restaurant.name || '—'}
                  </Link>
                ) : '—'}
              </td>
              <td>
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    {item.menuItem?.name} × {item.quantity}
                  </div>
                ))}
              </td>
              <td>₹{order.totalAmount?.toFixed(2) ?? '—'}</td>
              <td>{order.orderStatus ? getStatusBadge(order.orderStatus) : '—'}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <Link to={`/orders/${order._id}`}>
                  <Button variant="info" size="sm">View</Button>
                </Link>
                {order.orderStatus === 'placed' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelOrder(order._id)}
                    className="ms-2"
                  >
                    Cancel
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={currentPage === idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>


    </Container>
  );
};

export default MyOrderPage;
