import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RoleSelection from "./components/RoleSelection";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Attendance from "./components/Attendance";
import Assignments from "./components/Assignments";
import StudyMaterials from "./components/StudyMaterials";
import Calendar from "./components/Calendar";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import ForgotPassword from "./components/ForgotPassword";
import FacultyDashboard from "./components/FacultyDashboard";
import FacultyAttendance from "./components/FacultyAttendance";
import FacultyAssignments from "./components/FacultyAssignments";
import FacultyMaterials from "./components/FacultyMaterials";
import FacultyCalendar from "./components/FacultyCalendar";
import FacultyLeaderboard from "./components/FacultyLeaderboard";
import MainLayout from "./components/MainLayout";
import FacultyLayout from "./components/FacultyMainLayout";
import "./app.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Checking authentication status...");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("User found in localStorage:", parsedUser);
      setUser(parsedUser);
      setLoading(false);
    } else {
      fetch("http://localhost:3001/api/auth/me", { credentials: "include" })
        .then((res) => {
          console.log("Auth Check Response Status:", res.status);
          if (!res.ok) throw new Error("User not authenticated");
          return res.json();
        })
        .then((data) => {
          if (data?.user) {
            console.log("User authenticated:", data.user);
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        })
        .catch((error) => {
          console.error("Auth Check Failed:", error);
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/student" element={<Login onLogin={setUser} />} />
      <Route path="/login/faculty" element={<Login onLogin={setUser} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      {user &&
        (user.role.trim().toLowerCase() === "student" ? (
          <Route element={<MainLayout user={user} handleLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
            <Route path="/attendance" element={<Attendance studentId={user.id} />} />
            <Route path="/materials" element={<StudyMaterials />} />
            <Route path="/assignments" element={<Assignments user={user} />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          </Route>
        ) : (
          <Route element={<FacultyLayout handleLogout={handleLogout} />}>
            <Route path="/facultyDashboard" element={<FacultyDashboard user={user} setUser={setUser} />} />
            <Route path="/facultyAttendance" element={<FacultyAttendance user={user} setUser={setUser} />} />
            <Route path="/facultyAssignments" element={<FacultyAssignments user={user} setUser={setUser} />} />
            <Route path="/facultymaterials" element={<FacultyMaterials user={user} setUser={setUser} />} />
            <Route path="/faculty-calendar" element={<FacultyCalendar user={user} setUser={setUser} />} />
            <Route path="/faculty-leaderboard" element={<FacultyLeaderboard user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          </Route>
        ))}

      {/* Fallback Route */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              user
                ? user.role.trim().toLowerCase() === "faculty"
                  ? "/facultyDashboard"
                  : "/dashboard"
                : "/"
            }
          />
        }
      />
    </Routes>
  );
}

export default App;
