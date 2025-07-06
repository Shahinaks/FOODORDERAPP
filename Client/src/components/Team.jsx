import React from "react";
import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";

const teamData = [
  { name: "Chef Ravi", role: "Founder & Executive Chef", img: team1 },
  { name: "Anita Roy", role: "Head of Operations", img: team2 },
  { name: "Rahul Dev", role: "Lead Nutritionist", img: team3 },
];

const Team = () => {
  return (
    <section style={{ backgroundColor: "#111", padding: "4rem 0", color: "#fff" }}>
      <div className="text-center mb-5">
        <h2 className="text-warning fw-bold">Meet Our Team</h2>
        <p className="text-muted">Passionate people behind your favorite meals.</p>
      </div>
      <div className="d-flex justify-content-center gap-5 flex-wrap">
        {teamData.map((member, idx) => (
          <div key={idx} className="text-center">
            <img
              src={member.img}
              alt={member.name}
              className="rounded-circle shadow"
              style={{ width: "180px", height: "180px", objectFit: "cover", border: "4px solid orange" }}
            />
            <h5 className="mt-3 text-warning">{member.name}</h5>
            <p className="text-muted">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;