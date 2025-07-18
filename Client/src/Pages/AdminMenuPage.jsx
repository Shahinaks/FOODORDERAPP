import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';

const AdminMenuPage = () => {
  const { firebaseToken } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    restaurant: '',
    category: '',
    image: '',
  });

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/menu', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      setMenuItems(data);

      const dynamicCats = [...new Set(data.map(item => item.category?.name || item.category))];
      setCategories(prev => {
        const merged = [...prev];
        dynamicCats.forEach(name => {
          if (!merged.find(c => c.name === name)) {
            merged.push({ _id: name, name });
          }
        });
        return merged;
      });
    } catch (err) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/categories', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    }
  };

  const fetchRestaurants = async () => {
    try {
      const { data } = await axios.get('/restaurants', {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      setRestaurants(data);
    } catch (err) {
      toast.error('Failed to load restaurants');
    }
  };

  useEffect(() => {
    if (firebaseToken) {
      fetchMenu();
      fetchCategories();
      fetchRestaurants();
    }
  }, [firebaseToken]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (editItem) {
        await axios.put(`/menu/${editItem._id}`, formData, {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
        toast.success('Item updated');
      } else {
        await axios.post('/menu', formData, {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        });
        toast.success('Item added');
      }
      fetchMenu();
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`/menu/${id}`, {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      });
      toast.success('Item deleted');
      fetchMenu();
    } catch {
      toast.error('Delete failed');
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        description: item.description,
        restaurant: item.restaurant?._id || item.restaurant || '',
        category: item.category?._id || item.category || '',
        image: item.image || '',
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      restaurant: '',
      category: '',
      image: '',
    });
    setEditItem(null);
  };

  return (
    <AdminLayout>
      <Container className="py-4">
        <h3 className="mb-3 text-center">Admin Menu Management</h3>
        <Button className="mb-3" onClick={() => openModal()}>+ Add Item</Button>

        {loading ? (
          <div className="text-center"><Spinner /></div>
        ) : (
          <Table bordered striped responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Restaurant</th>
                <th>Category</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.restaurant?.name || item.restaurant}</td>
                  <td>{item.category?.name || item.category}</td>
                  <td>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 60, height: 40, objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>
                    <Button size="sm" variant="info" onClick={() => openModal(item)}>Edit</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editItem ? 'Edit Item' : 'Add New Item'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Price</Form.Label>
                <Form.Control name="price" type="number" value={formData.price} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Image URL</Form.Label>
                <Form.Control name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Restaurant</Form.Label>
                <Form.Select name="restaurant" value={formData.restaurant} onChange={handleChange}>
                  <option value="">Select Restaurant</option>
                  {restaurants.map((rest) => (
                    <option key={rest._id} value={rest._id}>{rest.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button onClick={handleSubmit} variant="primary" className="mt-3">
                {editItem ? 'Update' : 'Add'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </AdminLayout>
  );
};

export default AdminMenuPage;
