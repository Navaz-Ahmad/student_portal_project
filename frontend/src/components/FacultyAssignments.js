import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from '../assets/n2.jpeg'; // Background image

const FacultyAssignments = ({ user, setUser }) => {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  // Form fields for assignment upload
  const [assignmentId, setAssignmentId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  // For viewing submissions
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.subject || !user?.id) {
      setError("Faculty subject or ID is not defined.");
      return;
    }
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/facultyAssignments?subject=${encodeURIComponent(user.subject)}&facultyId=${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setAssignments(data.assignments || []);
        } else {
          setError(data.error || "Failed to load assignments.");
        }
      } catch (err) {
        setError("Something went wrong while fetching assignments.");
      }
    };
    fetchAssignments();
  }, [user]);

  const handleUploadAssignment = async (e) => {
    e.preventDefault();
    setUploadMessage("");
    if (!assignmentId || !title || !description || !dueDate) {
      setUploadMessage("Please fill in all required fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/facultyAssignments/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId,
          title,
          description,
          dueDate,
          subject: user.subject,
          facultyId: user.id
        })
      });
      const data = await response.json();
      if (response.ok) {
        setUploadMessage("Assignment uploaded successfully.");
        setAssignmentId("");
        setTitle("");
        setDescription("");
        setDueDate("");
        // Refresh assignments list
        const resp = await fetch(`http://localhost:3001/api/facultyAssignments?subject=${encodeURIComponent(user.subject)}&facultyId=${user.id}`);
        const data2 = await resp.json();
        if (resp.ok) {
          setAssignments(data2.assignments || []);
        }
      } else {
        setUploadMessage(data.error || "Failed to upload assignment.");
      }
    } catch (err) {
      setUploadMessage("Something went wrong while uploading assignment.");
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/facultyAssignments/submissions?assignmentId=${assignmentId}`);
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "8px",
          padding: "20px",
          marginLeft: "10%",
          maxWidth: "1000px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            backgroundColor: "blue",
            color: "white",
            border: "2px solid blue",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          Faculty Assignments
        </h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {/* Assignment Upload Form */}
        <div className="mb-5">
          <h3>Upload New Assignment for {user.subject}</h3>
          <form onSubmit={handleUploadAssignment}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Assignment ID"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
            <input
              type="date"
              className="form-control mb-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Upload Assignment</button>
          </form>
          {uploadMessage && <p style={{ color: uploadMessage.startsWith("Assignment uploaded") ? "green" : "red", textAlign: "center" }}>{uploadMessage}</p>}
        </div>

        {/* Assignment List */}
        <div>
          <h3>Existing Assignments for {user.subject}</h3>
          {assignments.length > 0 ? (
            assignments.map((assgn) => (
              <div
                key={assgn.assignmentId}
                style={{
                  border: "2px solid #333",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h4>{assgn.title} (ID: {assgn.assignmentId})</h4>
                <p>{assgn.description}</p>
                <p><strong>Due Date:</strong> {assgn.dueDate}</p>
                <p><strong>Subject:</strong> {assgn.subject}</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setSelectedAssignment(assgn.assignmentId); fetchSubmissions(assgn.assignmentId); }}
                >
                  View Submissions
                </button>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No assignments found for your subject.</p>
          )}
        </div>

        {/* Submission List */}
        {selectedAssignment && (
          <div>
            <h3>Submissions for Assignment {selectedAssignment}</h3>
            {submissions.length > 0 ? (
              submissions.map(sub => (
                <div
                  key={sub.submissionId}
                  style={{
                    border: "2px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                    backgroundColor: "#e6f7ff",
                  }}
                >
                  <p><strong>Student ID:</strong> {sub.studentId}</p>
                  <p><strong>Submitted At:</strong> {sub.submittedAt}</p>
                  <a
                    href={`http://localhost:3001/${sub.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", fontWeight: "bold" }}
                  >
                    Download Submission
                  </a>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>No submissions for this assignment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAssignments;
