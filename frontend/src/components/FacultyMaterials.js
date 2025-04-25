import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/n2.jpeg'; // Background image

const FacultyMaterials = ({ user, setUser }) => {
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Form fields for study material upload
  const [title, setTitle] = useState('');
  const [materialLink, setMaterialLink] = useState(''); // Link input
  
  const navigate = useNavigate();
  
  // Fetch study materials for the faculty's subject
  useEffect(() => {
    if (!user?.subject) {
      setError('Faculty subject is not defined.');
      return;
    }
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/facultyMaterials?subject=${encodeURIComponent(user.subject)}`);
        const data = await response.json();
        console.log("Fetched study materials:", data);
        if (response.ok) {
          setMaterials(data.materials || []);
        } else {
          setError(data.error || 'Failed to load study materials.');
        }
      } catch (err) {
        console.error("Error fetching study materials:", err);
        setError('Something went wrong while fetching study materials.');
      }
    };
    fetchMaterials();
  }, [user]);
  
  const handleMaterialLinkChange = (e) => {
    setMaterialLink(e.target.value);
  };
  
  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    setUploadMessage('');
    // Require title and material link
    if (!title || !materialLink) {
      setUploadMessage('Please provide a title and a material link.');
      return;
    }
    
    const payload = {
      title,
      subject: user.subject,
      uploadedBy: user.id,
      materialLink
    };
    
    try {
      const response = await fetch('http://localhost:3001/api/facultyMaterials/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      console.log("Study material upload response:", data);
      if (response.ok) {
        setUploadMessage('Study material uploaded successfully.');
        setTitle('');
        setMaterialLink('');
        // Refresh materials list
        const resp = await fetch(`http://localhost:3001/api/facultyMaterials?subject=${encodeURIComponent(user.subject)}`);
        const data2 = await resp.json();
        if (resp.ok) {
          setMaterials(data2.materials || []);
        }
      } else {
        setUploadMessage(data.error || 'Failed to upload study material.');
      }
    } catch (err) {
      console.error("Error uploading study material:", err);
      setUploadMessage('Something went wrong while uploading study material.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (typeof setUser === 'function') setUser(null);
    navigate('/');
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        padding: '20px',
        minHeight: '100vh'
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
          Faculty Study Materials
        </h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        {/* Upload Study Material Form */}
        <div className="mb-5" style={{ textAlign: 'center' }}>
          <h3>Upload New Study Material for {user.subject}</h3>
          <form onSubmit={handleUploadMaterial} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="form-group mb-2">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group mb-2">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Material Link" 
                value={materialLink} 
                onChange={handleMaterialLinkChange} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">Upload Study Material</button>
          </form>
          {uploadMessage && <p style={{ color: uploadMessage.startsWith('Study material uploaded') ? 'green' : 'red', textAlign: 'center' }}>{uploadMessage}</p>}
        </div>

        {/* Study Material List */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Existing Study Materials for {user.subject}</h3>
          {materials.length > 0 ? (
            materials.map(material => (
              <div
                key={material.materialId}
                style={{
                  border: '2px solid #333',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  padding: '15px',
                  textAlign: 'left',
                }}
              >
                <h4>{material.title}</h4>
                <p><strong>Subject:</strong> {material.subject}</p>
                <p><strong>Uploaded By:</strong> {material.uploadedBy}</p>
                <p><strong>Upload Date:</strong> {material.uploadDate}</p>
                {material.materialLink && (
                  <a href={material.materialLink} target="_blank" rel="noopener noreferrer" className="btn btn-info">
                    Open Link
                  </a>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No study materials found for your subject.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyMaterials;
