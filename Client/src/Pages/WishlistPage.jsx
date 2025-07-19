import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Badge,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCartIds, setAddedToCartIds] = useState([]);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('firebaseToken');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/wishlist', getAuthHeaders());
      setWishlist(res.data?.items || []);
    } catch (err) {
      toast.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (menuItemId) => {
    try {
      await axios.delete(`/wishlist/${menuItemId}`, getAuthHeaders());
      toast.success('Item removed from wishlist');
      setWishlist(prev => prev.filter(item => item._id !== menuItemId));
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  useEffect(() => {
    if (currentUser) fetchWishlist();
  }, [currentUser]);

  useEffect(() => {
    const stored = localStorage.getItem('addedToCartIds');
    if (stored) setAddedToCartIds(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('addedToCartIds', JSON.stringify(addedToCartIds));
  }, [addedToCartIds]);

  const styles = {
    page: {
      background: 'linear-gradient(135deg, #fffaf0, #fef6e4)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Quicksand', sans-serif",
      color: '#5c3b28',
    },
    header: {
      textAlign: 'center',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#8b5e3c',
      marginBottom: '2rem',
      position: 'relative',
    },
    backBtn: {
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundColor: '#f3dec9',
      border: 'none',
      color: '#5c3b28',
      padding: '6px 14px',
      fontSize: '1.2rem',
      borderRadius: '12px',
      boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    },
    card: {
      backgroundColor: '#fff7ed',
      borderRadius: '16px',
      border: '1px solid #e5c9a0',
      boxShadow: '0 4px 15px rgba(145, 109, 66, 0.12)',
      transition: 'transform 0.3s ease',
      color: '#4e3621',
    },
    cardImg: {
      height: '200px',
      objectFit: 'cover',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    },
    button: {
      borderRadius: '25px',
      fontSize: '0.85rem',
      padding: '6px 14px',
      fontWeight: '500',
    },
    addBtn: {
      backgroundColor: '#d6a77a',
      color: '#fff',
      border: 'none',
    },
    goBtn: {
      backgroundColor: '#6c757d',
      color: '#fff',
      border: 'none',
    },
    removeBtn: {
      backgroundColor: '#b85c38',
      color: '#fff',
      border: 'none',
    },
  };

  if (loading) {
    return (
      <Container className="text-center pt-5" style={styles.page}>
        <Spinner animation="border" variant="secondary" />
      </Container>
    );
  }

  return (
    <Container fluid style={styles.page}>
      <div style={styles.header}>
        <Button style={styles.backBtn} onClick={() => navigate('/menu')}>
          ←
        </Button>
        My Wishlist
      </div>

      {wishlist.length === 0 ? (
        <Alert variant="light" className="text-center border border-secondary">
          Your wishlist is empty.{' '}
          <Link to="/menu" style={{ color: '#a07151', fontWeight: '500' }}>
            Browse menu
          </Link>{' '}
          to add items.
        </Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {wishlist.map((item) => (
            <Col key={item._id}>
              <Card style={styles.card}>
                <Link to={`/menu/${item._id}`}>
                  <Card.Img
                    variant="top"
                    src={item.image || 'https://via.placeholder.com/300'}
                    style={styles.cardImg}
                  />
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Card.Title
                    as={Link}
                    to={`/menu/${item._id}`}
                    className="text-decoration-none"
                    style={{ color: '#8a5a3d' }}
                  >
                    {item.name}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem' }}>{item.description}</Card.Text>
                  <Card.Text style={{ fontWeight: 'bold' }}>
                    ₹{item.price}
                  </Card.Text>
                  {item.restaurant?.name && (
                    <Card.Text>
                      <Badge bg="warning" text="dark">
                        {item.restaurant.name}
                      </Badge>
                    </Card.Text>
                  )}
                  <div className="d-flex gap-2 mt-auto pt-2">
                    {addedToCartIds.includes(item._id) ? (
                      <Button
                        style={{ ...styles.button, ...styles.goBtn }}
                        size="sm"
                        onClick={() => navigate('/cart')}
                      >
                        Go to Cart
                      </Button>
                    ) : (
                      <Button
                        style={{ ...styles.button, ...styles.addBtn }}
                        size="sm"
                        onClick={async () => {
                          await addToCart(item);
                          setAddedToCartIds(prev => [...prev, item._id]);
                          await removeFromWishlist(item._id); // 👈 Auto-remove from wishlist
                        }}
                      >
                        Add to Cart
                      </Button>
                    )}
                    <Button
                      style={{ ...styles.button, ...styles.removeBtn }}
                      size="sm"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default WishlistPage;
