# Pahal School Management System

## Overview
Pahal is a full-stack school management system designed to help teachers and administrators manage students, teachers, and attendance efficiently. The system provides secure authentication, CRUD operations for students and teachers, and robust attendance tracking.

---

## Features
- **Teacher Authentication** (Login/Register)
- **Student Management**
  - Add, update, delete, and list students
- **Teacher Management**
  - Add, update, delete, and list teachers
- **Attendance Management**
  - Mark, unmark, and update attendance for students and teachers
  - View attendance history and statistics
- **Search and Filter**
  - Search students by name, roll number, grade, or group
- **Download Student List** as CSV
- **Responsive UI** with dialogs for add/edit/delete
- **Error Handling** and user feedback

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
- **client/src/contexts/attendanceContext.tsx**: Handles all student, teacher, and attendance state and API logic.
- **client/src/services/api.ts**: Axios instance and all API functions.
- **client/src/pages/student/studentlist.tsx**: Student list page with add/edit/delete dialogs.
- **server/controllers/studentController.js**: Student CRUD logic for backend.
- **server/routes/v1/studentRoutes.js**: Student API endpoints.
- **server/models/studentModel.js**: Mongoose schema for students.

---

## How It Works
- **Authentication:** Teachers can register and login. JWT is used for secure API access.
- **Student CRUD:** Teachers can add, edit, and delete students. All changes are synced with the backend database.
- **Attendance:** Teachers can mark/unmark attendance for students and teachers. Attendance is tracked per day and stored in history.
- **UI:** All actions (add/edit/delete) use dialogs for a smooth user experience. State is managed via React Context.

---

## Setup Instructions

### 1. Clone the Repository
```
git clone <repo-url>
cd Pahal
```

### 2. Install Dependencies
- **Frontend:**
  ```
  cd client
  npm install
  ```
- **Backend:**
  ```
  cd server
  npm install
  ```

### 3. Configure Environment
- Set up MongoDB and update connection string in `server/config/db.js`.
- (Optional) Set environment variables for JWT secret, etc.

### 4. Run the App
- **Backend:**
  ```
  cd server
  npm start
  ```
- **Frontend:**
  ```
  cd client
  npm run dev
  ```

---

## API Endpoints (Sample)
- `POST   /api/v1/student/add`         — Add a new student
- `GET    /api/v1/student/all`         — Get all students
- `PUT    /api/v1/student/:id`         — Update a student
- `DELETE /api/v1/student/:id`         — Delete a student

---

## Contribution
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)
