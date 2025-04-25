import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImage from '../assets/n2.jpeg'; // Background image

const FacultyCalendar = ({ user, setUser }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');
  
  const navigate = useNavigate();

  // Fetch all calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/facultyCalendar');
        const data = await response.json();
        console.log("Fetched calendar events:", data);
        if (response.ok) {
          setEvents(data.events || []);
        } else {
          setError(data.error || 'Failed to load events');
        }
      } catch (err) {
        console.error("Error fetching calendar events:", err);
        setError('Something went wrong while fetching events');
      }
    };
    fetchEvents();
  }, []);

  // Handle event upload form submission
  const handleUploadEvent = async (e) => {
    e.preventDefault();
    setUploadMessage('');
    if (!title || !eventDate) {
      setUploadMessage('Title and event date are required.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/facultyCalendar/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, eventDate, description })
      });
      const data = await response.json();
      console.log("Event upload response:", data);
      if (response.ok) {
        setUploadMessage('Event uploaded successfully.');
        setTitle('');
        setEventDate('');
        setDescription('');
        // Refresh events list
        const resp = await fetch('http://localhost:3001/api/facultyCalendar');
        const data2 = await resp.json();
        if (resp.ok) {
          setEvents(data2.events || []);
        }
      } else {
        setUploadMessage(data.error || 'Failed to upload event.');
      }
    } catch (err) {
      console.error("Error uploading event:", err);
      setUploadMessage('Something went wrong while uploading event.');
    }
  };

  return (
    <div 
      className="container-fluid"
      style={{ 
        minHeight: '100vh', 
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Profile Icon */}
      <Link 
        to="/profile"
        className="position-absolute top-0 end-0 m-3"
        style={{ textDecoration: 'none', cursor: 'pointer' }}
      >
        <div 
          className="rounded-circle bg-primary d-flex justify-content-center align-items-center"
          style={{ width: '50px', height: '50px', color: 'white', fontSize: '24px' }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </Link>

      <div 
        className="row"
        style={{
          width: '90%',
          maxWidth: '1000px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '5px 5px 10px rgba(0,0,0,0.2)'
        }}
      >
        <main className="px-4" style={{ width: '100%' }}>
          {/* Calendar Heading with Design */}
          <div 
            style={{ 
              textAlign: 'center', 
              backgroundColor: 'blue', 
              color: 'white', 
              padding: '10px', 
              borderRadius: '10px', 
              border: '3px solid black',
              marginBottom: '20px',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <h2 style={{ margin: 0 }}>Faculty Calendar Events</h2>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          {/* Upload Event Form */}
          <div 
            className="mb-5"
            style={{
              border: '3px solid black',
              borderRadius: '10px',
              padding: '15px',
             // backgroundColor: 'rgba(255, 255, 224, 0.9)',
              boxShadow: '3px 3px 5px rgba(0,0,0,0.2)'
            }}
          >
            <h3>Upload New Calendar Event</h3>
            <form onSubmit={handleUploadEvent}>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Event Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-2">
                <input
                  type="date"
                  className="form-control"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-2">
                <textarea
                  className="form-control"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Upload Event</button>
            </form>
            {uploadMessage && <p style={{ color: uploadMessage.startsWith('Event uploaded') ? 'green' : 'red', textAlign: 'center' }}>{uploadMessage}</p>}
          </div>

          {/* Events List */}
          <div>
            <h3 style={{ textAlign: 'center' }}>All Calendar Events</h3>
            {events.length > 0 ? (
              events.map(evt => (
                <div 
                  key={evt.eventId} 
                  style={{ 
                    border: '3px solid black',
                    borderRadius: '10px', 
                    marginBottom: '20px', 
                    padding: '15px',
                    //backgroundColor: 'rgba(255, 255, 224, 0.9)',
                    boxShadow: '3px 3px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  <h4>{evt.title}</h4>
                  <p><strong>Date:</strong> {evt.eventDate}</p>
                  <p><strong>Description:</strong> {evt.description}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center' }}>No calendar events found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyCalendar;
