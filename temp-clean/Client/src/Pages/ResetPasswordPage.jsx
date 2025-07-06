import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
const API = import.meta.env.VITE_API_URL;


const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const resetToken = params.get('token'); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return setError('Please fill in both fields.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    if (!resetToken) return setError('Invalid or missing token.');

    try {
      setLoading(true);
      await axios.post('/auth/reset-password', {
        token: resetToken,
        newPassword
      });
      setSuccess('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '60px' }}>
      <h4 className="text-center mb-3">Reset Your Password</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleReset}>
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="w-100" variant="dark" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Reset Password'}
        </Button>
      </Form>
    </Container>
  );
};

export default ResetPasswordPage;
