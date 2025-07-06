import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <h6 className="text-warning mb-3">Send us a message</h6>
      {submitted && <Alert variant="success">Message sent successfully!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-2">
          <Form.Control
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
        </Form.Group>
        <Form.Group controlId="email" className="mb-2">
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
        </Form.Group>
        <Form.Group controlId="message" className="mb-2">
          <Form.Control
            as="textarea"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={3}
            required
          />
        </Form.Group>
        <Button type="submit" variant="warning" className="w-100 mt-2">
          Send
        </Button>
      </Form>
    </>
  );
};

export default ContactForm;
