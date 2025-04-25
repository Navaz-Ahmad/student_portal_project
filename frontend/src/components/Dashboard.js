import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import bgImage from "../assets/n2.jpeg"; // Adjust the path as needed
import headerImage from "../assets/ns1.jpg"; // Adjust the path as needed


const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  let storedUser = user;
  if (!storedUser) {
    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch (err) {
      console.error("Error parsing stored user:", err);
    }
  }

  // Determine if the logged-in user is a faculty member
  const isFaculty = storedUser?.role === "faculty";

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!storedUser || Object.keys(storedUser).length === 0) {
      navigate("/login", { replace: true });
    }
  }, [storedUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (typeof setUser === "function") {
      setUser(null);
    }
    navigate("/", { replace: true });
  };

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
      {/* Profile Icon */}
      <Link
        to="/profile"
        className="position-absolute top-0 end-0 m-3"
        style={{ textDecoration: "none", cursor: "pointer" }}
      >
        <div
          className="d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "#333",
            color: "white",
            fontSize: "24px",
          }}
        >
          {storedUser?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </Link>

      {/* Main Content Box */}
      <div
        className="shadow-lg "
        style={{
          width: "90%",
          minHeight: "750px",
          maxWidth: "1100px",
          marginleft: "10%",
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight transparency for a clean look
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.3)",
        }}
      >
        {/* Welcome Section */}
        <div className=" align-items-center justify-content-center"
          style={{
            textAlign: "top",
            padding: "2rem",
            background: "linear-gradient(135deg, #72edf2 10%, #5151e5 100%)",
            //backgroundColor: "blue", // Dark overlay for contrast
            borderRadius: "10px",
            marginBottom:'20px',
            textAlign:'center',
            color: "white",
          }}
        >
          <h1
            className="mb-3 d-flex align-items-center justify-content-center"
            style={{
              textShadow: "0 0 15px rgba(0, 255, 255, 0.8)",
              color:"rgba(24, 35, 118, 0.8)",
            }}
          >
            Welcome back, {storedUser?.name || "User"}!
          </h1>
          <h5>
            {isFaculty ? "Faculty ID" : "Student ID"}: {storedUser?.id || "N/A"}
          </h5>
          <h5>
            {isFaculty ? "Department" : "Branch"}:{" "}
            {storedUser?.department || storedUser?.branch || "N/A"}
          </h5>
         <h2> Begin Your Transformation</h2>

        </div>

      
           {/* Heading Section */}
           <div
          style={{
            
          }}
        >
        
        </div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={headerImage}
            alt="Dashboard Header"
            style={{
              minWidth: "1050px",
              //height: "auto",
              maxHeight:'500px',
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Motivational Message Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #72edf2 10%, #5151e5 100%)",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            marginTop: "20px",
          }}
        >
          <h2
            style={{
              WebkitBackgroundClip: "text",
             // color: "transparent",
              textShadow: "0 0 15px rgba(0, 255, 255, 0.8)",
              textAlign: "center",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            "Ignite Your Potential!"
          </h2>
          <h6
            style={{
              textAlign: "center",
              color: "#f0f0f0",
              fontSize: "1.1rem",
            }}
          >
            Embark on your journey to excellence by exploring the tools and
            resources on the sidebar. Each click brings you closer to unlocking
            your full potential. Embrace every challenge as an opportunity to
            grow and let your passion for learning guide you to success.
            Remember, every step forward is progress—so dive in and make today
            the start of something extraordinary!
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
