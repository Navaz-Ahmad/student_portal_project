import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const Academics = ({ studentId }) => {
  const [academics, setAcademics] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;
    const fetchAcademics = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/academics/${studentId}`);
        const data = await response.json();
        if (response.ok && data.academics) {
          setAcademics(data.academics);
          setFormData(data.academics);
        } else {
          setAcademics({});
          setFormData({});
        }
      } catch (err) {
        console.error("Error fetching academics:", err);
        setError("Error fetching academic details");
      }
    };
    fetchAcademics();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/academics/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setAcademics(data.academics);
        setEditing(false);
      } else {
        setError(data.error || "Failed to update academic details");
      }
    } catch (err) {
      console.error("Error updating academics:", err);
      setError("Error updating academic details");
    }
  };

  return (
    <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', border: 'none' }}>
      <Card.Header 
        as="h3" 
        style={{ 
          backgroundColor: '#007bff', 
          color: '#fff', 
          borderTopLeftRadius: '8px', 
          borderTopRightRadius: '8px',
          padding: '15px',
          fontFamily: 'Poppins, sans-serif' 
        }}>
        Academic Details
      </Card.Header>
      <Card.Body style={{ backgroundColor: '#f8f9fa', padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#495057' }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {editing ? (
          <Form>
            {[
              { label: 'Course Name', name: 'course_name' },
              { label: 'University', name: 'university' },
              { label: 'Department', name: 'department' },
              { label: 'Year of Study', name: 'year_of_study', type: 'number' },
              { label: 'Semester', name: 'semester', type: 'number' },
              { label: 'CGPA', name: 'cgpa', type: 'number', step: '0.01' },
              { label: 'Percentage', name: 'percentage', type: 'number', step: '0.01' },
              { label: 'Backlogs', name: 'backlogs', type: 'number' },
              { label: 'Attendance (%)', name: 'attendance', type: 'number', step: '0.01' },
              { label: 'Elective Courses', name: 'elective_courses' },
              { label: 'Projects', name: 'projects' },
              { label: 'Internships', name: 'internships' },
              { label: 'Certifications', name: 'certifications' },
              { label: 'Research Papers', name: 'research_papers' },
              { label: 'Achievements', name: 'achievements' }
            ].map(({ label, name, type, step }) => (
              <Form.Group controlId={`form${name}`} key={name} className="mb-3">
                <Form.Label style={{ fontWeight: '600' }}>{label}:</Form.Label>
                <Form.Control
                  type={type || 'text'}
                  name={name}
                  step={step}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  style={{ borderRadius: '4px', borderColor: '#ced4da' }}
                />
              </Form.Group>
            ))}
          </Form>
        ) : (
          <>
            {Object.entries(academics).map(([key, value]) => (
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
      <Card.Footer style={{ backgroundColor: '#f1f3f5', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', padding: '15px' }}>
        {editing ? (
          <>
            <Button variant="success" onClick={handleSave} className="me-2">Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditing(true)}>Edit Academic Details</Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default Academics;
