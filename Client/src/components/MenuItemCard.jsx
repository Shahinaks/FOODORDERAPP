import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';

const pastelColors = ['#ffe4ec', '#e0f7fa', '#fff9c4', '#e0ffe4'];

const MenuItemCard = ({ item, index = 0 }) => {
  const {
    name = 'Unnamed Item',
    description = 'No description available',
    price = 'N/A',
    image = '/default-image.png', 
    avgRating = 0,
    reviewCount = 0,
  } = item || {};

  const bgColor = pastelColors[index % pastelColors.length];

  return (
    <Card style={{ backgroundColor: bgColor, border: 'none', borderRadius: '20px' }} className="p-3 shadow-sm h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div className="d-flex flex-column">
          <Card.Img
            variant="top"
            src={image}
            alt={name}
            style={{ borderRadius: '50%', width: '80px', height: '80px', objectFit: 'cover', marginBottom: '10px' }}
          />
          <Badge bg="warning" className="mb-2">{avgRating.toFixed(1)}★</Badge>
        </div>
        <FaHeart color="red" />
      </div>

      <Card.Body className="p-0">
        <Card.Title className="fs-6 fw-bold">{name}</Card.Title>
        <Card.Text className="small text-muted">{description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="fw-bold">${price}</span>
          <Button variant="success" size="sm" className="px-3 py-1 rounded-pill">+ Add</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuItemCard;
