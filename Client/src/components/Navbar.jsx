import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";

const AppNavbar = ({ onProfileClick }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isTransparent = location.pathname === "/";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const getInitial = () => {
    const name = currentUser?.displayName || currentUser?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className={`py-3 ${isTransparent ? "position-absolute w-100 bg-transparent z-3" : "bg-dark shadow-sm"}`}
      style={{ top: 0 }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4" style={{ color: "#ffc107" }}>
          🍽️ Foodie
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-3">
            <Nav.Link as={Link} to="/" className="text-white fw-medium">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/menu" className="text-white fw-medium">
              Menu
            </Nav.Link>
            <Nav.Link href="#about" className="text-white fw-medium">
              About
            </Nav.Link>
            <Nav.Link href="#contact" className="text-white fw-medium">
              Contact
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center gap-3">
            {!currentUser || location.pathname === "/" ? (
              <>
                <Button variant="outline-light" size="sm" as={Link} to="/login">
                  Login
                </Button>
                <Button variant="warning" size="sm" as={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    backgroundColor: "#f8f9fa",
                    color: "#333",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {getInitial()}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/my-orders">My Orders</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/wishlist">Wishlist</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/cart">Cart</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
