import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/n2.jpeg'; // Background image

const FacultyLeaderboard = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState('');
  const [points, setPoints] = useState('');
  const [rank, setRank] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/facultyLeaderboard');
      const data = await response.json();
      if (response.ok) {
        setLeaderboard(data.leaderboard);
      } else {
        setError(data.error || 'Failed to load faculty leaderboard');
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError('Something went wrong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !points || !rank || !eventName || !eventDate) {
      setError("All fields are required");
      return;
    }

    const entryData = { student_id: studentId, points, rank, event_name: eventName, event_date: eventDate };

    try {
      let response, data;
      if (editingEntry) {
        response = await fetch(`http://localhost:3001/api/facultyLeaderboard/update/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData),
        });
        data = await response.json();
      } else {
        response = await fetch('http://localhost:3001/api/facultyLeaderboard/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData),
        });
        data = await response.json();
      }

      if (response.ok) {
        fetchLeaderboard();
        resetForm();
      } else {
        setError(data.error || 'Failed to update leaderboard');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError('Something went wrong');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setStudentId(entry.student_id);
    setPoints(entry.points);
    setRank(entry.rank);
    setEventName(entry.event_name);
    const d = new Date(entry.event_date);
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    setEventDate(`${year}-${month}-${day}`);
  };

  const resetForm = () => {
    setStudentId('');
    setPoints('');
    setRank('');
    setEventName('');
    setEventDate('');
    setEditingEntry(null);
    setError('');
  };

  const groupByEvent = leaderboard.reduce((groups, entry) => {
    const key = entry.event_name ? entry.event_name.trim() : "Not available";
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
    return groups;
  }, {});

  const groupedArray = Object.entries(groupByEvent).map(([key, entries]) => ({
    event_name: key,
    entries,
  }));

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Not available';
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          padding: '20px',
          marginLeft: '10%',
          maxWidth: '1000px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          Faculty Leaderboard
        </h2>

        <Form onSubmit={handleSubmit} className="mb-4 mt-4">
          <h4>{editingEntry ? 'Edit' : 'Add'} Leaderboard Entry</h4>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <Form.Group controlId="studentId">
            <Form.Label>Student ID</Form.Label>
            <Form.Control type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Enter Student ID" required />
          </Form.Group>
          <Form.Group controlId="points">
            <Form.Label>Points</Form.Label>
            <Form.Control type="number" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Enter Points" required />
          </Form.Group>
          <Form.Group controlId="rank">
            <Form.Label>Rank</Form.Label>
            <Form.Control type="number" value={rank} onChange={(e) => setRank(e.target.value)} placeholder="Enter Rank" required />
          </Form.Group>
          <Form.Group controlId="eventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Enter Event Name" required />
          </Form.Group>
          <Form.Group controlId="eventDate">
            <Form.Label>Event Date</Form.Label>
            <Form.Control type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          </Form.Group>
          <div className="mt-3">
            <Button variant="primary" type="submit">
              {editingEntry ? 'Update Entry' : 'Add Entry'}
            </Button>{' '}
            {editingEntry && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </Form>

        <h3 className="text-center mt-4">Available Events</h3>
        {groupedArray.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No events available.</p>
        ) : (
          groupedArray.map((group, index) => {
            const sortedEntries = group.entries.sort((a, b) => a.rank - b.rank);
            return (
              <div key={index} style={{ marginBottom: '40px' }}>
                <h3
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'blue',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  Event: {group.event_name}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Table striped bordered hover style={{ maxWidth: '600px' }}>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Points</th>
                        <th>Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedEntries.map((entry, idx) => (
                        <tr key={idx}>
                          <td>{entry.student_id}</td>
                          <td>{entry.points}</td>
                          <td>{entry.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            );
          })
        )}
        <Link to="/dashboard" className="btn btn-secondary mt-3">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default FacultyLeaderboard;
