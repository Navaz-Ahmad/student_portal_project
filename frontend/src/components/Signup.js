import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/sp3.jpg';

const Signup = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [branch, setBranch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email, password, subject, branch })
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <>
      {/* Inline CSS for blue glow animation with blue text */}
      <style>{`
        @keyframes blueGlow {
          0% {
            text-shadow: 0 0 5px #3399ff, 0 0 10px #3399ff, 0 0 15px #3399ff;
          }
          50% {
            text-shadow: 0 0 10px #3399ff, 0 0 15px #3399ff, 0 0 20px #3399ff;
          }
          100% {
            text-shadow: 0 0 5px #3399ff, 0 0 10px #3399ff, 0 0 15px #3399ff;
          }
        }

        .blue-glow {
          animation: blueGlow 2s infinite alternate;
          color: #3399ff; /* Set text color to blue */
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          width: '100vw',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Glass-like form container */}
        <div
          className="p-4 shadow"
          style={{
            width: '600px',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '10px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Glowing heading with blue text */}
          <h2 className="text-center mb-4 text-primary blue pink-glow ">
            Sign Up for Student Portal
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 green-glow  fs-5">
              <label className="form-label">Student ID:</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-6  fs-5">
              <label className="form-label">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3  fs-5">
              <label className="form-label">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3  fs-5">
              <label className="form-label">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3  fs-5">
              <label className="form-label">Year of Study:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3  fs-5">
              <label className="form-label">Branch:</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
                className="form-control"
              />
            </div>
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary blue">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
