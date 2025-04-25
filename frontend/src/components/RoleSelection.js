import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-tsparticles';
import studentImage from '../assets/student.jpeg';
import facultyImage from '../assets/faculty.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoleSelection = () => {
  const navigate = useNavigate();

  // Particle Initialization
  const particlesInit = async (engine) => {
    console.log('Particles Initialized:', engine);
    await loadSlim(engine);
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 position-relative">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: '#0d1b2a' }, // Dark blue-black theme
          particles: {
            number: { value: 200, density: { enable: true, area: 800 } },
            size: { value: 5, random: true },
            move: { enable: true, speed: 1, direction: "none", random: true },
            opacity: { value: 0.6, random: true, animation: { enable: true, speed: 1, minimumValue: 0.3 } },
            color: { value: ['#ffffff', '#00c6ff', '#ff9b9b'] }, // White, Neon Blue, and Soft Pink
            shape: { type: 'circle' },
            links: { enable: true, color: '#4f5d75', distance: 100, opacity: 0.2 },
          },
          interactivity: {
            events: { 
              onHover: { enable: false, mode: 'repulse' }, // Repels on hover
              onClick: { enable: true, mode: 'push' }, 
            },
            modes: { 
              repulse: { distance: 150, duration: 0.4 },
              push: { particles_nb: 3 }, 
            },
          },
        }}
        style={{ position: 'absolute', width: '100%', height: '100%', zIndex: -1 }}
      />

      {/* Welcome Section */}
      <div className="text-center position-absolute top-0 w-100 mt-4">
        <h1
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '2.5rem',
            fontWeight: '700',
            WebkitBackgroundClip: 'text',
            color: '#00c6ff',
            textShadow: '0 0 20px rgba(0, 198, 255, 0.8)',
          }}
        >
          Welcome to the Student Portal
        </h1>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '1.3rem',
            fontWeight: '500',
            color: '#ffffffdd',
            textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
            animation: 'fadeIn 1.5s ease-in-out',
          }}
        >
          Choose your role to continue
        </p>
      </div>

      {/* Role Selection Card - Glassmorphic Effect */}
      <div
        className="card shadow-lg d-flex flex-row"
        style={{
          maxWidth: '900px',
          width: '75%',
          background: 'rgba(255, 255, 255, 0.12)', // Adjusted transparency
          backdropFilter: 'blur(12px)', // Slightly stronger blur
          borderRadius: '15px',
          overflow: 'hidden',
          height: '280px',
          border: '1px solid rgba(255, 255, 255, 0.25)', 
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.35)', 
        }}
      >
        <div className="row">
          {/* Student Section */}
          <div className="col-md-6 d-flex flex-column justify-content-between p-4 border-end" style={{ height: '280px' }}>
            <div className="d-flex flex-row align-items-center">
              <img src={studentImage} alt="Student" className="img-fluid"
                style={{ width: '120px', height: '120px', borderRadius: '50%', marginRight: '15px' }} />
              <div>
                <h3 className="fw-bold" style={{ color: '#b8a9ff' }}>Student</h3>
                <p className="text-light" style={{ fontSize: '1rem' }}>
                  Are you a student? Log in to view your progress and open new doors to success.
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn"
                onClick={() => navigate('/login/student')}
                style={{
                  fontSize: '1rem',
                  padding: '0.8rem',
                  width: '250px',
                  minWidth: '150px',
                  transition: '0.3s ease-in-out',
                  background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
                  color: 'white'
                }}
                onMouseEnter={(e) => (e.target.style.boxShadow = '0 0 20px rgba(0, 198, 255, 0.7)')}
                onMouseLeave={(e) => (e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.4)')}
              >
                🎓 Login as Student
              </button>
            </div>
          </div>

          {/* Faculty Section */}
          <div className="col-md-6 d-flex flex-column justify-content-between p-4" style={{ height: '280px' }}>
            <div className="d-flex flex-row align-items-center">
              <img src={facultyImage} alt="Faculty" className="img-fluid"
                style={{ width: '120px', height: '120px', borderRadius: '50%', marginRight: '15px' }} />
              <div>
                <h3 className="fw-bold" style={{ color: '#b8a9ff' }}>Faculty</h3>
                <p className="text-light" style={{ fontSize: '1rem' }}>
                  Welcome, inspiring mentor! Log in to gain insights into students’ performance and guide them to success.
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn"
                onClick={() => navigate('/login/faculty')}
                style={{
                  fontSize: '1rem',
                  padding: '0.8rem',
                  width: '250px',
                  minWidth: '150px',
                  transition: '0.3s ease-in-out',
                  background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 0 10px rgba(0, 198, 255, 0.4)',
                  color: 'white'
                }}
                onMouseEnter={(e) => (e.target.style.boxShadow = '0 0 20px rgba(0, 198, 255, 0.7)')}
                onMouseLeave={(e) => (e.target.style.boxShadow = '0 0 10px rgba(0, 198, 255, 0.4)')}
              >
                👩‍🏫 Login as Faculty
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
