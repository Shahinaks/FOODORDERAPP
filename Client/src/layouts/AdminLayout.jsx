

import React from 'react';
import { Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { firebaseToken } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-3">
        <Navbar.Brand>🍽️ Admin Panel</Navbar.Brand>
      </Navbar>

      <Row className="m-0">
        <Col md={2} className="bg-light min-vh-100 d-flex flex-column p-3 border-end">
          <Nav className="flex-column gap-3">
            <Nav.Link as={Link} to="/admin/overview">📊 Dashboard Overview</Nav.Link>
            <Nav.Link as={Link} to="/admin/orders">📦 Orders</Nav.Link>
            <Nav.Link as={Link} to="/admin/menu">🍔 Menu</Nav.Link>
            <Nav.Link as={Link} to="/admin/reviews">📝 Moderate Reviews</Nav.Link>
            <Nav.Link as={Link} to="/admin/coupons">🏷️ Coupons</Nav.Link>
            <Nav.Link as={Link} to="/admin/payments">💳 Payments</Nav.Link>
            <Nav.Link as={Link} to="/admin/activity">📋 Activity Logs</Nav.Link>
            <Nav.Link as={Link} to="/admin/notifications">🔔 Notifications</Nav.Link>
            <Nav.Link onClick={handleLogout} className="text-danger">🚪 Logout</Nav.Link>
          </Nav>
        </Col>

        <Col md={10} className="p-4">
          {children}
        </Col>
      </Row>
    </>
  );
};

export default AdminLayout;
