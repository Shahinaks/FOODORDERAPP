// FooterWithContact.jsx
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ContactForm from "./ContactForm";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row className="mb-4">
          <Col md={3}>
            <h5 className="text-warning">Foodie</h5>
            <p>Delivering delight at your doorstep.</p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light fs-5"><FaFacebookF /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaTwitter /></a>
              <a href="#" className="text-light fs-5"><FaLinkedin /></a>
            </div>
          </Col>

          <Col md={3}>
            <h6 className="text-warning">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/menu" className="footer-link">Menu</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </Col>

          
          <Col md={4} id="contact">
            <ContactForm />
          </Col>

          <Col md={4}>
            <h6 className="text-warning">Newsletter</h6>
            <p>Get updates and deals in your inbox.</p>
            <Form className="d-flex">
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="me-2 bg-dark text-white border-secondary"
              />
              <Button variant="warning">Subscribe</Button>
            </Form>
          </Col>
        </Row>

        <div className="text-center text-unmuted small mt-4">
          © {new Date().getFullYear()} Foodie. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
