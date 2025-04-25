import React, { useEffect, useState } from 'react';
import { Button, Container, Card, Form, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Academics from './Academics';
import Achievements from './Achievements';
import Extracurriculars from './Extracurriculars';
import studentImage from "../assets/student.jpeg"; // Student image
import backgroundImage from "../assets/n2.jpeg"; // Background image


const Profile = ({ user, setUser }) => {
  const [personal, setPersonal] = useState(null);
  const [error, setError] = useState('');
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) {
      setError('User information not available.');
      return;
    }

    const fetchPersonal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/students/${user.id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok && data.student) {
          setPersonal(data.student);
          setPersonalForm(data.student || {});
        } else {
          setError(data.error || 'Failed to load personal info');
        }
      } catch (err) {
        console.error('Error fetching personal info:', err);
        setError('Error fetching personal info');
      }
    };

    fetchPersonal();
  }, [user]);

  const updatePersonal = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/students/${personal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalForm)
      });
      const data = await response.json();
      if (response.ok) {
        setPersonal(data.student);
        setEditingPersonal(false);
      } else {
        setError(data.error || 'Failed to update personal info');
      }
    } catch (err) {
      console.error('Error updating personal info:', err);
      setError('Error updating personal info');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (typeof setUser === 'function') setUser(null);
    navigate('/');
  };

  if (error)
    return (
      <Container>
        <p style={{ color: 'red', fontFamily: 'Segoe UI, sans-serif' }}>{error}</p>
      </Container>
    );
  if (!personal)
    return (
      <Container>
        <p style={{ fontFamily: 'Segoe UI, sans-serif' }}>Loading profile...</p>
      </Container>
    );

  return (
    <Container
      fluid
      style={{
        background: 'linear-gradient(to right, #f0f4f8, #d9e2ec)',
        backgroundImage: `url(${backgroundImage})`,
        //backgroundRepeat: 'no-repeat',
             // Makes the image cover the entire screen

        minHeight: '100vh',
        padding: '0'
      }}
    >
      <Col md={10} className="p-4" style={{ marginLeft: '10%' }}>
        <Card
          className="mb-4"
          style={{
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            border: 'none'
          }}
        >
          <Card.Header
            as="h2"
            style={{
              backgroundColor: '#007bff',
              color: '#fff',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              padding: '15px',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            Student Personal Information
          </Card.Header>
          <Card.Body style={{ backgroundColor: '#f8f9fa', padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#495057' }}>
            {editingPersonal ? (
              <Form>
                {[
                  { label: 'Name', name: 'name', type: 'text' },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Branch', name: 'branch', type: 'text' },
                  { label: 'Date of Birth', name: 'dob', type: 'date' },
                  { label: 'Gender', name: 'gender', type: 'text' },
                  { label: 'Phone', name: 'phone_number', type: 'text' },
                  { label: 'Permanent Address', name: 'permanent_address', type: 'text' },
                  { label: 'Current Address', name: 'current_address', type: 'text' },
                  { label: 'Nationality', name: 'nationality', type: 'text' },
                  { label: 'Guardian Name', name: 'guardian_name', type: 'text' },
                  { label: 'Guardian Contact', name: 'guardian_contact', type: 'text' },
                ].map(({ label, name, type }) => (
                  <Form.Group controlId={`form${name}`} key={name} className="mb-3">
                    <Form.Label style={{ fontWeight: '600' }}>{label}:</Form.Label>
                    <Form.Control
                      type={type}
                      name={name}
                      value={personalForm[name] || ''}
                      onChange={(e) => setPersonalForm({ ...personalForm, [name]: e.target.value })}
                      style={{ borderRadius: '4px', borderColor: '#ced4da' }}
                    />
                  </Form.Group>
                ))}
              </Form>
            ) : (
              <>
                {Object.entries(personal).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      border: '1px solid #e9ecef',
                      fontFamily: 'Segoe UI, sans-serif'
                    }}
                  >
                    <strong style={{ textTransform: 'capitalize', color: '#343a40' }}>
                      {key.replace('_', ' ')}:
                    </strong>{' '}
                    {value || 'Not provided'}
                  </div>
                ))}
              </>
            )}
          </Card.Body>
          <Card.Footer
            style={{
              backgroundColor: '#f1f3f5',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px',
              padding: '15px',
              fontFamily: 'Segoe UI, sans-serif'
            }}
          >
            {editingPersonal ? (
              <>
                <Button variant="success" onClick={updatePersonal} className="me-2">
                  Save
                </Button>
                <Button variant="secondary" onClick={() => setEditingPersonal(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setEditingPersonal(true)}>
                Edit Personal Info
              </Button>
            )}
          </Card.Footer>
        </Card>

        {/* Render Sub-Components */}
        <Academics studentId={personal.id} />
        <Achievements studentId={personal.id} />
        <Extracurriculars studentId={personal.id} />

       
      </Col>
    </Container>
  );
};

export default Profile;
