// frontend/src/components/Assignments.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/n2.jpeg'; // New background image

const Assignments = ({ user, setUser }) => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/assignments');
        const data = await response.json();

        if (response.ok && data.assignments && Array.isArray(data.assignments)) {
          const extractedAssignments = data.assignments.map(row => ({
            ASSIGNMENT_ID: row[0],
            TITLE: row[1],
            DESCRIPTION: row[2],
            DUE_DATE: row[3],
            SUBJECT: row[4]
          }));

          setAssignments(extractedAssignments);
        } else {
          setError(data.error || 'Failed to load assignments');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Something went wrong while fetching assignments');
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    if (user?.id) {
      const fetchSubmissions = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/assignments/submissions?studentId=${user.id}`);
          const data = await response.json();
          if (response.ok && data.submissions) {
            setSubmissions(data.submissions);
          } else {
            console.error('Error fetching submissions:', data.error);
          }
        } catch (err) {
          console.error('Error fetching submissions:', err);
        }
      };
      fetchSubmissions();
    }
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');

    if (!selectedAssignment) {
      setUploadError('Please select an assignment.');
      return;
    }
    if (!file) {
      setUploadError('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('assignmentFile', file);
    formData.append('studentId', user?.id || 'unknown');
    formData.append('assignmentId', selectedAssignment);

    try {
      const response = await fetch('http://localhost:3001/api/assignments/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setUploadSuccess(data.message);
        setFile(null);
        setSelectedAssignment('');
        if (user?.id) {
          const res = await fetch(`http://localhost:3001/api/assignments/submissions?studentId=${user.id}`);
          const subData = await res.json();
          if (res.ok && subData.submissions) {
            setSubmissions(subData.submissions);
          }
        }
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Something went wrong during upload.');
    }
  };

  const filteredAssignments = assignments.filter(assgn => {
    const now = new Date();
    const dueDate = new Date(assgn.DUE_DATE);

    if (filterDueDate === 'upcoming' && dueDate < now) return false;
    if (filterDueDate === 'past' && dueDate >= now) return false;
    if (filterSubject !== 'all' && assgn.SUBJECT !== filterSubject) return false;

    return true;
  });

  const uniqueSubjects = [...new Set(assignments.map(assgn => assgn.SUBJECT))];

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        // Uncomment the following lines if you want the image to cover the full background
        //backgroundRepeat: 'no-repeat',
        //backgroundSize: 'cover',
        //minHeight: '100vh',
        //position: 'relative',
        padding: '20px'
      }}
    >
      {/* Content box that prevents background from covering main content */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          padding: '20px',
          marginLeft: '10%',
          maxWidth:'1000px' // You can adjust this value as needed
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            backgroundColor: 'blue',
            color: 'white',
            border: '2px solid blue',
            borderRadius: '8px',
            padding: '10px'
          }}
        >
          Assignments
        </h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div className="d-flex justify-content-center gap-3 mb-4">
          <select className="form-select w-25" value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)}>
            <option value="all">All Due Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <select className="form-select w-25" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="all">All Subjects</option>
            {uniqueSubjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
          </select>
        </div>

        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assgn, idx) => {
            const submission = submissions.find(s =>
              String(s.ASSIGNMENT_ID).trim() === String(assgn.ASSIGNMENT_ID).trim()
            );
            return (
              <div key={assgn.ASSIGNMENT_ID || idx} style={{ border: '2px solid #333', borderRadius: '8px', marginBottom: '20px', padding: '15px' }}>
                <h3>{assgn.TITLE}</h3>
                <p>{assgn.DESCRIPTION}</p>
                <p><strong>Due:</strong> {assgn.DUE_DATE}</p>
                <p><strong>Subject:</strong> {assgn.SUBJECT}</p>
                <p><strong>Status:</strong> {submission ? "Submitted" : "Not Submitted"}</p>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center' }}>No assignments available.</p>
        )}

        <div className="upload-section mt-4">
          <h3>Upload Assignment Submission</h3>
          <form onSubmit={handleUpload}>
            <select value={selectedAssignment} onChange={(e) => setSelectedAssignment(e.target.value)} className="form-select mb-3">
              <option value="">-- Select an assignment --</option>
              {assignments.map(assgn => (
                <option key={assgn.ASSIGNMENT_ID} value={assgn.ASSIGNMENT_ID}>
                  {assgn.TITLE}
                </option>
              ))}
            </select>
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary">Upload</button>
          </form>
          {uploadError && <p style={{ color: 'red', textAlign: 'center' }}>{uploadError}</p>}
          {uploadSuccess && <p style={{ color: 'green', textAlign: 'center' }}>{uploadSuccess}</p>}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
