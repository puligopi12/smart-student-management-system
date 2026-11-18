-- ===================================================================
-- AI-POWERED SMART STUDENT MANAGEMENT SYSTEM
-- Sample Data Script: Realistic University Dataset
-- ===================================================================

USE student_management_db;

-- 1. USERS (BCrypt hashed passwords for 'admin123', 'teacher123', 'student123')
-- BCrypt for 'admin123': $2a$10$wE435pXNqU6hK3F4VjRz0e98.R3sFwBvT.sQeR7Nq6.WqA6aN8kWW
-- BCrypt for 'password123': $2a$10$e7P3z5C8Y8M1W1e2T.8s8.eH1lZ9C2d4F.V4pB9Q7h6A5n2b.M2pW
-- We use standard known BCrypt hash for 'admin123': $2a$10$G0jT/i3yG9rI5n3Pj4Z1mODo5I5E8uG0GvLhRz6eWdK6aB6jZcEee
-- Spring Boot security config will also automatically seed or re-hash if needed.

INSERT INTO users (id, username, password, email, full_name, role, active) VALUES
(1, 'admin', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'admin@smartcampus.edu', 'System Administrator', 'ROLE_ADMIN', 1),
(2, 'prof.rajesh', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'rajesh.kumar@smartcampus.edu', 'Dr. Rajesh Kumar', 'ROLE_TEACHER', 1),
(3, 'prof.priya', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'priya.sharma@smartcampus.edu', 'Dr. Priya Sharma', 'ROLE_TEACHER', 1),
(4, 'rahul22', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'rahul.sharma@student.edu', 'Rahul Sharma', 'ROLE_STUDENT', 1),
(5, 'sneha22', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', 'sneha.patel@student.edu', 'Sneha Patel', 'ROLE_STUDENT', 1);

-- 2. DEPARTMENTS
INSERT INTO departments (id, department_name, department_code, description) VALUES
(1, 'Computer Science & Engineering', 'CSE', 'Focuses on computation, algorithms, software systems, and artificial intelligence.'),
(2, 'Electronics & Communication Engineering', 'ECE', 'Covers electronic circuits, communications, signal processing, and embedded systems.'),
(3, 'Mechanical Engineering', 'MECH', 'Covers thermodynamics, mechanics, robotics, and manufacturing engineering.'),
(4, 'Civil Engineering', 'CIVIL', 'Covers structural engineering, geotechnical analysis, and environmental engineering.'),
(5, 'Information Technology', 'IT', 'Focuses on enterprise software, network administration, databases, and cloud computing.');

-- 3. COURSES
INSERT INTO courses (id, course_name, course_code, department_id, total_credits, total_semesters, description) VALUES
(1, 'Bachelor of Technology in Computer Science', 'BTECH-CSE', 1, 160, 8, 'Full 4-year undergraduate degree in Computer Science.'),
(2, 'Bachelor of Technology in Electronics', 'BTECH-ECE', 2, 160, 8, 'Full 4-year undergraduate degree in Electronics & Communications.'),
(3, 'Bachelor of Technology in Mechanical', 'BTECH-MECH', 3, 160, 8, 'Full 4-year undergraduate degree in Mechanical Engineering.'),
(4, 'Bachelor of Technology in Civil', 'BTECH-CIVIL', 4, 160, 8, 'Full 4-year undergraduate degree in Civil Engineering.'),
(5, 'Bachelor of Technology in Information Tech', 'BTECH-IT', 5, 160, 8, 'Full 4-year undergraduate degree in Information Technology.');

-- 4. TEACHERS
INSERT INTO teachers (id, user_id, employee_id, full_name, email, phone_number, department_id, designation, qualification, joining_date) VALUES
(1, 2, 'EMP-CSE-001', 'Dr. Rajesh Kumar', 'rajesh.kumar@smartcampus.edu', '+91 9876543210', 1, 'Professor & HOD', 'Ph.D. in Computer Science', '2018-06-15'),
(2, 3, 'EMP-ECE-002', 'Dr. Priya Sharma', 'priya.sharma@smartcampus.edu', '+91 9876543211', 2, 'Associate Professor', 'Ph.D. in VLSI Systems', '2019-07-20'),
(3, NULL, 'EMP-MECH-003', 'Prof. Amit Verma', 'amit.verma@smartcampus.edu', '+91 9876543212', 3, 'Assistant Professor', 'M.Tech in Thermal Engg', '2020-01-10'),
(4, NULL, 'EMP-CIVIL-004', 'Dr. Sunita Deshmukh', 'sunita.deshmukh@smartcampus.edu', '+91 9876543213', 4, 'Professor', 'Ph.D. in Structural Engg', '2017-08-01'),
(5, NULL, 'EMP-IT-005', 'Prof. Vikram Malhotra', 'vikram.malhotra@smartcampus.edu', '+91 9876543214', 5, 'Assistant Professor', 'M.Tech in Cloud Computing', '2021-02-15');

-- 5. SEMESTERS
INSERT INTO semesters (id, semester_number, semester_name, academic_year) VALUES
(1, 1, 'Semester 1 - Fall', 2022),
(2, 2, 'Semester 2 - Spring', 2022),
(3, 3, 'Semester 3 - Fall', 2023),
(4, 4, 'Semester 4 - Spring', 2023),
(5, 5, 'Semester 5 - Fall', 2024),
(6, 6, 'Semester 6 - Spring', 2024),
(7, 7, 'Semester 7 - Fall', 2025),
(8, 8, 'Semester 8 - Spring', 2025);

-- 6. SUBJECTS
INSERT INTO subjects (id, subject_name, subject_code, department_id, semester, credits, max_marks) VALUES
-- CSE Subjects
(1, 'Data Structures & Algorithms', 'CS301', 1, 3, 4, 100),
(2, 'Database Management Systems', 'CS302', 1, 3, 4, 100),
(3, 'Operating Systems', 'CS401', 1, 4, 3, 100),
(4, 'Computer Networks', 'CS402', 1, 4, 3, 100),
(5, 'Artificial Intelligence', 'CS501', 1, 5, 4, 100),
-- ECE Subjects
(6, 'Digital Signal Processing', 'EC301', 2, 3, 4, 100),
(7, 'Microprocessors & Microcontrollers', 'EC302', 2, 3, 4, 100),
(8, 'Analog & Digital Communication', 'EC401', 2, 4, 3, 100),
-- MECH Subjects
(9, 'Thermodynamics & Heat Transfer', 'ME301', 3, 3, 4, 100),
(10, 'Fluid Mechanics & Machinery', 'ME302', 3, 3, 4, 100),
-- CIVIL Subjects
(11, 'Structural Analysis', 'CE301', 4, 3, 4, 100),
(12, 'Geotechnical Engineering', 'CE302', 4, 3, 4, 100),
-- IT Subjects
(13, 'Web Technologies & Frameworks', 'IT301', 5, 3, 3, 100),
(14, 'Cloud Computing & DevOps', 'IT401', 5, 4, 4, 100);

-- 7. STUDENTS (Including 22CS101, Rahul, CSE, 2025 batch, attendance < 75%, marks > 80, ECE, etc.)
INSERT INTO students (id, user_id, full_name, roll_number, email, phone_number, gender, date_of_birth, address, department_id, course_id, academic_year, semester, admission_date, status, attendance_percentage, average_marks) VALUES
(1, 4, 'Rahul Sharma', '22CS101', 'rahul.sharma@student.edu', '+91 9811122201', 'Male', '2004-05-14', 'Flat 402, Green Valley Apartments, Bangalore', 1, 1, 2025, 5, '2022-08-10', 'ACTIVE', 88.5, 89.2),
(2, 5, 'Sneha Patel', '22CS102', 'sneha.patel@student.edu', '+91 9811122202', 'Female', '2004-08-22', '12, Sunrise Residency, Pune', 1, 1, 2025, 5, '2022-08-10', 'ACTIVE', 92.0, 94.5),
(3, NULL, 'Rahul Verma', '22CS103', 'rahul.verma@student.edu', '+91 9811122203', 'Male', '2003-12-05', 'Sector 15, Rohini, New Delhi', 1, 1, 2025, 5, '2022-08-12', 'ACTIVE', 78.4, 82.0),
(4, NULL, 'Ananya Iyer', '22EC101', 'ananya.iyer@student.edu', '+91 9811122204', 'Female', '2004-02-18', '24, TTK Road, Alwarpet, Chennai', 2, 2, 2025, 5, '2022-08-11', 'ACTIVE', 95.0, 91.0),
(5, NULL, 'Vikram Singh', '22EC102', 'vikram.singh@student.edu', '+91 9811122205', 'Male', '2003-11-30', 'H-104, Malviya Nagar, Jaipur', 2, 2, 2025, 5, '2022-08-11', 'ACTIVE', 81.2, 74.5),
(6, NULL, 'Kavita Reddy', '23CS101', 'kavita.reddy@student.edu', '+91 9811122206', 'Female', '2005-04-10', 'Plot 45, Jubilee Hills, Hyderabad', 1, 1, 2025, 3, '2023-08-05', 'ACTIVE', 68.5, 84.0),
(7, NULL, 'Rohan Gupta', '23ME101', 'rohan.gupta@student.edu', '+91 9811122207', 'Male', '2004-09-17', 'B-12, Civil Lines, Kanpur', 3, 3, 2024, 3, '2023-08-06', 'ACTIVE', 71.0, 68.0),
(8, NULL, 'Pooja Nair', '23IT101', 'pooja.nair@student.edu', '+91 9811122208', 'Female', '2005-01-25', 'Palm Grove Villa, Kochi', 5, 5, 2025, 3, '2023-08-05', 'ACTIVE', 85.0, 88.0),
(9, NULL, 'Arjun Mehta', '22CE101', 'arjun.mehta@student.edu', '+91 9811122209', 'Male', '2004-03-08', '45, Navrangpura, Ahmedabad', 4, 4, 2024, 5, '2022-08-14', 'ACTIVE', 64.0, 62.5),
(10, NULL, 'Divya Chawla', '22CS104', 'divya.chawla@student.edu', '+91 9811122210', 'Female', '2004-07-19', 'Block C, Vasant Kunj, New Delhi', 1, 1, 2025, 5, '2022-08-10', 'ACTIVE', 96.5, 95.8),
(11, NULL, 'Mohd Farhan', '22CS105', 'farhan.mohd@student.edu', '+91 9811122211', 'Male', '2003-10-12', 'Gomti Nagar, Lucknow', 1, 1, 2025, 5, '2022-08-12', 'ACTIVE', 72.5, 78.0),
(12, NULL, 'Meera Nambiar', '22EC103', 'meera.n@student.edu', '+91 9811122212', 'Female', '2004-06-03', 'MG Road, Ernakulam, Kerala', 2, 2, 2025, 5, '2022-08-11', 'ACTIVE', 89.0, 85.5),
(13, NULL, 'Siddharth Rao', '23CS102', 'siddharth.rao@student.edu', '+91 9811122213', 'Male', '2005-03-21', 'Koramangala 4th Block, Bangalore', 1, 1, 2025, 3, '2023-08-05', 'ACTIVE', 84.0, 81.5),
(14, NULL, 'Tanvi Kulkarni', '23IT102', 'tanvi.k@student.edu', '+91 9811122214', 'Female', '2005-10-09', 'Kothrud, Pune', 5, 5, 2025, 3, '2023-08-05', 'ACTIVE', 90.5, 87.2),
(15, NULL, 'Karthik Balan', '22ME102', 'karthik.b@student.edu', '+91 9811122215', 'Male', '2004-01-16', 'Gandhinagar, Adyar, Chennai', 3, 3, 2024, 5, '2022-08-15', 'INACTIVE', 52.0, 58.0),
(16, NULL, 'Neha Joshi', '22CS106', 'neha.joshi@student.edu', '+91 9811122216', 'Female', '2004-11-28', 'Shivaji Nagar, Nagpur', 1, 1, 2025, 5, '2022-08-10', 'ACTIVE', 91.5, 90.0),
(17, NULL, 'Aakash Bhatt', '23ECE104', 'aakash.bhatt@student.edu', '+91 9811122217', 'Male', '2005-02-14', 'Dehradun Cantt, Uttarakhand', 2, 2, 2025, 3, '2023-08-07', 'ACTIVE', 69.0, 71.5),
(18, NULL, 'Shreya Sengupta', '22CS107', 'shreya.s@student.edu', '+91 9811122218', 'Female', '2004-04-01', 'Salt Lake Sector 1, Kolkata', 1, 1, 2025, 5, '2022-08-10', 'ACTIVE', 94.0, 93.0),
(19, NULL, 'Nikhil Yadav', '23CIVIL102', 'nikhil.yadav@student.edu', '+91 9811122219', 'Male', '2005-06-18', 'DLF Phase 3, Gurgaon', 4, 4, 2024, 3, '2023-08-08', 'ACTIVE', 76.5, 73.0),
(20, NULL, 'Ishita Roy', '22IT103', 'ishita.roy@student.edu', '+91 9811122220', 'Female', '2004-09-05', 'Ballygunge Circular Road, Kolkata', 5, 5, 2025, 5, '2022-08-10', 'ACTIVE', 86.0, 89.0);

-- 8. ATTENDANCE SAMPLES
INSERT INTO attendance (student_id, attendance_date, status, remarks, marked_by_teacher_id) VALUES
-- Rahul Sharma (1)
(1, '2026-11-10', 'PRESENT', 'Attended DSA class', 1),
(1, '2026-11-11', 'PRESENT', 'Active participation', 1),
(1, '2026-11-12', 'PRESENT', 'Lab session completed', 1),
(1, '2026-11-13', 'ABSENT', 'Medical leave', 1),
(1, '2026-11-14', 'PRESENT', 'Regular lecture', 1),
-- Sneha Patel (2)
(2, '2026-11-10', 'PRESENT', 'On time', 1),
(2, '2026-11-11', 'PRESENT', 'On time', 1),
(2, '2026-11-12', 'PRESENT', 'Lab session completed', 1),
(2, '2026-11-13', 'PRESENT', 'On time', 1),
(2, '2026-11-14', 'PRESENT', 'On time', 1),
-- Rahul Verma (3)
(3, '2026-11-10', 'PRESENT', 'On time', 1),
(3, '2026-11-11', 'ABSENT', 'Uninformed leave', 1),
(3, '2026-11-12', 'PRESENT', 'Lab completed', 1),
(3, '2026-11-13', 'PRESENT', 'On time', 1),
-- Ananya Iyer (4)
(4, '2026-11-10', 'PRESENT', 'Excellent attendance', 2),
(4, '2026-11-11', 'PRESENT', 'On time', 2),
(4, '2026-11-12', 'PRESENT', 'On time', 2),
-- Kavita Reddy (6) - Below 75%
(6, '2026-11-10', 'ABSENT', 'Unexcused', 1),
(6, '2026-11-11', 'ABSENT', 'Unexcused', 1),
(6, '2026-11-12', 'PRESENT', 'Late arrival', 1),
-- Rohan Gupta (7) - Below 75%
(7, '2026-11-10', 'ABSENT', 'Sick leave', 3),
(7, '2026-11-11', 'PRESENT', 'On time', 3),
(7, '2026-11-12', 'ABSENT', 'Unexcused', 3);

-- 9. MARKS SAMPLES
INSERT INTO marks (student_id, subject_id, semester, marks_obtained, max_marks, grade, exam_type, exam_date) VALUES
-- Rahul Sharma (1) - High scorer
(1, 1, 3, 91.0, 100.0, 'A+', 'FINAL', '2023-12-15'),
(1, 2, 3, 88.0, 100.0, 'A', 'FINAL', '2023-12-18'),
(1, 3, 4, 85.0, 100.0, 'A', 'FINAL', '2024-05-20'),
(1, 4, 4, 92.5, 100.0, 'A+', 'FINAL', '2024-05-24'),
-- Sneha Patel (2) - Top performer
(2, 1, 3, 96.0, 100.0, 'O', 'FINAL', '2023-12-15'),
(2, 2, 3, 94.0, 100.0, 'O', 'FINAL', '2023-12-18'),
(2, 3, 4, 93.0, 100.0, 'O', 'FINAL', '2024-05-20'),
(2, 4, 4, 95.0, 100.0, 'O', 'FINAL', '2024-05-24'),
-- Rahul Verma (3)
(3, 1, 3, 82.0, 100.0, 'A', 'FINAL', '2023-12-15'),
(3, 2, 3, 80.0, 100.0, 'A', 'FINAL', '2023-12-18'),
(3, 3, 4, 84.0, 100.0, 'A', 'FINAL', '2024-05-20'),
-- Ananya Iyer (4) - Top ECE performer
(4, 6, 3, 92.0, 100.0, 'A+', 'FINAL', '2023-12-16'),
(4, 7, 3, 90.0, 100.0, 'A+', 'FINAL', '2023-12-19'),
(4, 8, 4, 91.0, 100.0, 'A+', 'FINAL', '2024-05-21'),
-- Kavita Reddy (6) - Scored > 80
(6, 1, 3, 84.0, 100.0, 'A', 'FINAL', '2023-12-15'),
(6, 2, 3, 85.0, 100.0, 'A', 'FINAL', '2023-12-18'),
-- Divya Chawla (10) - Highest rank
(10, 1, 3, 97.0, 100.0, 'O', 'FINAL', '2023-12-15'),
(10, 2, 3, 95.0, 100.0, 'O', 'FINAL', '2023-12-18'),
(10, 3, 4, 94.5, 100.0, 'O', 'FINAL', '2024-05-20'),
(10, 4, 4, 96.5, 100.0, 'O', 'FINAL', '2024-05-24');
