# 🎓 EduPulse — Full Stack Student Management System
### Developed with Spring Boot 3 + React + PostgreSQL

A full-stack, production-grade **Student Management System** built with **Java 21, Spring Boot 3.3.4, Spring Data JPA, PostgreSQL 18, and modern React (Vite)**.

---

## 📁 Project Architecture

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
│       │   └── config/                 # CorsConfig & OpenApiConfig (Swagger UI)
│       └── main/resources/
│           └── application.properties  # PostgreSQL DB configuration
│
├── Student_Management_Fronend/          # React (Vite) Frontend Application
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx              # Brand, live backend ping, theme toggle, add CTA
│       │   ├── StatsCards.jsx          # KPI metrics (Total students, Avg age, Courses, DB)
│       │   ├── CourseBreakdown.jsx     # Interactive course distribution progress & chips
│       │   ├── StudentTable.jsx        # Data table with sorting, search, CSV export
│       │   ├── StudentModal.jsx        # Add & Edit Student modal with validations
│       │   ├── StudentDetailModal.jsx  # Student profile card modal
│       │   ├── DeleteConfirmModal.jsx  # Safe deletion confirmation dialog
│       │   └── Toast.jsx               # Floating toast notifications
│       ├── services/
│       │   └── studentService.js       # REST API client
│       ├── App.jsx                     # State management & view composition
│       ├── App.css                     # Design system, glassmorphism & responsive styles
│       └── index.css                   # Theme tokens (Dark/Light mode) & base reset
│
└── Student_Management_Frontend -> Student_Management_Fronend (Symlink)
```

---

## ⚡ Quick Start

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is running locally on port `5432`:
- **Database**: `student_db`
- **Username**: `postgres`
- **Password**: `root` (configurable in `Student_Management_Backend/src/main/resources/application.properties`)

### 2. Run the Backend (Spring Boot)
```bash
cd Student_Management_Backend
./mvnw spring-boot:run
```
- **Backend API**: `http://localhost:8080/api/students`
- **Interactive Swagger UI**: `http://localhost:8080/swagger-ui/index.html`

### 3. Run the Frontend (React + Vite)
```bash
cd Student_Management_Fronend
npm install
npm run dev
```
- **Web App**: `http://localhost:5173/`

---

## 🚀 Key Features

- **Full CRUD Operations**: Register students, update profiles, view detailed records, and permanently remove records.
- **Dynamic Multi-Field Search**: Real-time debounce search matching names and email addresses.
- **Course Stream Filter**: Interactive visual bar breakdown and stream filter chips (AI_DS, Software Engineering, ETC, Cybersecurity, etc.).
- **Sortable Columns**: Instant multi-directional sorting by ID, Name, Email, Age, Course, or Enrollment Date.
- **Export to CSV**: Download student rosters as CSV spreadsheets with a single click.
- **Live System Health Monitor**: Live ping to the Spring Boot backend displaying connection status.
- **Dark & Light Mode**: Premium glassmorphic interface with theme persistence in `localStorage`.
- **OpenAPI & Swagger Documentation**: Auto-generated interactive API documentation at `/swagger-ui/index.html`.
- **Validation & Exception Handling**: Server-side Bean Validation (`@NotBlank`, `@Email`, `@Min`, `@Max`) with structured JSON error responses.

---

## 🔌 API Endpoints Reference

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
| `GET` | `/swagger-ui/index.html` | Swagger UI documentation |
