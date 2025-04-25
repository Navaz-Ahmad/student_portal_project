import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import bgImage from "../assets/n2.jpeg"; // Background image
import headerImage from "../assets/ns1.jpg"; // Header image

const FacultyDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  let storedUser = user;
  if (!storedUser) {
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (err) {
      console.error("Error parsing stored user:", err);
    }
  }

  // Ensure the user is a faculty member.
  const isFaculty = storedUser?.role === "faculty";

  useEffect(() => {
    if (!storedUser || Object.keys(storedUser).length === 0 || !isFaculty) {
      navigate("/login", { replace: true });
    }
  }, [storedUser, navigate, isFaculty]);

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Main Content Box */}
      <div
        className="shadow-lg"
        style={{
          width: "90%",
          minHeight: "750px",
          maxWidth: "1100px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.3)",
        }}
      >
        {/* Welcome Section */}
        <div
          className="align-items-center justify-content-center"
          style={{
            padding: "2rem",
            background: "linear-gradient(135deg, #72edf2 10%, #5151e5 100%)",
            //background: "linear-gradient(135deg, #f39c12 10%, #e74c3c 100%)",
            borderRadius: "10px",
            marginBottom: "20px",
            textAlign: "center",
            color: "white",
          }}
        >
          <h1
            className="mb-3 d-flex align-items-center justify-content-center"
            style={{
              //textShadow: "0 0 15px rgba(255, 255, 0, 0.8)",
              color: "rgba(24, 35, 118, 0.8)",
            }}
          >
            Welcome back, {storedUser?.name || "Faculty"}!
          </h1>
          <h5>Faculty ID: {storedUser?.id || "N/A"}</h5>
          <h5>Department: {storedUser?.department || "N/A"}</h5>
          <h2>Inspire and Lead the Future!</h2>
        </div>

        {/* Heading Section with Image */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={headerImage}
            alt="Dashboard Header"
            style={{
              minWidth: "1050px",
              maxHeight: "500px",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Motivational Message Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #72edf2 10%, #5151e5 100%)",
            //background: "linear-gradient(135deg, #f39c12 10%, #e74c3c 100%)",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            marginTop: "20px",
          }}
        >
          <h2
            style={{
              WebkitBackgroundClip: "text",
             // textShadow: "0 0 15px rgba(255, 255, 0, 0.8)",
              textAlign: "center",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            "Educate. Inspire. Transform!"
          </h2>
          <h6
            style={{
              textAlign: "center",
              color: "#f0f0f0",
              fontSize: "1.1rem",
            }}
          >
            As a mentor, you shape the leaders of tomorrow. Your wisdom and guidance 
            ignite curiosity and foster innovation. Every lesson, every insight, 
            and every word of encouragement leaves a lasting impact. Keep inspiring, 
            keep leading, and continue to transform lives!
          </h6>
        </div>

        {/* Ensures nested faculty routes (attendance, assignments, etc.) render properly */}
        <Outlet />
      </div>
    </div>
  );
};

export default FacultyDashboard;
