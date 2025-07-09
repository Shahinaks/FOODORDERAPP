import React from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom"; // ✅ Import this
import "swiper/css";
import "swiper/css/pagination";

import pizzaImg from "../assets/pizza.png";
import burgerImg from "../assets/burger2.png";
import dessertImg from "../assets/dessert.png";
import drinksImg from "../assets/drinks.png";
import saladImg from "../assets/salad.png";

const categories = [
  { name: "Pizza", image: pizzaImg },
  { name: "Burger", image: burgerImg },
  { name: "Desserts", image: dessertImg },
  { name: "Drinks", image: drinksImg },
  { name: "Salads", image: saladImg },
];

const Categories = () => {
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  return (
    <Container className="my-5 bg-dark py-5">
      <style>{`
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
          width: 160px;
          height: 160px;
          margin: auto;
          cursor: pointer;
        }
        .flip-card-inner {
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          overflow: hidden;
        }
        .flip-card-front {
          background-color: #111;
          background-size: cover;
          background-position: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        .flip-card-back {
          background-color: #222;
          transform: rotateY(180deg);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }
        .flip-title {
          font-size: 1.2rem;
          font-weight: bold;
          color: #ffc107;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        }
      `}</style>

      <h2 className="text-center text-warning fw-bold mb-4">Our Menu</h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        loop
        autoplay={{ delay: 2500 }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {categories.map((cat, i) => (
          <SwiperSlide key={i}>
            <div
              className="flip-card"
              onClick={() =>
                navigate(`/menu?category=${cat.name.toLowerCase()}`) // ✅ Correct navigation
              }
            >
              <div className="flip-card-inner">
                <div
                  className="flip-card-front"
                  style={{ backgroundImage: `url(${cat.image})` }}
                ></div>
                <div className="flip-card-back">
                  <span className="flip-title">{cat.name}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default Categories;
