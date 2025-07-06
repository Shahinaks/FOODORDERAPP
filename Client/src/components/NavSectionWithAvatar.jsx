import React from 'react';
import {
  Navbar, Nav, Container, Form, InputGroup, Badge, Image, Dropdown,Button
} from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const NavSectionWithAvatar = ({ searchTerm, setSearchTerm }) => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
      navigate('/');
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const getInitial = () => {
    const name = currentUser?.displayName || currentUser?.email || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top">
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold text-warning">🍽️ Foodie</Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between">
          <Form className="d-flex mx-auto" style={{ width: '40%' }}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Form>

          <Nav className="ms-auto d-flex align-items-center gap-3">
            <Nav.Link onClick={() => currentUser ? navigate('/wishlist') : navigate('/login')}>
              <FaHeart size={20} />
              {wishlistCount > 0 && <Badge bg="danger" pill>{wishlistCount}</Badge>}
            </Nav.Link>
            <Nav.Link onClick={() => currentUser ? navigate('/cart') : navigate('/login')}>
              <FaShoppingCart size={20} />
              {cartCount > 0 && <Badge bg="success" pill>{cartCount}</Badge>}
            </Nav.Link>
            <Nav.Link onClick={() => currentUser ? navigate('/notifications') : navigate('/login')}>
              <FaBell size={18} />
            </Nav.Link>

            {currentUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  id="profile-dropdown"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {getInitial()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/my-orders')}>My Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/wishlist')}>Wishlist</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/cart')}>Cart</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/login')}>
                  <Button size="sm" variant="outline-light">Login</Button>
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/signup')}>
                  <Button size="sm" variant="warning">Sign Up</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavSectionWithAvatar;
