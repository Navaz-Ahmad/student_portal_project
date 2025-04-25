import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/n2.jpeg'; // Background image

const StudyMaterials = ({ user, setUser }) => {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/materials');
        const data = await response.json();
        if (response.ok && Array.isArray(data.materials)) {
          setMaterials(data.materials);
        } else {
          setError(data.error || 'Failed to load materials');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Something went wrong while fetching materials');
      }
    };

    fetchMaterials();
  }, []);

  const uniqueSubjects = Array.from(new Set(materials.map(mat => mat.SUBJECT || mat[2])));
  const filteredMaterials = selectedSubject
    ? materials.filter(mat => (mat.SUBJECT || mat[2]) === selectedSubject)
    : materials;

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
        <h2
          style={{
            textAlign: 'center',
            backgroundColor: 'blue',
            color: 'white',
            border: '2px solid blue',
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          Study Materials
        </h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Filter by Subject */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <label htmlFor="subject-filter" style={{ marginRight: '10px' }}>Filter by Subject:</label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((mat, idx) => (
            <div
              key={mat.MATERIAL_ID || idx}
              style={{
                border: '2px solid #333',
                borderRadius: '8px',
                marginBottom: '20px',
                padding: '15px',
                textAlign: 'left',
              }}
            >
              <h3>{mat.TITLE || mat[1]}</h3>
              <p><strong>Subject:</strong> {mat.SUBJECT || mat[2]}</p>
              <p><strong>Uploaded on:</strong> {mat.UPLOAD_DATE || mat[4]}</p>
              <a href={mat.URL || mat[3]}>
                View Material
              </a>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No study materials available.</p>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
