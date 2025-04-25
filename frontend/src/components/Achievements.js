// src/components/Achievements.js
import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const Achievements = ({ studentId }) => {
  const [achievement, setAchievement] = useState({}); // Use singular for one record
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) return;
    const fetchAchievements = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/achievements/${studentId}`);
        const data = await response.json();
        console.log("Fetched achievements data:", data);
        // Check if data.achievements exists and is an array with at least one element
        if (response.ok && Array.isArray(data.achievements) && data.achievements.length > 0) {
          setAchievement(data.achievements[0]);
          setFormData(data.achievements[0]);
        } else {
          // No record found; set empty object
          setAchievement({});
          setFormData({});
        }
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("Error fetching achievements");
      }
    };
    fetchAchievements();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        achievement_desc: formData.achievement_desc || "",
        award_name: formData.award_name || "",
        award_date: formData.award_date || "",
        certification: formData.certification || ""
      };
      console.log("Sending update payload:", payload);
      const response = await fetch(`http://localhost:3001/api/achievements/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log("Response from update achievements:", data);
      if (response.ok && Array.isArray(data.achievements) && data.achievements.length > 0) {
        setAchievement(data.achievements[0]);
        setEditing(false);
      } else {
        setError(data.error || "Failed to update achievements");
      }
    } catch (err) {
      console.error("Error updating achievements:", err);
      setError("Error updating achievements");
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
        Achievements & Activities
      </Card.Header>
      <Card.Body style={{ backgroundColor: '#f8f9fa', padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#495057' }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {editing ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Achievement Description:</Form.Label>
              <Form.Control
                type="text"
                name="achievement_desc"
                value={formData.achievement_desc || ""}
                onChange={handleChange}
                style={{ borderRadius: '4px', borderColor: '#ced4da' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Award Name:</Form.Label>
              <Form.Control
                type="text"
                name="award_name"
                value={formData.award_name || ""}
                onChange={handleChange}
                style={{ borderRadius: '4px', borderColor: '#ced4da' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Award Date:</Form.Label>
              <Form.Control
                type="date"
                name="award_date"
                value={formData.award_date || ""}
                onChange={handleChange}
                style={{ borderRadius: '4px', borderColor: '#ced4da' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Certification:</Form.Label>
              <Form.Control
                type="text"
                name="certification"
                value={formData.certification || ""}
                onChange={handleChange}
                style={{ borderRadius: '4px', borderColor: '#ced4da' }}
              />
            </Form.Group>
          </Form>
        ) : (
          <>
            <div
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
                Achievement Description:
              </strong>{' '}
              {achievement.achievement_desc || 'Not provided'}
            </div>
            <div
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
                Award Name:
              </strong>{' '}
              {achievement.award_name || 'Not provided'}
            </div>
            <div
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
                Award Date:
              </strong>{' '}
              {achievement.award_date || 'Not provided'}
            </div>
            <div
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
                Certification:
              </strong>{' '}
              {achievement.certification || 'Not provided'}
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
          <Button variant="primary" onClick={() => setEditing(true)}>Edit Achievements</Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default Achievements;
