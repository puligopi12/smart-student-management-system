# SmartEdu — AI-Powered Smart Student Management System

A production-grade, responsive, full-stack academic administration system featuring Spring Boot 3, Java 21, MySQL 8, React.js 18, Tailwind CSS, JWT authentication, and an intelligent Natural Language AI Search Assistant.

---

## 1. System Architecture Overview

```
                      +------------------------------------------+
                      |         React.js Frontend (Vite)         |
                      |  - Modern University Dashboard           |
                      |  - Dark / Light Theme Switching          |
                      |  - Interactive Recharts Telemetry        |
                      |  - Floating Action AI Search Chatbot     |
                      +--------------------+---------------------+
                                           |  REST APIs (Axios + JWT)
                                           v
+-----------------------------------------------------------------------------------+
|                        Spring Boot 3.3.5 Backend (Java 21)                        |
|                                                                                   |
|  +--------------------+   +---------------------+   +--------------------------+  |
|  | Controller Layer   |-->| Service Layer       |-->| Repository Layer         |  |
|  | REST Endpoints     |   | Business Logic      |   | Spring Data JPA / Spec   |  |
|  +--------------------+   +---------------------+   +--------------------------+  |
|           ^                         ^                            |                |
|           |                         |                            v                |
|  +--------------------+   +---------------------+   +--------------------------+  |
|  | Security Layer     |   | AI Assistant Engine |   | MySQL 8.0 Database       |  |
|  | JWT & Spring Sec 6 |   | LLM & NLP Heuristic |   | Normalized Schema        |  |
|  +--------------------+   +---------------------+   +--------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Key Architectural Highlights

1. **Strict AI Security (Prompt Injection Safe)**:
   - **Never allows external AI models to generate or execute arbitrary SQL.**
   - Converts natural conversational questions into a typed, sanitized Java `StudentSearchCriteria` DTO.
   - Executes parameterized database queries strictly using JPA CriteriaBuilder & Specifications.
   - Dual-engine AI processing: supports Google Gemini / OpenAI via API key, with seamless offline heuristic NLP parser fallback ensuring 100% reliability with zero configuration.

2. **Role-Based Authorization (RBAC)**:
   - **ROLE_ADMIN**: Full system control (Student CRUD, Teachers, Departments, Analytics, System settings).
   - **ROLE_TEACHER**: Attendance marking, Marks entry, Student search, Performance review.
   - **ROLE_STUDENT**: Personal profile, Individual attendance ledger, Semester scorecard & transcripts.

3. **Production Data Model**:
   - Normalized MySQL relational schema: `users`, `students`, `teachers`, `departments`, `courses`, `attendance`, `subjects`, `marks`, `semesters`.
   - Foreign key constraints, unique indexes, cascading rules, and audited timestamps.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM 6, Tailwind CSS, Lucide Icons, Recharts, Axios |
| **Backend** | Java 21, Spring Boot 3.3.5, Spring Security 6, Spring Data JPA, Hibernate, JJWT 0.12.6, Bean Validation |
| **Database** | MySQL 8.0+ |
| **AI Integration** | Configurable LLM Provider (Google Gemini / OpenAI) + Deterministic Heuristic NLP Engine |
| **Build & Tooling** | Apache Maven 3.9+, Node.js 24+, Postman, VS Code / IntelliJ IDEA |

---

## 3. Pre-Configured Demo Credentials

The system initializes with realistic demo credentials for testing each role:

| Role | Username | Password | Email | Description |
|---|---|---|---|---|
| **ADMIN** | `admin` | `admin123` | `admin@smartcampus.edu` | Full university administrator permissions |
| **TEACHER** | `prof.rajesh` | `teacher123` | `rajesh.kumar@smartcampus.edu` | Dr. Rajesh Kumar (HOD, Computer Science) |
| **STUDENT** | `rahul22` | `student123` | `rahul.sharma@student.edu` | Rahul Sharma (Roll: `22CS101`, CSE, Batch 2025) |

*(Note: The login screen also features 1-click credential auto-fill chips for instant sign in).*

---

## 4. Database Setup & Initialization

### MySQL Database Creation
The database scripts are located in `database/`:
- `database/schema.sql`: Complete DDL schema with constraints and indexes.
- `database/sample-data.sql`: 20+ realistic student records, attendance logs, and exam marks.

To initialize manually in MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample-data.sql
```

### Application Connection Properties (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=newpassword
```
*(Environment variables `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` can override these defaults).*

---

## 5. Execution Instructions

### A. Run Spring Boot Backend

```bash
cd student-management-system/backend

# Clean compile and package
mvn clean package -DskipTests

# Run application
java -jar target/student-management-backend-1.0.0.jar
```
Backend runs at: **`http://localhost:8080`**

### B. Run React Frontend

```bash
cd student-management-system/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend runs at: **`http://localhost:5173`**

---

## 6. AI Natural Language Search Assistant

Click the floating **AI Student Search** badge in the bottom-right corner to open the intelligent search panel.

### Supported Example Queries (Tested & Grounded in MySQL)

| # | Natural Language Query | Interpreted Criteria | Sample Match in Seed Data |
|---|---|---|---|
| 1 | `Find student with roll number 22CS101` | Exact roll match: `22CS101` | Rahul Sharma (CSE, 88.5% Att, 89.2% Marks) |
| 2 | `Search for students named Rahul` | Name search: `%Rahul%` | Rahul Sharma (`22CS101`), Rahul Verma (`22CS103`) |
| 3 | `Show all CSE department students` | Department code: `CSE` | 9 Computer Science engineering students |
| 4 | `Find students from the 2025 batch` | Academic year: `2025` | 16 enrolled batch 2025 students |
| 5 | `Show students with attendance below 75%` | Attendance threshold: `< 75.0%` | Kavita Reddy (68.5%), Rohan Gupta (71.0%), etc. |
| 6 | `Find students who scored more than 80 marks` | Marks filter: `> 80.0%` | Divya Chawla (95.8%), Sneha Patel (94.5%), etc. |
| 7 | `Show the top 10 students based on marks` | Top 10 sort: `averageMarks DESC` | Ranked honor roll leaderboard |
| 8 | `Sort students by name alphabetically` | Sort: `fullName ASC` | Ordered roster from A to Z |
| 9 | `Find students who belong to the ECE department` | Department: `ECE` | Ananya Iyer (`22EC101`), Vikram Singh, etc. |
| 10 | `Find a student using their email address rahul.sharma@student.edu` | Email filter: `rahul.sharma@student.edu` | Rahul Sharma (`22CS101`) |

---

## 7. REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticates username/password; returns JWT token + user profile.
- `POST /api/auth/register`: Creates new user account.
- `GET /api/auth/me`: Returns profile of the active authenticated principal.

### Students (`/api/students`)
- `GET /api/students`: Paginated, filterable, sortable student list.
  - Query params: `page`, `size`, `sortBy`, `sortDir`, `search`, `departmentId`, `academicYear`, `semester`, `status`, `minAttendance`, `maxAttendance`, `minMarks`, `maxMarks`.
- `GET /api/students/{id}`: Returns student details by primary key ID.
- `GET /api/students/roll-number/{rollNumber}`: Returns student details by unique roll number.
- `POST /api/students`: Enrolls a new student (`ROLE_ADMIN` only; validates unique roll number & email).
- `PUT /api/students/{id}`: Updates existing student record (`ROLE_ADMIN` only).
- `DELETE /api/students/{id}`: Deletes student and cascades child records (`ROLE_ADMIN` only).
- `GET /api/students/search`: Traditional multi-field search endpoint.

### AI Search (`/api/ai`)
- `POST /api/ai/student-search`:
  ```json
  // Request
  { "query": "Show students with attendance below 75%" }

  // Response
  {
    "success": true,
    "data": {
      "query": "Show students with attendance below 75%",
      "explanation": "Attendance below 75.0%",
      "totalResults": 6,
      "results": [ ... ],
      "aiProvider": "internal-nlp-engine",
      "executionTimeMs": 14
    }
  }
  ```

### Attendance (`/api/attendance`)
- `POST /api/attendance`: Records daily attendance for an individual student.
- `POST /api/attendance/batch`: Records batch daily attendance for a department roster.
- `GET /api/attendance/student/{studentId}`: Returns student's attendance percentage & history.
- `GET /api/attendance/department`: Filters attendance by department and date.

### Marks (`/api/marks`)
- `POST /api/marks`: Records or updates subject exam score and computes letter grade.
- `GET /api/marks/student/{studentId}`: Returns semester scorecard and GPA calculation.
- `GET /api/marks/top-performers`: Returns top 10 ranked student leaderboard.

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/statistics`: Returns university headcount metrics, active/inactive counts, average attendance %, average performance %, and Recharts datasets.

---

## 8. Verification & Test Summary

All automated verification tests passed:
- `Context Load & Entity Relationship Mapping`: Passed on Java 21 & MySQL 8.
- `JWT Authentication & Password Hash Verification`: Verified for Admin, Teacher, Student roles.
- `Duplicate Roll Number Validation`: Returned HTTP 409 Conflict as required.
- `Role-Based Access Enforcement`: Student role attempting admin POST returned HTTP 403 Forbidden.
- `Invalid Credentials Handling`: Returned HTTP 401 Unauthorized.
- `10 AI Natural Language Query Suite`: 10/10 queries successfully interpreted and executed.
- `Frontend Build`: Vite production build bundled cleanly (`dist/assets/index.js`).
