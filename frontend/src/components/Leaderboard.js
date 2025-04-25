import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import backgroundImage from '../assets/n2.jpeg'; // Background image

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/leaderboard');
        const data = await response.json();
        if (response.ok) {
          setLeaderboard(data.leaderboard);
        } else {
          setError(data.error || 'Failed to load leaderboard');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Something went wrong');
      }
    };

    fetchLeaderboard();
  }, []);

  const groupByEvent = leaderboard.reduce((acc, entry) => {
    const key = entry[3] ? entry[3].trim() : 'Not available';
    if (!acc[key]) {
      acc[key] = { event_name: key, entries: [] };
    }
    acc[key].entries.push(entry);
    return acc;
  }, {});

  const groupedArray = Object.values(groupByEvent).sort((a, b) =>
    a.event_name.localeCompare(b.event_name)
  );

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
           // backgroundColor: 'blue',
        
            //border: '2px solid blue',
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          Leaderboard
        </h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {groupedArray.length > 0 ? (
          groupedArray.map((group, index) => (
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
                    {group.entries.map((entry, idx) => (
                      <tr key={idx}>
                        <td>{entry[0]}</td>
                        <td>{entry[1]}</td>
                        <td>{entry[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
