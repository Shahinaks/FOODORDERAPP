import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
const API = import.meta.env.VITE_API_URL;


const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`/restaurants/${id}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error('Error fetching restaurant', err));
  }, [id]);

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h2>{restaurant.name}</h2>
      <p><strong>Address:</strong> {restaurant.address || '—'}</p>
      <p><strong>Phone:</strong> {restaurant.phone || '—'}</p>
      <p><strong>Email:</strong> {restaurant.email || '—'}</p>
      <p><strong>Description:</strong> {restaurant.description || '—'}</p>
      {restaurant.image && (
        <img src={restaurant.image} alt={restaurant.name} style={{ maxWidth: '300px' }} />
      )}
    </div>
  );
};

export default RestaurantDetailPage;
