import React from 'react';
import { useCart } from '../context/CartContext';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, loading, removeFromCart, updateCartItem } = useCart();
  const navigate = useNavigate();

  const styles = {
    page: {
      background: 'linear-gradient(to bottom right, #fdf6e3, #f9e8d9)',
      color: '#5a3e2b',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Segoe UI', sans-serif",
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#6e4b3c',
    },
    card: {
      backgroundColor: '#fffaf3',
      border: '1px solid #eedfd1',
      borderRadius: '16px',
      boxShadow: '0 8px 16px rgba(100, 80, 60, 0.1)',
    },
    cardImg: {
      height: '200px',
      objectFit: 'cover',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    },
    quantityBtn: {
      backgroundColor: '#d7b49e',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    removeBtn: {
      backgroundColor: '#a05f5f',
      border: 'none',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '6px',
    },
    checkoutBtn: {
      backgroundColor: '#b27d5d',
      border: 'none',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      padding: '12px 28px',
      borderRadius: '30px',
    },
  };

  if (loading) {
    return (
      <Container className="py-5 text-center" style={styles.page}>
        <Spinner animation="border" variant="secondary" />
      </Container>
    );
  }

  if (!cartItems.length) {
    return (
      <Container fluid className="py-5 text-center" style={styles.page}>
        <h4>Your cart is empty 🛒</h4>
        <Button
          variant="outline-secondary"
          className="mt-3"
          onClick={() => navigate('/menu')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid style={styles.page}>
      <div style={styles.title}>My Cart</div>
      <Row>
        {cartItems.map((item, idx) => {
          const menuItem = item.menuItem;
          if (!menuItem) return null;

          return (
            <Col md={6} lg={4} key={menuItem._id || idx} className="mb-4">
              <Card style={styles.card}>
                <Card.Img
                  variant="top"
                  src={menuItem.image || 'https://via.placeholder.com/300'}
                  style={styles.cardImg}
                />
                <Card.Body>
                  <Card.Title>{menuItem.name}</Card.Title>
                  <Card.Text>₹{menuItem.price}</Card.Text>
                  <div className="d-flex align-items-center mb-3 gap-2">
                    <Button
                      style={styles.quantityBtn}
                      onClick={() =>
                        item.quantity > 1
                          ? updateCartItem(menuItem._id, item.quantity - 1)
                          : removeFromCart(menuItem._id)

                      }
                    >
                      −
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      style={styles.quantityBtn}
                      onClick={() =>
                        updateCartItem(menuItem._id, item.quantity + 1)

                      }
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(menuItem._id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div className="text-center mt-5">
        <Button style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </Button>
      </div>
    </Container>
  );
};

export default CartPage;
