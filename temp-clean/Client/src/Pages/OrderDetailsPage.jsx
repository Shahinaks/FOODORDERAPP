import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import QRCode from 'react-qr-code';
import { getAuth } from 'firebase/auth';
import 'leaflet/dist/leaflet.css';
const API = import.meta.env.VITE_API_URL;


const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error('User not logged in');
        setLoading(false);
        return;
      }

      const idToken = await user.getIdToken();
      const { data } = await axios.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const statusSteps = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = order?.orderStatus
    ? statusSteps.findIndex(
        (step) => step.toLowerCase() === order.orderStatus.toLowerCase()
      )
    : -1;

  const getStatusBadge = (status) => {
    const statusMap = {
      placed: 'secondary',
      confirmed: 'primary',
      preparing: 'warning',
      'out-for-delivery': 'info',
      delivered: 'success',
      cancelled: 'danger',
    };
    const variant = statusMap[status?.toLowerCase()] || 'dark';
    return (
      <span className={`badge bg-${variant} text-capitalize`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">Order not found.</Alert>
      </Container>
    );
  }

  const isCancelled = order.orderStatus === 'cancelled';
  const subtotal = order.items.reduce(
    (total, item) => total + (item.menuItem?.price || 0) * item.quantity,
    0
  );
  const tax = +(subtotal * 0.05).toFixed(2);
  const grandTotal = +(subtotal + tax).toFixed(2);

  return (
    <Container className="py-4 order-details">
      <h2 className="mb-4 text-center">
        {isCancelled ? 'Order Cancelled' : 'Order Invoice'}
      </h2>

      <Card className={`p-4 mb-4 shadow-sm ${isCancelled ? 'border-danger' : ''}`} style={{ fontFamily: 'Segoe UI, sans-serif' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <div>
            <h5 className="mb-2">Order ID: {order._id}</h5>
            <p>Status: {getStatusBadge(order.orderStatus)}</p>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Address: {order.deliveryAddress}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus === 'paid' ? 'Paid ✅' : 'Pending ⏳'}</p>
          </div>
          <div>
            {!isCancelled && <QRCode value={order._id} size={96} />}
          </div>
        </div>

        {!isCancelled && (
          <div className="timeline my-4 d-flex gap-2">
            {statusSteps.map((step, idx) => (
              <div
                key={idx}
                className={`timeline-step p-2 rounded text-center flex-fill ${
                  idx === currentStepIndex ? 'bg-primary text-white' : 'bg-light'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        )}

        <h5 className="mt-4">{isCancelled ? 'Items in Cancelled Order' : 'Items Ordered'}</h5>
        <ul className="list-unstyled mb-3">
          {order.items.map((item, idx) => (
            <li key={idx} className="mb-1">
              • {item.menuItem?.name || 'Deleted Item'} — ₹{item.menuItem?.price || 'N/A'} × {item.quantity}
            </li>
          ))}
        </ul>

        <hr />
        <div className="d-flex justify-content-end flex-column flex-md-row text-end">
          <div className="me-md-5 mb-2">
            <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
            <p><strong>Tax (5%):</strong> ₹{tax.toFixed(2)}</p>
            <p><strong>Total:</strong> ₹{grandTotal.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      {!isCancelled && (
        <div className="text-center mb-4">
          <Button onClick={() => window.print()} variant="outline-primary">
            🖨️ Print Invoice
          </Button>
        </div>
      )}

      {!isCancelled && order.location?.lat && order.location?.lng && (
        <Card className="shadow-sm">
          <MapContainer
            center={[order.location.lat, order.location.lng]}
            zoom={13}
            style={{ height: '300px' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[order.location.lat, order.location.lng]}>
              <Popup>Delivery Address</Popup>
            </Marker>
          </MapContainer>
        </Card>
      )}
    </Container>
  );
};

export default OrderDetailsPage;
