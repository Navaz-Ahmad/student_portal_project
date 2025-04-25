import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import facultyImage from '../assets/faculty.jpeg';
import navImage from '../assets/k2.jpg'; // Navbar background image
import 'bootstrap/dist/css/bootstrap.min.css';

const FacultyLayout = ({ user, handleLogout }) => (
  <div className="container-fluid" style={{ minHeight: '100vh' }}>
    {/* Global nav link styling */}
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
        position: 'fixed',
        left: 0,
        top: 0,
        width: '290px',
        height: '100vh',
        borderRight: '1px solid #ddd',
        backgroundImage: `url(${navImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div className="sidebar-sticky pt-3 fs-5">
        <ul className="nav flex-column">
          <li className="nav-item mb-2" style={{ textAlign: 'center' }}>
            <img
              src={facultyImage}
              alt="Faculty"
              className="img-fluid rounded-circle mb-3"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '80px',
                height: '80px',
                objectFit: 'cover',
              }}
            />
          </li>
          <li className="nav-item mb-3 fs-4" style={{ marginLeft: '12%' }}>
            <NavLink className="nav-link text-white" to="/facultyDashboard">
               Dashboard
            </NavLink>
          </li>
          <li className="nav-item mb-2 fs-4" style={{ marginLeft: '12%' }}>
            <NavLink className="nav-link text-white" to="/facultyAttendance">
              Attendance
            </NavLink>
          </li>
          <li className="nav-item mb-2 fs-4" style={{ marginLeft: '12%' }}>
            <NavLink className="nav-link text-white" to="/facultyAssignments">
              Assignments
            </NavLink>
          </li>
          <li className="nav-item mb-2 fs-4" style={{ marginLeft: '12%' }}>
            <NavLink className="nav-link text-white" to="/facultyMaterials">
              Study Materials
            </NavLink>
          </li>
          <li className="nav-item mb-3 fs-4" style={{ marginLeft: '12%' }}>
            <NavLink className="nav-link text-white" to="/faculty-calendar">
              Calendar
            </NavLink>
          </li>
          <li className="nav-item mb-3 fs-4" style={{ marginLeft: '12%' }}>
            <NavLink className="nav-link text-white" to="/faculty-leaderboard">
              Leaderboard
            </NavLink>
          </li>
          <li className="nav-item mb-3" style={{ marginLeft: '12%' }}>
            <span
              className="nav-link fs-4"
              style={{ cursor: 'pointer', color: 'red' }}
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
        marginLeft: '290px', // Should match sidebar width
        padding: '0',
        width: 'calc(100% - 290px)',
        minHeight: '100vh',
        overflowY: 'auto',
      }}
    >
      <Outlet />
    </main>
  </div>
);

export default FacultyLayout;
