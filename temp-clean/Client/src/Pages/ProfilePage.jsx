import React, { useState } from 'react';
import {
  Card, Button, Container, Row, Col, Form, InputGroup
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.displayName || '');
  const [address, setAddress] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const getInitial = () => {
    const name = currentUser.displayName || currentUser.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #141e30, #243b55)',
        padding: '3rem 1rem',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card
              className="shadow border-0 rounded-4 p-4"
              style={{
                backgroundColor: '#fff',
                color: '#333',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">Profile</h4>
                <Button variant="outline-dark" onClick={() => setIsEditing(!isEditing)}>
                  <FaCog className="me-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  backgroundColor: '#dbe4f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  margin: '0 auto 1rem',
                }}
              >
                {getInitial()}
              </div>

              {isEditing ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      placeholder="Delivery address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Check
                    type="switch"
                    label="Change Password"
                    className="mb-3"
                    checked={showPasswordFields}
                    onChange={() => setShowPasswordFields(!showPasswordFields)}
                  />

                  {showPasswordFields && (
                    <>
                      <InputGroup className="mb-2">
                        <Form.Control
                          type={showPass ? 'text' : 'password'}
                          placeholder="New password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </>
                  )}

                  <Button variant="primary" className="w-100 mt-3">
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <h5 className="fw-semibold text-center">{currentUser.displayName || currentUser.email}</h5>
                  <p className="text-muted text-center mb-1">{currentUser.email}</p>
                  <p className="text-muted text-center small">UID: {currentUser.uid}</p>
                  <hr />
                  <Button variant="outline-primary" className="w-100 mb-2" onClick={() => navigate('/my-orders')}>
                    My Orders
                  </Button>
                  <Button variant="outline-secondary" className="w-100 mb-2" onClick={() => navigate('/wishlist')}>
                    Wishlist
                  </Button>
                  <Button variant="outline-dark" className="w-100 mb-2" onClick={() => navigate('/cart')}>
                    Cart
                  </Button>
                  <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
