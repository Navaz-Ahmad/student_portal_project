
# student_portal_project


```markdow
# 🎓 Student Portal

A comprehensive, full-stack web application to streamline academic interactions between students and faculty through features like authentication, assignment management, attendance tracking, event calendars, and resource access.  

---

## 📜 Abstract

The Student Portal project is an all-in-one solution for educational institutions, providing:  
- **Student & Faculty Authentication**  
- **Assignment Submission & Review**  
- **Attendance Tracking & Management**  
- **Interactive Event Calendar**  
- **Access to Academic Materials**  

Built with modern web technologies to digitize and automate traditionally time-consuming, error-prone academic workflows, reducing administrative overhead and enhancing collaboration. 

---

## 🚀 Tech Stack

- **Frontend**  
  - React.js (with React Router)  
  - Bootstrap for responsive UI  
  - Glassmorphic design & animated particle effects via `react-tsparticles`  
- **Backend**  
  - Node.js & Express.js  
  - Session-based authentication (via `express-session`)  
  - OracleDB (via `oracledb`)  
- **Data**  
  - Oracle SQL for students, faculty, assignments, attendance, materials, calendar, leaderboard  
- **Misc**  
  - CORS & Body-Parser  
  - Environment variables via `dotenv`

---

## 📂 Project Structure


student-portal/
├── backend/
│   ├── db.js                     # OracleDB connection & query executor
│   ├── server.js                 # Express app setup & route mounting
│   └── routes/
│       ├── auth.js               # Signup, login, forgot/reset password
│       ├── assignments.js
│       ├── attendance.js
│       ├── calendar.js
│       ├── leaderboard.js
│       ├── materials.js
│       └── ... (faculty/student variations)
├── frontend/
│   ├── src/
│   │   ├── assets/               # Images, backgrounds
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/
│   │   │   ├── RoleSelection.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ... (Attendance, Assignments, Materials, Calendar, Leaderboard)
│   │   ├── Layout.jsx            # MainLayout & Faculty Layout
│   │   ├── App.jsx               # Router setup
│   │   └── index.js
│   └── public/
│       └── index.html
├── .env                          # SESSION_SECRET, DB credentials
├── package.json                  # Scripts & dependencies
└── README.md


---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/student-portal.git
cd student-portal
```

### 2. Backend

1. **Install dependencies**  
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment**  
   Create a `.env` in `/backend`:
   ```dotenv
   SESSION_SECRET=yourSecretKey
   DB_USER=system
   DB_PASSWORD=root
   DB_CONNECT_STRING=localhost:1521/XE
   ```
3. **Start server**  
   ```bash
   node server.js
   ```
   > Backend API runs on `http://localhost:3001` 

### 3. Frontend

1. **Install dependencies**  
   ```bash
   cd ../frontend
   npm install
   ```
2. **Start React app**  
   ```bash
   npm start
   ```
   > Frontend runs on `http://localhost:3000` and communicates with the backend via CORS 

---

## 🔑 Environment Variables

| Name               | Description                      |
|--------------------|----------------------------------|
| `SESSION_SECRET`   | Secret key for Express sessions  |
| `DB_USER`          | OracleDB username                |
| `DB_PASSWORD`      | OracleDB password                |
| `DB_CONNECT_STRING`| OracleDB connect descriptor      |

---

## 🔗 API Endpoints (excerpt)

- **Auth**  
  - `POST /api/auth/signup`  
  - `POST /api/auth/login/student`  
  - `POST /api/auth/login/faculty`  
  - `POST /api/auth/forgot-password`  
  - `POST /api/auth/reset-password`  
- **Assignments**  
  - `GET /api/assignments`  
  - `POST /api/assignments`  
  - `PUT /api/assignments/:id`  
- **Attendance**  
  - `GET /api/attendance`  
  - `POST /api/attendance`  
- **Materials**  
  - `GET /api/materials`  
  - `POST /api/materials`  
- **Calendar**  
  - `GET /api/calendar`  
  - `POST /api/calendar`  
- **Leaderboard**  
  - `GET /api/leaderboard`  
  - `POST /api/leaderboard`  

(See each route file for full details.) 

---

## 🖥️ Application Modules

1. **Role Selection**  
   - Clean UI with glassmorphic cards for “Student” and “Faculty”  
   - Uses `react-tsparticles` for animated background particles 

2. **Signup**  
   - Student registers with ID, name, email, password, year, branch  
   - POSTs to `/api/auth/signup` and on success redirects to login 

3. **Login**  
   - Role-based via URL (`/login/student`, `/login/faculty`)  
   - Credential check, session creation, then redirect to proper dashboard 

4. **Forgot / Reset Password**  
   - Step 1: submit email to `/api/auth/forgot-password` → fetch security questions  
   - Step 2: answer questions + new password → `/api/auth/reset-password` 

5. **Dashboard & Layouts**  
   - Sidebar navigation (Profile, Attendance, Assignments, Materials, Calendar, Leaderboard, Logout)  
   - Dynamic content rendering with `<Outlet />` (React Router v6) 

6. **Profile**  
   - View & edit personal details (name, email, branch/department, DOB, contact, etc.)  
   - Modular sub-components for Academics, Achievements, Extracurriculars 

7. **Core Features**  
   - **Attendance**: Students view; faculty mark/manage  
   - **Assignments**: Upload/submission & review workflows  
   - **Materials**: Faculty upload; students download  
   - **Calendar**: View & update institutional events  
   - **Leaderboard**: Points & ranking system  

---

## 🚢 Deployment

1. **Backend**: host on any Node.js-capable server, ensure OracleDB connectivity.  
2. **Frontend**: build with `npm run build` and serve via Nginx/Apache or static hosting.  
3. **Environment**: update `.env` for production credentials and session security.  

---

## 🤝 Contributing

1. Fork it  
2. Create a feature branch: `git checkout -b feature/x`  
3. Commit your changes: `git commit -m "Add feature"`  
4. Push to branch: `git push origin feature/x`  
5. Open a Pull Request  

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.  

---
