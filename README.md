# Academic Information System: Student Management System
### Spring Boot 3 + React + PostgreSQL

A full-stack, enterprise-grade Student Management System and Academic Records Registry built with Java 21, Spring Boot 3.3.4, Spring Data JPA, PostgreSQL, and React (Vite).

---

## Project Architecture

```
Student-Management-System-Java/
├── Student_Management_Backend/          # Spring Boot 3.3.4 REST API
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd
│   └── src/
│       ├── main/java/com/student/management/
│       │   ├── controller/             # StudentController.java
│       │   ├── model/                  # Student.java (JPA Entity)
│       │   ├── repository/             # StudentRepository.java (Spring Data JPA)
│       │   ├── service/                # StudentService & StudentServiceImpl
│       │   ├── dto/                    # StudentDto & DashboardStatsDto
│       │   ├── exception/              # GlobalExceptionHandler & Custom Exceptions
│       │   └── config/                 # CorsConfig
│       └── main/resources/
│           └── application.properties  # PostgreSQL DB configuration
│
└── Student_Management_Frontend/         # React (Vite) Frontend Application
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── components/
        │   ├── Navbar.jsx                  # Institutional header, system status, theme toggle
        │   ├── MetricsBar.jsx              # Administrative cohort summary metrics
        │   ├── ProgramDistribution.jsx     # Degree stream distribution and department filters
        │   ├── StudentTable.jsx            # High-density roster table with batch operations, pagination
        │   ├── StudentModal.jsx            # Student registration and record editing modal
        │   ├── StudentDetailModal.jsx      # Official student record profile sheet (printable)
        │   ├── DeleteConfirmModal.jsx      # Safe single and batch deletion confirmation dialog
        │   ├── InstitutionalPolicyModal.jsx# FERPA Privacy Policy and Terms of Service dialogs
        │   ├── Icons.jsx                   # Native SVG icons (zero third-party icon bloat)
        │   └── Toast.jsx                   # Status alert notifications
        ├── services/
        │   └── studentService.js           # REST API client
        ├── App.jsx                         # State management & view composition
        ├── App.css                         # Enterprise institutional stylesheet & responsiveness
        └── index.css                       # System theme tokens & accessible base styles
```

---

## Quick Start

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is running locally on port 5432:
- Database: `student_db`
- Username: `postgres`
- Password: `root` (configurable in `Student_Management_Backend/src/main/resources/application.properties`)

### 2. Run the Backend (Spring Boot)
```bash
cd Student_Management_Backend
./mvnw spring-boot:run
```
- Backend REST API: `http://localhost:8080/api/students`

### 3. Run the Frontend (React + Vite)
```bash
cd Student_Management_Frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173/`

---

## System Capabilities

- Full CRUD Operations: Register students, modify records, inspect detailed academic profiles, and delete records with verification.
- Batch Operations: Multi-row selection supporting bulk CSV roster export and bulk database deletion.
- Multi-Field Filtering: Real-time search across student names, institutional emails, and record IDs, with departmental and age cohort filters.
- Pagination and Sorting: Multi-column sorting (ID, Name, Age, Department, Enrollment Date) with adjustable page sizes (10, 25, 50, All).
- Native Print Roster Support: Dedicated print styling for official academic registry reports.
- Real Loading Skeletons: Structured tabular skeleton indicators during data retrieval.
- Institutional Compliance: Built-in FERPA Privacy Policy and System Terms of Service governance dialogs.
- Clean Architecture: Native SVG icon system without third-party icon bloat, strict responsive grid adapting to mobile, tablet, and desktop displays.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students (supports `?search=` and `?course=`) |
| `GET` | `/api/students/paged` | Get paged students with pagination & sorting |
| `GET` | `/api/students/{id}` | Get student details by ID |
| `POST` | `/api/students` | Register a new student (validates email & age) |
| `PUT` | `/api/students/{id}` | Update existing student |
| `DELETE` | `/api/students/{id}` | Delete student record |
| `GET` | `/api/students/stats` | Get KPI metrics and course distribution breakdown |
| `GET` | `/api/students/courses` | List all unique courses |
