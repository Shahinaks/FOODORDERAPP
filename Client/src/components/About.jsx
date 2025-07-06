import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import aboutImg from "../assets/burger.png";

const About = () => {
    return (
        <section
            id="about"
            style={{
                background: "linear-gradient(to right, #000, #111)",
                color: "#fff",
                padding: "5rem 0",
                borderTop: "1px solid #222",
            }}
        >
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <h1 className="fw-bold text-warning mb-3">Driven by Flavor, Fueled by Passion</h1>
                        <p className="lead mb-4">
                            What started as a single kitchen in 2005 is now a food movement. We believe food should tell a story—
                            one of heritage, bold creativity, and love in every bite.
                        </p>
                        <blockquote
                            style={{
                                borderLeft: "4px solid orange",
                                paddingLeft: "1rem",
                                fontStyle: "italic",
                                color: "#bbb",
                            }}
                        >
                            “It’s not just food—it’s our legacy.” <br />
                            <span className="text-warning">– Chef Ravi, Founder</span>
                        </blockquote>
                        <div className="mt-4">
                            <Link to="/about">
                                <Button variant="warning" className="fw-bold px-4">
                                    Explore Our Journey
                                </Button>
                            </Link>
                        </div>
                    </Col>
                    <Col md={6} className="text-center mt-5 mt-md-0">
                        <img
                            src={aboutImg}
                            alt="About Us"
                            className="img-fluid rounded-4 shadow"
                            style={{ maxHeight: "350px", border: "5px solid orange", objectFit: "cover" }}
                        />
                    </Col>
                </Row>

                <Row className="text-center mt-5">
                    <Col md={4}>
                        <h2 className="fw-bold text-warning">18+</h2>
                        <p className="text-unmuted">Years of Excellence</p>
                    </Col>
                    <Col md={4}>
                        <h2 className="text-warning">4.9★</h2>
                        <p className="text-unmuted">Customer Rating</p>
                    </Col>

                    <Col md={4}>
                        <h2 className="fw-bold text-warning">600+</h2>
                        <p className="text-unmuted">Team Members</p>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default About;
