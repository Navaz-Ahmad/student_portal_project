import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../assets/login3.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ onLogin }) => {
  // Extract the role from the URL pathname (expecting a URL like /login/student or /login/faculty)
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const urlRole = (pathParts[2] || 'student').toLowerCase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  /**
   * WaterDropOverlay - Creates smaller, more numerous droplets for a realistic condensation effect
   */
  const WaterDropOverlay = () => {
    const dropCount = 600; // Increase for more droplets
    const drops = Array.from({ length: dropCount }, (_, i) => {
      const left = Math.random() * 100;
      const top = -15 + Math.random() * 15;
      const size = 1 + Math.random() * 5;
      const duration = 1 + Math.random() * 10;
      const delay = Math.random() * 5;

      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${top}vh`,
            left: `${left}vw`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            pointerEvents: 'none',
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.02) 80%, transparent 100%)`,
            boxShadow: `inset 0 0 3px rgba(255,255,255,0.2), 0 0 4px rgba(0,0,0,0.25)`,
            backdropFilter: 'blur(1px)',
            animation: `wateryDrop ${duration}s linear ${delay}s infinite`,
          }}
        />
      );
    });

    return (
      <>
        <style>{`
          @keyframes wateryDrop {
            0% {
              transform: translateY(0) scale(0.8);
              opacity: 0;
            }
            5% {
              opacity: 1;
            }
            80% {
              transform: translateY(100vh) scale(1);
              opacity: 0.9;
            }
            90% {
              transform: translateY(100vh) scale(1.2);
              opacity: 0.5;
            }
            100% {
              transform: translateY(110vh) scale(1.3);
              opacity: 0;
            }
          }
        `}</style>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          {drops}
        </div>
      </>
    );
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`http://localhost:3001/api/auth/login/${urlRole}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        // Convert the returned user role to lowercase (after trimming) for comparison
        const userRole = data.user.role ? data.user.role.trim().toLowerCase() : '';
        console.log("URL Role:", urlRole, "User Role:", userRole);
        if (userRole === 'faculty') {
          navigate('/FacultyDashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* WaterDropOverlay remains as before */}
      <WaterDropOverlay />

      <div
        className="shadow-lg p-4 d-flex flex-column align-items-center"
        style={{
          maxWidth: '450px',
          width: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '2rem',
            fontWeight: '700',
            color: '#00FFFF',
            textShadow: '0 0 15px rgba(0, 255, 255, 0.8)',
          }}
        >
          Login as {urlRole.charAt(0).toUpperCase() + urlRole.slice(1)}
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" style={{ width: '100%' }}>
          <div className="mb-3">
            <label className="form-label text-warning fw-bold">Email:</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-light"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-warning fw-bold">Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control bg-dark text-white border-light"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <p className="text-danger text-center">{error}</p>}
          <div className="d-grid">
            <button type="submit" className="btn btn-warning shadow-lg">Login</button>
          </div>
        </form>

        <p className="text-center mt-3 text-white">
          Forgot your password? <Link to="/forgot-password" className="text-info">Reset it here!</Link>
        </p>

        <p className="text-center mt-3 text-white">
          Don't have an account? <Link to="/signup" className="text-info">Sign up here!</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
