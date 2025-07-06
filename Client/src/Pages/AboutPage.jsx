import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const AboutPage = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("https://api.unsplash.com/search/photos", {
          params: { query: "food kitchen chef", per_page: 6 },
          headers: { Authorization: `Client-ID ${accessKey}` },
        });
        setGalleryImages(res.data.results);
      } catch (error) {
        setError("Failed to load gallery images.");
        console.error("Unsplash fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [accessKey]);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", paddingTop: "4rem" }}>
      <section style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h1 className="text-warning fw-bold mb-3">Driven by Passion, Inspired by Flavor</h1>
        <p className="lead text-light mx-auto" style={{ maxWidth: "700px" }}>
          At <span className="text-warning">Foodie</span>, food isn't just nourishment—it's an experience, a connection,
          a story. Since 2005, we’ve been blending cultures, traditions, and love on every plate.
        </p>
      </section>

      <section style={{ backgroundColor: "#111", padding: "3rem 2rem" }}>
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="text-warning">Our Vision</h2>
              <p className="text-light">
                We believe food brings people together. That’s why we’re on a mission to serve flavorful,
                handcrafted dishes using only the freshest ingredients—bringing smiles to millions.
              </p>
            </Col>
            <Col md={6}>
              <img
                src="https://cdn.pixabay.com/photo/2024/11/15/07/32/japancontest-9198611_1280.png"
                alt="Vision"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section style={{ padding: "4rem 2rem" }}>
        <Container>
          <h3 className="text-warning text-center mb-4">Our Core Values</h3>
          <Row>
            {["Quality", "Innovation", "Community"].map((value, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card bg="dark" text="light" className="h-100 border-0 shadow-sm text-center">
                  <Card.Body>
                    <Card.Title className="text-warning fs-4">{value}</Card.Title>
                    <Card.Text>
                      {value === "Quality"
                        ? "We use premium, locally sourced ingredients for unmatched flavor."
                        : value === "Innovation"
                        ? "Creative recipes, modern kitchens, and tech-driven service."
                        : "We support local communities and uplift food artisans."}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section style={{ backgroundColor: "#111", padding: "4rem 2rem" }}>
        <Container>
          <h3 className="text-warning text-center mb-5">Our Journey</h3>
          <div className="alt-timeline">
            {[
              { year: "2005", event: "Founded in a small kitchen with a bold vision." },
              { year: "2010", event: "Expanded to 10 cities with new signature dishes." },
              { year: "2015", event: "Launched mobile ordering and delivery services." },
              { year: "2020", event: "Crossed 1 million orders served." },
              { year: "2023", event: "Now operating in 4 countries with 700+ team members." },
              { year: "2024", event: "Introduced AI-driven menu personalization." },
            ].map((item, idx) => (
              <div key={idx} className="alt-timeline-item">
                <h5 className="text-warning">{item.year}</h5>
                <p>{item.event}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section style={{ backgroundColor: "#111", padding: "4rem 2rem" }}>
        <Container>
          <h3 className="text-warning text-center mb-4">Behind the Scenes</h3>
          {loading ? (
            <div className="text-center text-light">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2">Loading images...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <Row>
              {galleryImages.map((img, idx) => (
                <Col md={4} sm={6} key={idx} className="mb-4">
                  <a href={img.links.html} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img.urls.small}
                      alt={img.alt_description || `Gallery ${idx}`}
                      className="gallery-img"
                    />
                  </a>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      <section style={{ backgroundColor: "#000", padding: "3rem 2rem" }}>
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <h2 className="text-warning">2M+</h2>
              <p className="text-unmuted">Orders Served</p>
            </Col>
            <Col md={4}>
              <h2 className="fw-bold text-warning">1.2M+</h2>
              <p className="text-unmuted">Happy Customers</p>
            </Col>
            <Col md={4}>
              <h2 className="text-warning">700+</h2>
              <p className="text-unmuted">Global Team Members</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
