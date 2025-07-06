import React, { useEffect, useState } from "react";

const Stat = ({ target, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    const duration = 2000;
    const increment = Math.ceil(end / (duration / 50));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center text-light">
      <h3 className="text-warning fw-bold">{count}+</h3>
      <p className="text-muted">{label}</p>
    </div>
  );
};

const StatsCounter = () => {
  return (
    <section style={{ backgroundColor: "#111", padding: "4rem 0" }}>
      <div className="container d-flex justify-content-around flex-wrap">
        <Stat target="20" label="Years of Excellence" />
        <Stat target="1000000" label="Happy Customers" />
        <Stat target="500" label="Staff Members" />
      </div>
    </section>
  );
};

export default StatsCounter;
