
import React, { useEffect, useState } from 'react';
import { Card, Spinner, Badge } from 'react-bootstrap';
import axios from '../api/axiosInstance';
import { FaStar } from 'react-icons/fa';
const API = import.meta.env.VITE_API_URL;


const ReviewPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return <Spinner animation="border" size="sm" />;
  }

  return (
    <Card className="shadow-sm" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <Card.Header className="bg-dark text-light fw-bold">Recent Reviews</Card.Header>
      <Card.Body>
        {reviews.map((review) => (
          <Card key={review._id} className="mb-3 border-0">
            <Card.Title className="mb-1">{review.menuItem?.name || 'Menu Item'}</Card.Title>
            <div className="mb-1">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} color="gold" size={14} />
              ))}
            </div>
            <Card.Text className="mb-1 text-muted fst-italic">"{review.comment}"</Card.Text>
            <div className="text-end">
              <Badge bg="secondary">{review.user?.name || 'Anonymous'}</Badge>
            </div>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
};

export default ReviewPanel;
