import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import studentImage from "../assets/student.jpeg"; // Student image
import facultyImage from "../assets/faculty.jpeg"; // Faculty image
import navImage from "../assets/k2.jpg"; // Navbar background image

const MainLayout = ({ user, handleLogout }) => {
  // Determine if the logged-in user is a faculty member
  const isFaculty = user?.role === "faculty";

  return (
    <div className="container-fluid" style={{ minHeight: "100vh" }}>
      <style>{`
     .nav-link:hover,
.nav-link.active {
  text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
  color: rgba(0, 255, 255, 0.8) !important;
}

      `}</style>
      {/* Sidebar - Fixed */}
      <nav
        className="sidebar"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "290px", // Adjust width as needed
          height: "100vh",
          borderRight: "1px solid #ddd",
          backgroundImage: `url(${navImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "20px",
          overflowY: "auto", // Keeps navbar content scrollable if needed
        }}
      >
        <div className="sidebar-sticky pt-3 fs-5">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <img
                src={isFaculty ? facultyImage : studentImage}
                alt={isFaculty ? "Faculty" : "Student"}
                className="img-fluid rounded-circle mb-3"
                style={{
                  marginLeft: "27%",
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
              />
            </li>
            <li className="nav-item mb-3 fs-4" style={{ marginLeft: "12%" }}>
              <NavLink className="nav-link text-white" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item mb-2 fs-4" style={{ marginLeft: "12%" }}>
              <NavLink className="nav-link text-white" to="/profile">
                Profile
              </NavLink>
            </li>
            <li className="nav-item mb-3 fs-4" style={{ marginLeft: "12%" }}>
              <NavLink className="nav-link text-white" to="/attendance">
                Attendance
              </NavLink>
            </li>
            <li className="nav-item mb-3 fs-4" style={{ marginLeft: "12%" }}>
              <NavLink className="nav-link text-white" to="/assignments">
                Assignments
              </NavLink>
            </li>
            <li className="nav-item mb-3 fs-4" style={{ marginLeft: "12%" }}>
              <NavLink className="nav-link text-white" to="/materials">
                Study Materials
              </NavLink>
            </li>
            <li className="nav-item mb-3 fs-4" style={{ marginLeft: "12%" }}>
              <NavLink className="nav-link text-white" to="/calendar">
                Calendar
              </NavLink>
            </li>
            <li className="nav-item mb-3 fs-4" style={{ marginLeft: "12%" }}>
              <NavLink className="nav-link text-white" to="/leaderboard">
                Leaderboard
              </NavLink>
            </li>
            <li className="nav-item mb-3" style={{ marginLeft: "12%" }}>
              <span
                className="nav-link fs-4"
                style={{ cursor: "pointer", color: "red" }}
                onClick={handleLogout}
              >
                Logout
              </span>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area - Scrollable */}
      <main
        className="content"
        style={{
          marginLeft: "250px", // Should match sidebar width
          padding: "0",
          width: "calc(100% - 250px)",
          minHeight: "100vh",
          overflowY: "auto", // Enables scrolling for content only
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
