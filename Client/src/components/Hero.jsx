import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axiosInstance";

const videoList = ["/video/food-bg1.mp4", "/video/food-bg3.mp4", "/video/food-bg2.mp4"];
const fallbackImage = "/images/hero-fallback.jpg";

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoList.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("/menu");
        setAllMenuItems(res.data);
      } catch (err) {
        console.error("Failed to load menu");
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSuggestions([]);
    } else {
      const filtered = allMenuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5));
    }
  }, [searchQuery, allMenuItems]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (name) => {
    setSearchQuery(name);
    navigate(`/menu?search=${encodeURIComponent(name)}`);
  };

  return (
    <div className="hero-container position-relative">
      {/* Preload videos for smoother switching */}
      {videoList.map((video) => (
        <link key={video} rel="preload" as="video" href={video} type="video/mp4" />
      ))}

      {!isMobile ? (
        <video
          key={videoList[currentVideoIndex]}
          autoPlay
          muted
          loop
          playsInline
          className="w-100 hero-video"
        >
          <source src={videoList[currentVideoIndex]} type="video/mp4" />
        </video>
      ) : (
        <img
          src={fallbackImage}
          alt="Delicious Food"
          className="w-100"
          style={{ height: "100vh", objectFit: "cover", filter: "brightness(0.5)" }}
        />
      )}

      <motion.div
        className="position-absolute top-50 start-50 translate-middle text-center text-white px-4 w-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="display-3 fw-bold mb-3">Find Your Next Favorite Bite</h1>
        <p className="lead mb-4">
          Explore trending dishes, hidden gems, and chef specials — delivered fast to your door.
        </p>

        <div className="d-flex justify-content-center flex-column align-items-center mb-4" style={{ position: "relative" }}>
          <InputGroup style={{ maxWidth: "600px" }}>
            <Form.Control
              placeholder="Search for burgers, grills, pizza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button variant="warning" onClick={handleSearch}>Search</Button>
          </InputGroup>

          {filteredSuggestions.length > 0 && (
            <ListGroup style={{
              position: "absolute",
              top: "100%",
              zIndex: 1000,
              width: "100%",
              maxWidth: "600px",
            }}>
              {filteredSuggestions.map((item) => (
                <ListGroup.Item
                  key={item._id}
                  action
                  onClick={() => handleSelectSuggestion(item.name)}
                >
                  {item.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>

        <div>
          <Button as={Link} to="/menu" variant="outline-light" size="lg" className="me-3">
            Order Now
          </Button>
          <Button as={Link} to="/signup" variant="light" size="lg">
            Join Us
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
