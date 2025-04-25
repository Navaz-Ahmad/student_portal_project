// Layout.js
import React from 'react';
import { Link } from 'react-router-dom';
import facultyImage from '../assets/faculty.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ user, children, handleLogout }) => (
  <div className="container-fluid" style={{ minHeight: '100vh', position: 'relative' }}>
      
    {/* Profile Icon */}
    <Link to="/profile" className="position-absolute top-0 end-0 m-3" style={{ textDecoration: 'none', cursor: 'pointer' }}>
      <div
        className="rounded-circle bg-primary d-flex justify-content-center align-items-center"
        style={{ width: '50px', height: '50px', color: 'white', fontSize: '24px' }}
      >
        {user?.name?.charAt(0).toUpperCase() || 'F'}
      </div>
    </Link>

    <div className="row" style={{ minHeight: '100vh' }}>
  
      {/* Navbar */}
      <nav
        className="col-md-3 col-lg-2 bg-light sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          borderRight: '1px solid #ddd',
          paddingTop: '20px',
        }}
      >
        <div className="sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <img
                src={facultyImage}
                alt="Faculty"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <Link className="nav-link active" to="/facultyDashboard">
                Faculty Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/facultyAttendance">
                Attendance
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/facultyAssignments">
                Assignments
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/facultyMaterials">
                Study Materials
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/faculty-calendar">
                Calendar
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link className="nav-link" to="/faculty-leaderboard">
                Leaderboard
              </Link>
            </li>
            <li className="nav-item mt-4">
              <span className="nav-link" style={{ cursor: 'pointer', color: 'red' }} onClick={handleLogout}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className="col-md-9 ml-sm-auto col-lg-10"
        style={{ marginLeft: '17%', width: '83%', minHeight: '100vh' }}
      >
        {children}
      </main>
    </div>
  </div>
);

export default Layout;
