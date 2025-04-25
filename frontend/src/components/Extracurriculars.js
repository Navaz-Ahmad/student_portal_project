// src/components/Extracurriculars.js
import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const Extracurriculars = ({ studentId }) => {
  const [extracurriculars, setExtracurriculars] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;
    const fetchExtracurriculars = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/extracurriculars/${studentId}`);
        const data = await response.json();
        if (response.ok && data.extracurriculars) {
          setExtracurriculars(data.extracurriculars);
          setFormData(data.extracurriculars);
        } else {
          setExtracurriculars({});
          setFormData({});
        }
      } catch (err) {
        console.error("Error fetching extracurriculars:", err);
        setError("Error fetching extracurricular activities");
      }
    };
    fetchExtracurriculars();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/extracurriculars/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setExtracurriculars(data.extracurriculars);
        setEditing(false);
      } else {
        setError(data.error || "Failed to update extracurricular activities");
      }
    } catch (err) {
      console.error("Error updating extracurriculars:", err);
      setError("Error updating extracurricular activities");
    }
  };

  return (
    <Card className="mb-4" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', border: 'none' }}>
      <Card.Header as="h3" style={{
        backgroundColor: '#007bff',
        color: '#fff',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        padding: '15px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        Co‑/Extracurricular Activities
      </Card.Header>
      <Card.Body style={{ backgroundColor: '#f8f9fa', padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#495057' }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {editing ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Clubs:</Form.Label>
              <Form.Control type="text" name="clubs" value={formData.clubs || ""} onChange={handleChange} style={{ borderRadius: '4px', borderColor: '#ced4da' }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sports:</Form.Label>
              <Form.Control type="text" name="sports" value={formData.sports || ""} onChange={handleChange} style={{ borderRadius: '4px', borderColor: '#ced4da' }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Volunteer Activities:</Form.Label>
              <Form.Control type="text" name="volunteer_activities" value={formData.volunteer_activities || ""} onChange={handleChange} style={{ borderRadius: '4px', borderColor: '#ced4da' }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Leadership Roles:</Form.Label>
              <Form.Control type="text" name="leadership_roles" value={formData.leadership_roles || ""} onChange={handleChange} style={{ borderRadius: '4px', borderColor: '#ced4da' }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Other Activities:</Form.Label>
              <Form.Control type="text" name="other_activities" value={formData.other_activities || ""} onChange={handleChange} style={{ borderRadius: '4px', borderColor: '#ced4da' }} />
            </Form.Group>
          </Form>
        ) : (
          <>
            <div style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              border: '1px solid #e9ecef',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              <strong style={{ color: '#343a40' }}>Clubs:</strong> {extracurriculars.clubs || 'Not provided'}
            </div>
            <div style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              border: '1px solid #e9ecef',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              <strong style={{ color: '#343a40' }}>Sports:</strong> {extracurriculars.sports || 'Not provided'}
            </div>
            <div style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              border: '1px solid #e9ecef',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              <strong style={{ color: '#343a40' }}>Volunteer Activities:</strong> {extracurriculars.volunteer_activities || 'Not provided'}
            </div>
            <div style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              border: '1px solid #e9ecef',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              <strong style={{ color: '#343a40' }}>Leadership Roles:</strong> {extracurriculars.leadership_roles || 'Not provided'}
            </div>
            <div style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              border: '1px solid #e9ecef',
              fontFamily: 'Segoe UI, sans-serif'
            }}>
              <strong style={{ color: '#343a40' }}>Other Activities:</strong> {extracurriculars.other_activities || 'Not provided'}
            </div>
          </>
        )}
      </Card.Body>
      <Card.Footer style={{ backgroundColor: '#f1f3f5', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', padding: '15px' }}>
        {editing ? (
          <>
            <Button variant="success" onClick={handleSave} className="mr-2">Save</Button>
            <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditing(true)}>Edit Extracurriculars</Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default Extracurriculars;
