import React, { useEffect, useState } from 'react';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/n2.jpeg'; // Background image

const Calendar = ({ user, setUser }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterOption, setFilterOption] = useState('on');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/calendar');
        const data = await response.json();
        console.log("Calendar API response:", data);
        if (response.ok && Array.isArray(data.events)) {
          const transformedEvents = data.events.map(row => ({
            EVENT_ID: row[0],
            TITLE: row[1],
            EVENT_DATE: row[2],
            DESCRIPTION: row[3]
          }));
          setEvents(transformedEvents);
        } else {
          setError(data.error || 'Failed to load events');
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError('Something went wrong while fetching events');
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0 && selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      let filtered = [];
      if (filterOption === 'on') {
        filtered = events.filter(evt => evt.EVENT_DATE === formattedDate);
      } else if (filterOption === 'before') {
        filtered = events.filter(evt => evt.EVENT_DATE <= formattedDate);
      } else if (filterOption === 'after') {
        filtered = events.filter(evt => evt.EVENT_DATE >= formattedDate);
      }
      console.log("Filtered events for", formattedDate, "with filter option", filterOption, ":", filtered);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents([]);
    }
  }, [events, selectedDate, filterOption]);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const onFilterInputChange = (e) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  return (
    <div 
      className="container-fluid"
      style={{ 
        minHeight: '100vh', 
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Profile Icon at Top Right */}
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

      {/* Main Content */}
      <main 
        role="main"
        className="px-4"
        style={{ 
          //paddingTop: '20px',
          width: '90%',
          maxWidth: '1000px',
          minHeight:'750',
          //marginLeft: '5%',  // Added for proper alignment
          //marginRight: 'auto', // Centers the main content

          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          borderRadius: '15px',
         // border: '3px solid black',
          padding: '20px',
          boxShadow: '5px 5px 10px rgba(0,0,0,0.2)'
        }}
      >
        {/* Calendar Heading with Border and Background */}
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
  <h2 style={{ margin: 0 }}>Calendar Events</h2>
</div>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Filter Options */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <label htmlFor="dateFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
            Filter by Date:
          </label>
          <input
            id="dateFilter"
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={onFilterInputChange}
            style={{ marginRight: '20px' }}
          />
          <label htmlFor="filterOption" style={{ marginRight: '10px', fontWeight: 'bold' }}>
            Option:
          </label>
          <select
            id="filterOption"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="on">On Selected Date</option>
            <option value="before">Before or On Selected Date</option>
            <option value="after">After or On Selected Date</option>
          </select>
        </div>

        {/* Centered Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',border:'red' }}>
          <div style={{ marginBottom: '20px' }}>
            <CalendarComponent
              onChange={onDateChange}
              value={selectedDate}
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const formattedDate = date.toISOString().split('T')[0];
                  const hasEvent = events.some(evt => evt.EVENT_DATE === formattedDate);
                  return hasEvent ? (
                    <div style={{ textAlign: 'center', color: 'blue', marginTop: '2px' }}>•</div>
                  ) : null;
                }
                return null;
              }}
            />
          </div>

          {/* Events Display */}
          <div style={{ width: '100%' }}>
            <h3 style={{ textAlign: 'center' }}>
              Events on {selectedDate.toISOString().split('T')[0]}
            </h3>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((evt, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    border: '3px solid black',
                    borderRadius: '10px', 
                    marginBottom: '20px', 
                    padding: '15px',
                    backgroundColor: 'rgba(255, 255, 224, 0.9)',
                    boxShadow: '3px 3px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  <h4>{evt.TITLE}</h4>
                  <p><strong>Date:</strong> {evt.EVENT_DATE}</p>
                  <p><strong>Description:</strong> {evt.DESCRIPTION}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center' }}>No events on this date.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calendar;
