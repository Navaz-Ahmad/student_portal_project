import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import backgroundImage from "../assets/n2.jpeg"; // Background image

const FacultyAttendance = ({ user, setUser }) => {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [students, setStudents] = useState([]); // List of students for the faculty's subject
  const [attendanceEntries, setAttendanceEntries] = useState({}); // Faculty input per student
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate = useNavigate();

  const getLocalISODate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  };

  useEffect(() => {
    setError('');
    if (!user?.subject) {
      setError('Faculty subject is not defined.');
      return;
    }
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/facultyAttendance?subject=${encodeURIComponent(user.subject)}`);
        const data = await response.json();
        if (response.ok) {
          setAttendance(data.attendance || []);
        } else {
          setError(data.error || 'Failed to load attendance.');
        }
      } catch (err) {
        setError('Something went wrong while fetching attendance.');
      }
    };
    fetchAttendance();
  }, [user]);

  useEffect(() => {
    const formattedDate = getLocalISODate(selectedDate);
    if (attendance.length > 0) {
      const filtered = attendance.filter(rec => rec.ATTENDANCE_DATE === formattedDate);
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([]);
    }
  }, [attendance, selectedDate]);

  useEffect(() => {
    if (user?.subject) {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/students?subject=${encodeURIComponent(user.subject)}`);
          const data = await response.json();
          if (response.ok) {
            setStudents(data.students || []);
          }
        } catch (err) {
          console.error('Error fetching students:', err);
        }
      };
      fetchStudents();
    }
  }, [user]);

  const handleStatusChange = (studentId, event) => {
    const status = event.target.value;
    setAttendanceEntries(prev => ({ ...prev, [studentId]: status }));
  };

  const handleUploadAttendance = async () => {
    const records = students
      .filter(student => attendanceEntries[student.id])
      .map(student => ({
        studentId: student.id,
        status: attendanceEntries[student.id],
      }));

    if (records.length === 0) {
      alert("Please mark attendance for at least one student.");
      return;
    }

    const localDate = getLocalISODate(selectedDate);
    try {
      const response = await fetch('http://localhost:3001/api/facultyAttendance/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: user.subject,
          date: localDate,
          records,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUploadMessage('Attendance uploaded successfully.');
      } else {
        setUploadMessage(data.error || 'Failed to upload attendance.');
      }
    } catch (err) {
      setUploadMessage('Something went wrong while uploading attendance.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          minHeight: '750px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          marginLeft: '10%',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #0056b3',
          }}
        >
          Faculty Attendance Calendar
        </h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '100px', justifyContent: 'center' }}>
          <div style={{ maxWidth: '350px' }}>
            <p><strong>Total Classes:</strong> {attendance.length}</p>
            <p>
              <strong>Classes Attended:</strong> {attendance.filter(rec => rec.STATUS === 'Present').length}
            </p>
            <p>
              <strong>Overall Attendance Percentage:</strong>{' '}
              {attendance.length > 0
                ? ((attendance.filter(rec => rec.STATUS === 'Present').length / attendance.length) * 100).toFixed(2)
                : 0}%
            </p>

            <CalendarComponent onChange={setSelectedDate} value={selectedDate} />

            <div style={{ textAlign: 'center' }}>
              <h3>Attendance on {getLocalISODate(selectedDate)}</h3>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec, idx) => (
                  <div key={idx} style={{ border: '1px solid #ddd', margin: '10px auto', padding: '10px' }}>
                    <p><strong>Student ID:</strong> {rec.STUDENT_ID}</p>
                    <p><strong>Subject:</strong> {rec.SUBJECT}</p>
                    <p><strong>Status:</strong> {rec.STATUS}</p>
                  </div>
                ))
              ) : (
                <p>No attendance recorded</p>
              )}
            </div>
          </div>

          <div style={{ flex: '1 1 250px', maxWidth: '400px' }}>
            <h3>Upload Attendance for {user.subject}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>Student ID</th>
                  <th style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>Name</th>
                  <th style={{ padding: '10px', backgroundColor: '#f0f0f0' }}>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>
                        <select
                          value={attendanceEntries[student.id] || ''}
                          onChange={e => handleStatusChange(student.id, e)}
                        >
                          <option value="">Select</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No students found for this subject.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button style={{ marginTop: '20px' }} onClick={handleUploadAttendance}>
              Submit Attendance
            </button>
            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;
