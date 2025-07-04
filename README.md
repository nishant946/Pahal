# Pahal School Management System

## Overview
Pahal is a comprehensive full-stack school management system designed to streamline the management of students, teachers, attendance, and homework for educational institutions. It features robust authentication, real-time dashboards, role-based access, and advanced analytics for both teachers and administrators.

---

## Features

### Authentication & Roles
- **Teacher Registration & Login**
  - Teachers can register with name, email, department, mobile, roll number, password, preferred days, and subject choices.
  - Email and mobile validation, password strength enforcement.
  - Teachers require admin verification before login.
- **Admin Registration & Login**
  - Admins can be created via script and have access to all management features.
- **Role-Based Redirection**
  - After login, users are redirected to dashboards based on their role (admin/teacher).

### Teacher Management
- Add, update, delete, and list teachers.
- Store and manage teacher preferred days and subject choices.
- Admin verification for new teachers.

### Student Management
- Add, update, delete, and list students.
- Search students by name, roll number, grade, or group.
- Download student list as CSV.

### Attendance Management
- **Student Attendance**
  - Mark, unmark, and update attendance for students.
  - View attendance history, daily/weekly/monthly stats, and download reports.
- **Teacher Attendance**
  - Mark and unmark teacher attendance.
  - View teacher attendance stats and history.
- **Real-Time Updates**
  - Dashboards and stats update instantly after attendance actions.

### Homework Management
- Add, update, delete, and list homework assignments.
- Assign homework to students or groups.

### UI/UX
- Responsive, modern UI with dialogs for add/edit/delete.
- Multi-select and comma-separated input for preferred days and subject choices.
- Robust error handling and user feedback.

### Advanced (Optional/Planned)
- Analytics and reporting for attendance and homework.
- Notification system for reminders and updates.

---

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **State Management:** React Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token)
- **API Client:** Axios

---

## Folder Structure

```
pahal.docx
client/
  components.json
  eslint.config.js
  index.html
  package.json
  postcss.config.js
  README.md
  tailwind.config.js
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  public/
    vite.svg
  src/
    App.css
    App.tsx
    index.css
    main.tsx
    vite-env.d.ts
    assets/
      react.svg
    components/
      admin/
      auth/
      card/
      homework/
      layout/
      navbar/
      sidebar/
      ui/
    contexts/
      attendanceContext.tsx
      authContext.tsx
      homeworkContext.tsx
      teacherAuthContext.tsx
      themeContext.tsx
    hooks/
    lib/
      utils.ts
    pages/
      admin/
      attendance/
      attendance.tsx/
      auth/
      contributors/
      dashboard/
      gallery/
      homework/
      landing/
      quiz/
      settings/
      student/
      syllabus/
      teacher/
    services/
      adminService.ts
      api.ts
      authServices.ts
      teacherAuthService.ts
      teacherProfileService.ts
    utils/

server/
  index.js
  package.json
  config/
    db.js
    temp_admin.js
  controllers/
    attendanceController.js
    authController.js
    studentController.js
    teacherController.js
  middlewares/
    auth.middleware.js
  models/
    attendanceModel.js
    studentModel.js
    teacher.model.js
    userModel.js
  routes/
    index.js
    v1/
      admin.js
      attendanceRoutes.js
      auth.js
      authRoutes.js
      index.js
      studentRoutes.js
      teacher.js
  scripts/
    createAdmin.js
  utils/
    storage.js
    validation.js
```

---

## Key Files & Directories
- **client/src/pages/auth/register.tsx**: Teacher registration form with preferred days and subject choices.
- **client/src/contexts/teacherAuthContext.tsx**: Teacher authentication logic and context.
- **client/src/contexts/attendanceContext.tsx**: Handles all student, teacher, and attendance state and API logic.
- **client/src/services/api.ts**: Axios instance and all API functions.
- **client/src/pages/student/studentlist.tsx**: Student list page with add/edit/delete dialogs.
- **server/controllers/studentController.js**: Student CRUD logic for backend.
- **server/controllers/teacherController.js**: Teacher CRUD and registration logic.
- **server/controllers/attendanceController.js**: Attendance logic for students and teachers.
- **server/routes/v1/studentRoutes.js**: Student API endpoints.
- **server/routes/v1/teacher.js**: Teacher API endpoints.
- **server/routes/v1/attendanceRoutes.js**: Attendance API endpoints.
- **server/models/studentModel.js**: Mongoose schema for students.
- **server/models/teacher.model.js**: Mongoose schema for teachers (with preferredDays, subjectChoices).
- **server/models/attendanceModel.js**: Mongoose schema for attendance.

---

## How It Works
- **Authentication:**
  - Teachers register with all required details, including preferred days and subject choices.
  - Admins verify new teachers before they can log in.
  - JWT is used for secure API access.
- **Role-Based Access:**
  - Admins and teachers see different dashboards and have different permissions.
- **Student & Teacher CRUD:**
  - Add, edit, and delete students/teachers. All changes are synced with the backend database.
- **Attendance:**
  - Mark/unmark attendance for students and teachers. Attendance is tracked per day and stored in history.
  - Real-time dashboard and stats update after attendance actions.
- **Homework:**
  - Assign, update, and delete homework for students.
- **UI:**
  - All actions (add/edit/delete) use dialogs for a smooth user experience. State is managed via React Context.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repo-url>
cd Pahal
```

### 2. Install Dependencies
- **Frontend:**
  ```bash
  cd client
  npm install
  ```
- **Backend:**
  ```bash
  cd server
  npm install
  ```

### 3. Configure Environment
- Set up MongoDB and update connection string in `server/config/db.js`.
- (Optional) Set environment variables for JWT secret, etc.

### 4. Run the App
- **Backend:**
  ```bash
  cd server
  npm start
  ```
- **Frontend:**
  ```bash
  cd client
  npm run dev
  ```

---

## API Endpoints (Sample)
- `POST   /api/v1/teacher/register`         — Register a new teacher (with preferred days, subject choices)
- `POST   /api/v1/teacher/login`            — Teacher login
- `POST   /api/v1/admin/login`              — Admin login
- `POST   /api/v1/student/add`              — Add a new student
- `GET    /api/v1/student/all`              — Get all students
- `PUT    /api/v1/student/:id`              — Update a student
- `DELETE /api/v1/student/:id`              — Delete a student
- `POST   /api/v1/attendance/mark`          — Mark student attendance
- `POST   /api/v1/attendance/unmark`        — Unmark student attendance
- `GET    /api/v1/attendance/stats`         — Get attendance stats
- `POST   /api/v1/teacher-attendance/mark`  — Mark teacher attendance
- `POST   /api/v1/teacher-attendance/unmark`— Unmark teacher attendance
- `GET    /api/v1/teacher-attendance/stats` — Get teacher attendance stats
- `POST   /api/v1/homework/add`             — Add homework
- `GET    /api/v1/homework/all`             — List homework

---

## Usage Tips
- **Teacher Registration:**
  - Enter preferred days and subject choices as comma-separated values (e.g., "Monday, Wednesday", "Mathematics, Physics").
- **Admin Creation:**
  - Use the provided script in `server/scripts/createAdmin.js` to create an admin user.
- **Attendance Reports:**
  - Download attendance and student lists as CSV from the dashboard.
- **Real-Time Updates:**
  - All dashboards and stats update automatically after marking attendance or making changes.

---

## Contribution
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)
