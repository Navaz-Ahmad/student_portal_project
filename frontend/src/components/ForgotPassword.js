import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImage from '../assets/sp3.jpg';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Step 1: Get email and fetch security questions
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSecurityQuestions(data.questions); // API returns { questions: [...] }
        setStep(2);
      } else {
        setError(data.error || 'Error fetching security questions');
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      setError('Something went wrong');
    }
  };

  // Handle answer change for each security question
  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  // Step 2: Verify answers and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login/student');
        }, 3000);
      } else {
        setError(data.error || 'Error resetting password');
      }
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError('Something went wrong');
    }
  };

  return (
    <>
      {/* Inline CSS for blue glow animation with updated text color */}
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
        .glow-heading {
          animation: blueGlow 2s infinite alternate;
          color: #3399ff;
        }
      `}</style>
      
      {/* Outer container with blue gradient overlay on the background image */}
      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(rgba(0, 123, 255, 0.7), rgba(0, 200, 255, 0.7)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          
          alignItems: 'flex-start', // Changed from 'center'
          justifyContent: 'center',
          paddingTop: '50px', // Added padding to push content below top
          display: 'flex',
        }}
      >
        <div className="container mt-5">
          {/* Glass-like form container similar to Signup design */}
          <div
            className="mx-auto"
            style={{
              maxWidth: '500px',
              width: '600px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              alignItems: 'flex-start', // Changed from 'center'

              padding: '20px',
            }}
          >
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="text-center">
    <h2 style={{ color: 'blue' }} className="mb-4">Forgot Password</h2>
    <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary">Next</button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="text-center">
                <h2 style={{ color: 'blue' }}  className=" mb-4">Answer Security Questions</h2>
                {securityQuestions.map((question, index) => (
                  <div className="mb-3" key={index}>
                    <label className="form-label">{question}</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={answers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      required 
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label">New Password:</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                {message && <p className="text-success">{message}</p>}
                <button type="submit" className="btn btn-primary">Reset Password</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
