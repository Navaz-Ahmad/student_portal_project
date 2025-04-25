import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import backgroundImage from "../assets/n2.jpeg"; // Background image

const Attendance = ({ studentId, user, setUser }) => {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceEntries, setAttendanceEntries] = useState({});
  const [uploadMessage, setUploadMessage] = useState('');
  const [attendanceView, setAttendanceView] = useState('daily');
  const [subjectFilter, setSubjectFilter] = useState('');
  const navigate = useNavigate();

  const getLocalDateString = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().split('T')[0];
  };

  useEffect(() => {
    setError('');
    const fetchAttendance = async () => {
      try {
        let url = '';
        if (user?.role === 'faculty') {
          if (!user.subject) {
            setError('Faculty subject is not defined');
            return;
          }
          url = `http://localhost:3001/api/attendance?subject=${user.subject}`;
        } else {
          if (!studentId) {
            setError('No student ID provided');
            return;
          }
          url = `http://localhost:3001/api/attendance?studentId=${studentId}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setAttendance(data.attendance || []);
        } else {
          setError(data.error || 'Failed to load attendance');
        }
      } catch (err) {
        setError('Something went wrong while fetching attendance');
      }
    };
    fetchAttendance();
  }, [studentId, user]);

  useEffect(() => {
    const formattedDate = getLocalDateString(selectedDate);
    if (attendance.length > 0) {
      const filtered = attendance.filter((rec) => rec.ATTENDANCE_DATE === formattedDate);
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([]);
    }
  }, [attendance, selectedDate]);

  const onDateChange = (date) => {
    setSelectedDate(date);
  };

  const totalClasses = attendance.length;
  const presentCount = attendance.filter((rec) => rec.STATUS === 'Present').length;
  const overallPercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(2) : 0;

  const subjectStats = attendance.reduce((acc, rec) => {
    const subject = rec.SUBJECT;
    if (!acc[subject]) {
      acc[subject] = { total: 0, present: 0 };
    }
    acc[subject].total += 1;
    if (rec.STATUS === 'Present') {
      acc[subject].present += 1;
    }
    return acc;
  }, {});

  useEffect(() => {
    if (user?.role === 'faculty' && user.subject) {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/students?subject=${user.subject}`);
          const data = await response.json();
          if (response.ok) {
            setStudents(data.students || []);
          } else {
            console.error(data.error || 'Failed to fetch students');
          }
        } catch (err) {
          console.error('Error fetching students:', err);
        }
      };
      fetchStudents();
    }
  }, [user]);

  const handleStatusChange = (stuId, event) => {
    const status = event.target.value;
    setAttendanceEntries((prev) => ({ ...prev, [stuId]: status }));
  };

  const handleUploadAttendance = async () => {
    const records = students
      .filter((student) => attendanceEntries[student.id])
      .map((student) => ({
        studentId: student.id,
        status: attendanceEntries[student.id],
      }));

    if (records.length === 0) {
      alert('Please mark attendance for at least one student.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/attendance/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: user.subject,
          date: getLocalDateString(selectedDate),
          records: records,
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

  const formattedSelectedDate = getLocalDateString(selectedDate);
  const cumulativeRecords = attendance.filter((rec) => rec.ATTENDANCE_DATE <= formattedSelectedDate);
  const cumulativeTotal = cumulativeRecords.length;
  const cumulativePresent = cumulativeRecords.filter((rec) => rec.STATUS === 'Present').length;
  const cumulativePercentage = cumulativeTotal > 0 ? ((cumulativePresent / cumulativeTotal) * 100).toFixed(2) : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        //backgroundRepeat: 'no-repeat',
        //backgroundSize: 'cover',
        padding: '20px'
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          minHeight:'750px',
          margin: '0 auto',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
           // Ensures all direct child elements, including the heading, are centered

          marginLeft: '10%'
        }}
      >
        
        <h2 style={{
  textAlign: 'center',
  marginBottom: '40px',
  backgroundColor: 'blue', 
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  //display: 'inline-block',
  border: '1px solid #0056b3'
}}>
  Attendance Calendar
</h2>


        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '100px', justifyContent: 'center' }}>
          <div style={{  maxWidth: '350px' }}>
            <p><strong>Total Classes:</strong> {totalClasses}</p>
            <p><strong>Classes Attended:</strong> {presentCount}</p>
            <p><strong>Overall Attendance Percentage:</strong> {overallPercentage}%</p>

            <CalendarComponent onChange={onDateChange} value={selectedDate} />

            <div style={{ textAlign: 'center' }}>
              <h3>Attendance on {getLocalDateString(selectedDate)}</h3>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec, idx) => (
                  <div key={idx} style={{ border: '1px solid #ddd', margin: '10px auto', padding: '10px' }}>
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
          <div>
  <h4 style={{ textAlign: 'center' }}>Per-Subject Attendance Breakdown</h4>
  <div style={{ textAlign: 'center', marginTop: '20px',marginBottom: '20px'  }}>
    <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
      <option value="">--Select Subject--</option>
      {Object.keys(subjectStats).map((subject) => (
        <option key={subject} value={subject}>{subject}</option>
      ))}
    </select>
  </div>
  {subjectFilter && subjectStats[subjectFilter] ? (
    <div>
      <p><strong>Subject:</strong> {subjectFilter}</p>
      <p><strong>Total Classes:</strong> {subjectStats[subjectFilter].total}</p>
      <p><strong>Classes Attended:</strong> {subjectStats[subjectFilter].present}</p>
      <p>
        <strong>Attendance Percentage:</strong>{' '}
        {((subjectStats[subjectFilter].present / subjectStats[subjectFilter].total) * 100).toFixed(2)}%
      </p>
    </div>
  ) : (
    <p style={{ textAlign: 'center', marginTop: '10px' }}>Please select a subject.</p>
  )}
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
