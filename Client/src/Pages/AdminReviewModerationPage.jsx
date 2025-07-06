import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
const API = import.meta.env.VITE_API_URL;

const AdminReviewModerationPage = () => {
  const [reviews, setReviews] = useState([]);
  const [menuItemFilter, setMenuItemFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/reviews');
      setReviews(data);
    } catch (err) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = menuItemFilter
    ? reviews.filter((r) =>
        r.menuItem?.name?.toLowerCase().includes(menuItemFilter.toLowerCase())
      )
    : reviews;

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Admin Review Moderation</h2>

      <Form.Control
        type="text"
        placeholder="Search by menu item name..."
        value={menuItemFilter}
        onChange={(e) => setMenuItemFilter(e.target.value)}
        className="mb-3"
      />

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : filteredReviews.length === 0 ? (
        <Alert variant="info">No reviews found.</Alert>
      ) : (
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>Menu Item</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review._id}>
                <td>{review.user?.name || 'N/A'}</td>
                <td>{review.menuItem?.name || 'N/A'}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>{new Date(review.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteReview(review._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminReviewModerationPage;
