import React, { useEffect, useState } from 'react';
import {
  Card, Button, Row, Col, Spinner, Container, Form, Badge, Accordion 
} from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';
import NavSectionWithAvatar from '../components/NavSectionWithAvatar';
import ReviewPanel from '../components/ReviewPanel';
import ReviewForm from '../components/ReviewForm';
import { useLocation } from 'react-router-dom';

import {
  FaPizzaSlice, FaHamburger, FaIceCream, FaGlassMartiniAlt, FaLeaf,
  FaBlender, FaFireAlt, FaDrumstickBite, FaFish, FaUtensils, FaBreadSlice,
  FaStar, FaConciergeBell, FaCoffee, FaEgg
} from 'react-icons/fa';
const API = import.meta.env.VITE_API_URL;

const colors = {
  bg: '#f4f1ee',
  brown: '#6b4f4f',
  gold: '#a47551',
  cream: '#fffdfb',
  text: '#3e2c2c'
};

const categoryIcons = {
  Pizza: <FaPizzaSlice className="me-2" style={{ color: colors.brown }} />,
  Burger: <FaHamburger className="me-2" style={{ color: colors.gold }} />,
  Desserts: <FaIceCream className="me-2" style={{ color: colors.brown }} />,
  Drinks: <FaGlassMartiniAlt className="me-2" style={{ color: colors.gold }} />,
  Salads: <FaLeaf className="me-2" style={{ color: colors.brown }} />,
  Shakes: <FaBlender className="me-2" style={{ color: colors.brown }} />,
  Grill: <FaFireAlt className="me-2" style={{ color: colors.gold }} />,
  Arabian: <FaStar className="me-2" style={{ color: colors.brown }} />,
  Starters: <FaConciergeBell className="me-2" style={{ color: colors.gold }} />,
  'Main Course': <FaUtensils className="me-2" style={{ color: colors.brown }} />,
  Seafood: <FaFish className="me-2" style={{ color: colors.gold }} />,
  Biryani: <FaDrumstickBite className="me-2" style={{ color: colors.brown }} />,
  Chicken: <FaDrumstickBite className="me-2" style={{ color: colors.gold }} />,
  Wraps: <FaBreadSlice className="me-2" style={{ color: colors.brown }} />,
  Breakfast: <FaEgg className="me-2" style={{ color: colors.gold }} />,
  Beverages: <FaCoffee className="me-2" style={{ color: colors.brown }} />
};

const allCategories = [
  'Pizza', 'Burger', 'Salads', 'Shakes', 'Grill', 'Arabian', 'Starters',
  'Main Course', 'Seafood', 'Biryani', 'Chicken', 'Wraps', 'Breakfast', 'Beverages'
];

const sortOptions = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A-Z', value: 'name_asc' },
  { label: 'Name: Z-A', value: 'name_desc' }
];

const MenuPage = () => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceLimit, setPriceLimit] = useState(1000);
  const [vegFilter, setVegFilter] = useState('All');
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [showReviewId, setShowReviewId] = useState(null);

  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromURL = queryParams.get('category');
    const searchFromURL = queryParams.get('search') || '';
    setSearchTerm(searchFromURL);


    if (categoryFromURL) {
      const formattedCategory = categoryFromURL.charAt(0).toUpperCase() + categoryFromURL.slice(1);
      if (allCategories.includes(formattedCategory)) {
        setSelectedCategories([formattedCategory]);
      }
    }
  }, [location.search]);


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const query = vegFilter !== 'All' ? `?vegType=${vegFilter}` : '';
        const res = await axios.get(`/menu${query}`);
        setMenuItems(res.data);
      } catch {
        toast.error('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [vegFilter]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleRestaurant = (restaurant) => {
    setSelectedRestaurants(prev =>
      prev.includes(restaurant) ? prev.filter(r => r !== restaurant) : [...prev, restaurant]
    );
  };

  const sortedItems = [...menuItems].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
    return 0;
  });

  const filteredItems = sortedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchesPrice = item.price <= parseFloat(priceLimit);
    const matchesVeg = vegFilter === 'All' || (vegFilter === 'Veg' && item.isVeg) || (vegFilter === 'Non-Veg' && !item.isVeg);
    const matchesRestaurant = selectedRestaurants.length === 0 || selectedRestaurants.includes(item.restaurant?.name);
    return matchesSearch && matchesCategory && matchesPrice && matchesVeg && matchesRestaurant;
  });
  const uniqueRestaurants = [...new Set(menuItems.map(i => i.restaurant?.name))].filter(Boolean);

  const renderFilters = () => (
    <>
      <h5 style={{ color: colors.brown }}>Filter by Category</h5>
      <div className="d-flex flex-wrap mb-3">
        {allCategories.map((cat, idx) => (
          <Badge
            key={idx}
            pill
            bg={selectedCategories.includes(cat) ? 'dark' : 'light'}
            text={selectedCategories.includes(cat) ? 'light' : 'dark'}
            onClick={() => toggleCategory(cat)}
            className="m-1 px-3 py-2"
            style={{ cursor: 'pointer', border: `1px solid ${colors.brown}` }}
          >
            {categoryIcons[cat]} {cat}
          </Badge>
        ))}
      </div>

<h5 style={{ color: colors.brown }}>Price Range</h5>
<Form.Select
  value={priceLimit}
  onChange={(e) => setPriceLimit(e.target.value)}
  className="mb-3"
>
  <option value="10000">All Prices</option>
  <option value="100">Under ₹100</option>
  <option value="300">₹100 – ₹300</option>
  <option value="500">₹300 – ₹500</option>
  <option value="1000">₹500 – ₹1000</option>
</Form.Select>

      <h5 style={{ color: colors.brown }}>Veg / Non-Veg</h5>
      <Form.Check type="radio" label="All" name="vegFilter" checked={vegFilter === 'All'} onChange={() => setVegFilter('All')} />
      <Form.Check type="radio" label="Veg" name="vegFilter" checked={vegFilter === 'Veg'} onChange={() => setVegFilter('Veg')} />
      <Form.Check type="radio" label="Non-Veg" name="vegFilter" checked={vegFilter === 'Non-Veg'} onChange={() => setVegFilter('Non-Veg')} />

      <h5 className="mt-4" style={{ color: colors.brown }}>Restaurants</h5>
      <div className="d-flex flex-wrap">
        {uniqueRestaurants.map((name, idx) => (
          <Badge
            key={idx}
            pill
            bg={selectedRestaurants.includes(name) ? 'dark' : 'light'}
            text={selectedRestaurants.includes(name) ? 'light' : 'dark'}
            onClick={() => toggleRestaurant(name)}
            className="m-1 px-3 py-2"
            style={{ cursor: 'pointer', border: `1px solid ${colors.brown}` }}
          >
            {name}
          </Badge>
        ))}
      </div>

      <h5 className="mt-4" style={{ color: colors.brown }}>Sort By</h5>
      <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Default</option>
        {sortOptions.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </Form.Select>
    </>
  );


  if (loading) {
    return (
      <div className="text-center py-5" style={{ backgroundColor: colors.bg, height: '100vh' }}>
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  
  return (
    <>
      <NavSectionWithAvatar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container fluid className="py-4" style={{ backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
        <Row>
          
          <Col xs={12} md={3} className="order-1 order-md-1 mb-3">
            <div className="d-md-block d-none">
              {renderFilters()}
            </div>
            <div className="d-md-none">
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Filter Options</Accordion.Header>
                  <Accordion.Body>
                    {renderFilters()}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </Col>

         
          <Col xs={12} md={6} className="order-3 order-md-2">
            <h2 className="text-center mb-4" style={{ color: colors.brown }}>Our Menu</h2>
            <Row className="g-4">
              {filteredItems.map(item => (
                <Col xs={12} sm={6} key={item._id}>
                  {/* your Card code */}
                </Col>
              ))}
            </Row>
          </Col>

          
          <Col xs={12} md={3} className="order-2 order-md-3 mb-4 mb-md-0">
            <div className="d-md-block d-none">
              <ReviewPanel />
            </div>
            <div className="d-md-none">
              <Accordion>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>See Reviews</Accordion.Header>
                  <Accordion.Body>
                    <ReviewPanel />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MenuPage;
