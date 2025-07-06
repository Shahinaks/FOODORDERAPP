import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL;


const ReviewForm = ({ menuItemId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.warning('Please log in first');
      return;
    }

    if (typeof currentUser.getIdToken !== 'function') {
      toast.error('Authentication token not available');
      return;
    }

    let token;
    try {
      token = await currentUser.getIdToken();
    } catch (err) {
      console.error('Token error:', err);
      toast.error('Could not retrieve auth token');
      return;
    }

    try {
      await axios.post(
        '/reviews',
        { menuItem: menuItemId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted');
      setRating(0);
      setComment('');
      onSubmitted();
    } catch (err) {
      console.error('Review submission error:', err);
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group>
        <div className="d-flex mb-2">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <FaStar
                key={index}
                size={24}
                style={{
                  cursor: currentUser ? 'pointer' : 'not-allowed',
                  color: currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'
                }}
                onClick={() => currentUser && setRating(currentRating)}
                onMouseEnter={() => currentUser && setHover(currentRating)}
                onMouseLeave={() => currentUser && setHover(null)}
              />
            );
          })}
        </div>
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder={currentUser ? "Write your review..." : "Login to write a review"}
          value={comment}
          onChange={(e) => currentUser && setComment(e.target.value)}
          disabled={!currentUser}
        />
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button
          variant="primary"
          type="submit"
          disabled={!rating || !comment || !currentUser}
        >
          Submit
        </Button>
        <Button variant="outline-secondary" onClick={onSubmitted}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default ReviewForm;
